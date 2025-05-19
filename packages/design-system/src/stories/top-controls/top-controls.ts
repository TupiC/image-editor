import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import rotateLeftIcon from "../../assets/rotate-left.svg";
import flipHorizontalIcon from "../../assets/flip-horizontal.svg";
import undoIcon from "../../assets/undo.svg";
import { TupiImageEditor } from "@tupi/image-editor";
import { Easing } from "../../../../image-editor/dist/animation/animation-manager";

@customElement("top-controls")
export class TopControls extends LitElement {
    static styles = css`
        .canvas {
            background: #111;
            border-radius: 0.3rem;
            border: 1px solid #333;
            transition: all 0.5s;
            transform-style: preserve-3d;
        }

        .controls {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #222c;
            border-radius: 1.5rem;
            align-items: center;
            justify-content: flex-start;
        }

        control-button > button {
            padding: 0.3rem 0.8rem;
            border: 1px solid #5c5c5c;
            border-radius: 2rem;
            background: #5c5c5c5f;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: border 0.2s;
        }

        control-button > button:hover {
            border: 1px solid #ccc;
        }
        control-button > button:disabled {
            background: #5c5c5c2f;
            border: 1px solid #5c5c5c;
            cursor: not-allowed;
        }
        control-button > button:disabled img {
            background: #5c5c5c2f;
        }
        control-button > button img {
            width: 1.25rem;
            height: 1.25rem;
            stroke: white;
        }
        control-button > button span {
            font-size: 0.8rem;
        }
        control-button.flippedX > button > img {
            transform: rotateY(180deg);
        }
        control-button.flippedY > button > img {
            transform: rotateZ(90deg);
        }
    `;

    @property({ type: Object }) editor?: TupiImageEditor;
    @property({ type: Number }) width: number = 1600 * 0.5;
    @property({ type: Number }) height: number = 900 * 0.5;

    constructor() {
        super();
        this.addEventListener("control-click", (e) => {
            e.stopPropagation();
        });
    }

    async firstUpdated() {
        const canvas = this.renderRoot.querySelector(
            "#canvas"
        ) as HTMLCanvasElement;
        if (canvas) {
            this.editor = new TupiImageEditor(canvas, "demo.jpeg");
        } else {
            console.error("Canvas not found in renderRoot");
        }
    }

    render() {
        return html`
            <div>
                <div class="controls">
                    <control-button
                        icon=${undoIcon}
                        @control-click=${() => this._handleAction("undo")}
                    ></control-button>
                    <control-button
                        icon=${undoIcon}
                        class="flippedX"
                        @control-click=${() => this._handleAction("redo")}
                    ></control-button>
                </div>
                <div class="controls">
                    <control-button
                        label="Rotate Left"
                        icon=${rotateLeftIcon}
                        @control-click=${() =>
                            this._handleAction("rotate-left")}
                    ></control-button>
                    <control-button
                        label="Rotate Right"
                        icon=${rotateLeftIcon}
                        class="flippedX"
                        @control-click=${() =>
                            this._handleAction("rotate-right")}
                    ></control-button>
                    <control-button
                        label="Flip Horizontal"
                        icon=${flipHorizontalIcon}
                        @control-click=${() =>
                            this._handleAction("flip-horizontal")}
                    ></control-button>
                    <control-button
                        label="Flip Vertical"
                        icon=${flipHorizontalIcon}
                        class="flippedY"
                        @control-click=${() =>
                            this._handleAction("flip-vertical")}
                    ></control-button>
                </div>
                <canvas
                    id="canvas"
                    class="canvas"
                    width=${this.width}
                    height=${this.height}
                ></canvas>
            </div>
        `;
    }

    private _handleAction(action: string) {
        if (!this.editor) return;

        switch (action) {
            case "rotate-left":
                this.editor.rotate(-90, true, Easing.easeInOut, 150);
                break;
            case "rotate-right":
                this.editor.rotate(90, true, Easing.easeInOut, 150);
                break;
            case "flip-horizontal":
                this.editor.flip(true, false);
                break;
            case "flip-vertical":
                this.editor.flip(false, true);
                break;
            case "undo":
                this.editor.undo();
                break;
            case "redo":
                this.editor.redo();
                break;
        }

        this._emitAction(action);
    }

    private _emitAction(action: string) {
        this.dispatchEvent(
            new CustomEvent("top-control-action", {
                detail: { action },
                bubbles: true,
                composed: true,
            })
        );
    }
}
