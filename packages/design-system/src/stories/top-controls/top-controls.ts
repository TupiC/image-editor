import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import rotateLeftIcon from "../../assets/rotate-left.svg";
import flipHorizontalIcon from "../../assets/flip-horizontal.svg";

@customElement("top-controls")
export class TopControls extends LitElement {
    static styles = css`
        .controls {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;
            background: #222c;
            border-radius: 1.5rem;
            align-items: center;
            justify-content: flex-start;
        }
    `;

    render() {
        return html`
            <div class="controls">
                <control-button
                    label="Rotate Left"
                    icon=${rotateLeftIcon}
                    @control-click=${() => this._emitAction("rotate-left")}
                ></control-button>
                <control-button
                    label="Rotate Right"
                    icon=${rotateLeftIcon}
                    flippedX
                    @control-click=${() => this._emitAction("rotate-right")}
                ></control-button>
                <control-button
                    label="Flip Horizontal"
                    icon=${flipHorizontalIcon}
                    @control-click=${() => this._emitAction("flip-horizontal")}
                ></control-button>
                <control-button
                    label="Flip Vertical"
                    icon=${flipHorizontalIcon}
                    flippedY
                    @control-click=${() => this._emitAction("flip-vertical")}
                ></control-button>
            </div>
        `;
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
