export type ImageEditorAction = "crop" | "flip" | "rotate";

export class TupiImageEditor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private history: ImageData[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context not supported");
        this.ctx = ctx;
    }

    private saveState() {
        this.history.push(
            this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
    }

    undo() {
        const prev = this.history.pop();
        if (prev) {
            this.ctx.putImageData(prev, 0, 0);
        }
    }

    crop(x: number, y: number, width: number, height: number) {
        this.saveState();
        const cropped = this.ctx.getImageData(x, y, width, height);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.putImageData(cropped, 0, 0);
    }

    loadImage(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    flipHorizontal() {
        this.saveState();
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(this.canvas, 0, 0);
    }

    rotate(degrees: number) {
        this.saveState();
        const radians = (degrees * Math.PI) / 180;
        const { width, height } = this.canvas;

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d")!;
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(this.canvas, 0, 0);

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.rotate(radians);
        this.ctx.drawImage(tempCanvas, -width / 2, -height / 2);
        this.ctx.restore();
    }
}
