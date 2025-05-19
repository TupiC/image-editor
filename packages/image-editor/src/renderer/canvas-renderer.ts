import type { ImageState } from "../index";

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context not supported");
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(image: HTMLImageElement, state: ImageState) {
        this.clear();
        this.ctx.save();

        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = image.width / image.height;
        let renderWidth: number, renderHeight: number;
        if (imageAspect > canvasAspect) {
            renderWidth = this.canvas.width;
            renderHeight = this.canvas.width / imageAspect;
        } else {
            renderHeight = this.canvas.height;
            renderWidth = this.canvas.height * imageAspect;
        }
        const xOffset = (this.canvas.width - renderWidth) / 2;
        const yOffset = (this.canvas.height - renderHeight) / 2;

        if (state.rotation !== 0) {
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate((state.rotation * Math.PI) / 180);
            this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        }

        const rotateX = state.flip.vertical ? 180 : 0;
        const rotateY = state.flip.horizontal ? 180 : 0;
        this.canvas.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

        const {
            x: cropX,
            y: cropY,
            width: cropWidth,
            height: cropHeight,
        } = state.crop;
        const srcToDstX = image.width / renderWidth;
        const srcToDstY = image.height / renderHeight;

        this.ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            xOffset,
            yOffset,
            cropWidth / srcToDstX,
            cropHeight / srcToDstY
        );

        this.ctx.restore();
    }
}
