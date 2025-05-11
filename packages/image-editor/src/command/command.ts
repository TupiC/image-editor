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
}
