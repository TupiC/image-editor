export interface Command {
    execute(): void;
    undo(): void;
}

export class CommandInvoker {
    private history: Command[] = [];

    execute(command: Command): void {
        command.execute();
        this.history.push(command);
    }

    undo(): void {
        const command = this.history.pop();
        if (command) {
            command.undo();
        }
    }

    redo(): void {
        const command = this.history[this.history.length - 1];
        if (command) {
            command.execute();
        }
    }
}
