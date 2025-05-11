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
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
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
        // Clear and redraw canvas with current transformations
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply transformations based on imageState
        this.ctx.save();

        // Apply flip
        if (this.imageState.flip.horizontal || this.imageState.flip.vertical) {
            this.ctx.scale(
                this.imageState.flip.horizontal ? -1 : 1,
                this.imageState.flip.vertical ? -1 : 1
            );
        }

        // Apply rotation
        if (this.imageState.rotation !== 0) {
            this.ctx.rotate((this.imageState.rotation * Math.PI) / 180);
        }

        // Apply crop
        // Note: You'll need to implement the actual drawing logic for crop
        // This is just a placeholder
        // this.ctx.drawImage(/* cropped image */); //TODO

        this.ctx.restore();
    }
}
