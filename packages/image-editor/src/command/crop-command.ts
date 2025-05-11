import { Command } from "./command";

export class CropImageCommand implements Command {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private previousState: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    constructor(
        private image: { x: number; y: number; width: number; height: number },
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousState = {
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
        };
    }

    execute(): void {
        this.image.x = this.x;
        this.image.y = this.y;
        this.image.width = this.width;
        this.image.height = this.height;
    }

    undo(): void {
        this.image.x = this.previousState.x;
        this.image.y = this.previousState.y;
        this.image.width = this.previousState.width;
        this.image.height = this.previousState.height;
    }
}
