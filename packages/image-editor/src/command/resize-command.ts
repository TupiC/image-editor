import { Command } from "./command";

export class ResizeImageCommand implements Command {
    private width: number;
    private height: number;
    private previousWidth: number;
    private previousHeight: number;

    constructor(
        private image: { width: number; height: number },
        width: number,
        height: number
    ) {
        this.width = width;
        this.height = height;
        this.previousWidth = image.width;
        this.previousHeight = image.height;
    }

    execute(): void {
        this.image.width = this.width;
        this.image.height = this.height;
    }

    undo(): void {
        this.image.width = this.previousWidth;
        this.image.height = this.previousHeight;
    }
}
