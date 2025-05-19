import { Command } from "./command";

export class RotateImageCommand implements Command {
    private previousRotation: number;

    constructor(private image: { rotation: number }, private rotation: number) {
        this.previousRotation = image.rotation;
    }

    execute(): void {
        this.image.rotation += this.rotation;
    }

    undo(): void {
        this.image.rotation = this.previousRotation;
    }
}
