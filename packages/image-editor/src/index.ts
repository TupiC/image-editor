import { CommandInvoker } from "./command/command";
import { CropImageCommand } from "./command/crop-command";
import { FlipImageCommand } from "./command/flip-command";
import { ResizeImageCommand } from "./command/resize-command";
import { RotateImageCommand } from "./command/rotate-command";
import { CanvasRenderer } from "./renderer/canvas-renderer";
import {
    AnimationManager,
    Easing,
    EasingFunction,
} from "./animation/animation-manager";

export type ImageEditorAction = "crop" | "flip" | "rotate";

export type EditorConfig = {
    canvas?: HTMLCanvasElement;
    src?: string;
    width?: number;
    height?: number;
};

export type ImageState = {
    flip: { horizontal: boolean; vertical: boolean };
    rotation: number;
    crop: { x: number; y: number; width: number; height: number };
};

export class TupiImageEditor {
    private commandInvoker: CommandInvoker;
    private canvas: HTMLCanvasElement;
    private renderer: CanvasRenderer;
    private animationManager: AnimationManager;
    private image: HTMLImageElement | null = null;

    imageState: ImageState;

    constructor(canvas: HTMLCanvasElement | EditorConfig, src?: string) {
        if (canvas instanceof HTMLCanvasElement) {
            this.canvas = canvas;
        } else {
            this.canvas = canvas.canvas || document.createElement("canvas");
            if (canvas.width && canvas.height) {
                this.canvas.width = canvas.width;
                this.canvas.height = canvas.height;
            }
        }
        this.commandInvoker = new CommandInvoker();
        this.renderer = new CanvasRenderer(this.canvas);
        this.animationManager = new AnimationManager();

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

        if (canvas instanceof HTMLCanvasElement && src) {
            this.loadImage(src)
                .then(() => {
                    console.log("Image loaded successfully");
                })
                .catch((error) => {
                    console.error("Error loading image:", error);
                });
        } else if (!(canvas instanceof HTMLCanvasElement) && canvas.src) {
            this.loadImage(canvas.src)
                .then(() => {
                    console.log("Image loaded successfully");
                })
                .catch((error) => {
                    console.error("Error loading image:", error);
                });
        }
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

    saveImage(type?: string): string {
        const dataUrl = this.renderer.toDataURL(type);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return dataUrl;
    }

    flip(horizontal: boolean, vertical: boolean) {
        const command = new FlipImageCommand(this, horizontal, vertical);
        this.commandInvoker.execute(command);
        this.redraw();
    }

    rotate(
        degrees: number,
        animate: boolean,
        easing: EasingFunction,
        duration: number
    ) {
        if (!this.image) return;
        if (animate) {
            const from = { rotation: this.imageState.rotation };
            const to = { rotation: this.imageState.rotation + degrees };
            this.animationManager.animate({
                from,
                to,
                duration,
                easing,
                onUpdate: (state) => {
                    this.imageState.rotation = state.rotation;
                    this.redraw();
                },
                onComplete: () => {
                    this.imageState.rotation = to.rotation;
                    this.redraw();
                },
            });
        } else {
            const command = new RotateImageCommand(this.imageState, degrees);
            this.commandInvoker.execute(command);
            this.redraw();
        }
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

    redo() {
        this.commandInvoker.redo();
        this.redraw();
    }

    private redraw() {
        if (!this.image) return;
        this.renderer.render(this.image, this.imageState);
    }

    private fitImageToCanvas() {
        if (!this.image) return;
        this.imageState.crop = {
            x: 0,
            y: 0,
            width: this.image.width,
            height: this.image.height,
        };
        this.renderer.render(this.image, this.imageState);
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
