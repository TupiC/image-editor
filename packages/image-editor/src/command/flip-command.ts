import { TupiImageEditor } from "..";
import { Command } from "./command";

export class FlipImageCommand implements Command {
    private previousFlipState: { horizontal: boolean; vertical: boolean };

    constructor(
        private editor: TupiImageEditor,
        private horizontal: boolean,
        private vertical: boolean
    ) {
        this.previousFlipState = { ...editor.imageState.flip };
    }

    execute(): void {
        if (this.horizontal) {
            this.editor.imageState.flip.horizontal =
                !this.previousFlipState.horizontal;
        }
        if (this.vertical) {
            this.editor.imageState.flip.vertical =
                !this.previousFlipState.vertical;
        }
    }

    undo(): void {
        this.editor.imageState.flip = this.previousFlipState;
    }
}
