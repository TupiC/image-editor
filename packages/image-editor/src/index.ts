import { CommandInvoker } from "./command/command";
import { CropImageCommand } from "./command/crop-command";
import { FlipImageCommand } from "./command/flip-command";
import { ResizeImageCommand } from "./command/resize-command";
import { RotateImageCommand } from "./command/rotate-command";

export type ImageEditorAction = "crop" | "flip" | "rotate";

export type EditorConfig = {
    canvas?: HTMLCanvasElement;
    src?: string;
    width?: number;
    height?: number;
};

export class TupiImageEditor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private commandInvoker: CommandInvoker;
    private image: HTMLImageElement | null = null;

    imageState: {
        flip: { horizontal: boolean; vertical: boolean };
        rotation: number;
        crop: { x: number; y: number; width: number; height: number };
    };
    constructor(canvas: HTMLCanvasElement | EditorConfig, src?: string) {
        if (canvas instanceof HTMLCanvasElement) {
            this.canvas = canvas;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("2D context not supported");
            this.ctx = ctx;
            this.commandInvoker = new CommandInvoker();

            if (src) {
                this.loadImage(src)
                    .then(() => {
                        console.log("Image loaded successfully");
                    })
                    .catch((error) => {
                        console.error("Error loading image:", error);
                    });
            }
        } else {
            this.canvas = canvas.canvas || document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d")!;
            this.commandInvoker = new CommandInvoker();

            if (canvas.src) {
                this.loadImage(canvas.src)
                    .then(() => {
                        console.log("Image loaded successfully");
                    })
                    .catch((error) => {
                        console.error("Error loading image:", error);
                    });
            }

            if (canvas.width && canvas.height) {
                this.canvas.width = canvas.width;
                this.canvas.height = canvas.height;
            }
        }

        this.imageState = {
            flip: { horizontal: false, vertical: false },
            rotation: 0,
            crop: {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height,
            },
        };
    }

    loadImage(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                this.image = img;
                this.resetImageState();
                this.fitImageToCanvas();
                this.redraw();
                resolve();
            };
            img.onerror = (e) => {
                console.error("Image load error:", e);
                reject(new Error("Failed to load image"));
            };
            img.src = src;
        });
    }

    private fitImageToCanvas() {
        if (!this.image) return;

        const imageAspect = this.image.width / this.image.height;
        const canvasAspect = this.canvas.width / this.canvas.height;

        let renderWidth, renderHeight;

        if (imageAspect > canvasAspect) {
            renderWidth = this.canvas.width;
            renderHeight = this.canvas.width / imageAspect;
        } else {
            renderHeight = this.canvas.height;
            renderWidth = this.canvas.height * imageAspect;
        }

        this.canvas.width = renderWidth;
        this.canvas.height = renderHeight;

        this.imageState.crop = {
            x: 0,
            y: 0,
            width: this.image.width,
            height: this.image.height,
        };
    }

    flip(horizontal: boolean, vertical: boolean) {
        const command = new FlipImageCommand(this, horizontal, vertical);
        this.commandInvoker.execute(command);
        this.redraw();
    }

    rotate(degrees: number) {
        const command = new RotateImageCommand(this.imageState, degrees);
        this.commandInvoker.execute(command);
        this.redraw();
    }

    crop(x: number, y: number, width: number, height: number) {
        const command = new CropImageCommand(
            this.imageState.crop,
            x,
            y,
            width,
            height
        );
        this.commandInvoker.execute(command);
        this.redraw();
    }

    resize(width: number, height: number) {
        const command = new ResizeImageCommand(this.canvas, width, height);
        this.commandInvoker.execute(command);
        this.redraw();
    }

    undo() {
        this.commandInvoker.undo();
        this.redraw();
    }

    private redraw() {
        if (!this.image) {
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        if (this.imageState.rotation !== 0) {
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate((this.imageState.rotation * Math.PI) / 180);
            this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        }

        let scaleX = this.imageState.flip.horizontal ? -1 : 1;
        let scaleY = this.imageState.flip.vertical ? -1 : 1;
        this.ctx.scale(scaleX, scaleY);

        let x = this.imageState.flip.horizontal ? -this.canvas.width : 0;
        let y = this.imageState.flip.vertical ? -this.canvas.height : 0;

        const {
            x: cropX,
            y: cropY,
            width: cropWidth,
            height: cropHeight,
        } = this.imageState.crop;

        this.ctx.drawImage(
            this.image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            x,
            y,
            this.canvas.width,
            this.canvas.height
        );

        this.ctx.restore();
    }

    private resetImageState() {
        if (!this.image) {
            return;
        }

        this.imageState = {
            flip: { horizontal: false, vertical: false },
            rotation: 0,
            crop: {
                x: 0,
                y: 0,
                width: this.image.width,
                height: this.image.height,
            },
        };
    }
}
