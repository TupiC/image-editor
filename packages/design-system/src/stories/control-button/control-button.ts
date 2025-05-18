import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("control-button")
export class ControlButton extends LitElement {
    static styles = css`
        button {
            padding: 0.3rem 0.8rem;
            font-size: 0.8rem;
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
        button:hover {
            border: 1px solid #ccc;
        }
        button:disabled {
            background: #5c5c5c4d;
            cursor: not-allowed;
        }
        button img {
            width: 1.25rem;
            height: 1.25rem;
        }
        button img.flippedX {
            transform: rotateY(180deg);
        }
        button img.flippedY {
            transform: rotateZ(90deg);
        }
    `;

    @property({ type: String }) label = "";
    @property({ type: String }) icon = "";
    @property({ type: Boolean }) disabled = false;
    @property({ type: Boolean }) flippedX = false;
    @property({ type: Boolean }) flippedY = false;

    private handleClick(_: Event) {
        if (!this.disabled) {
            this.dispatchEvent(
                new CustomEvent("control-click", {
                    bubbles: true,
                    composed: true,
                    detail: {},
                })
            );
        }
    }

    render() {
        return html`
            <button ?disabled=${this.disabled} @click=${this.handleClick}>
                ${this.icon
                    ? html`<img
                          src=${this.icon}
                          alt="${this.label} icon"
                          class="${this.flippedX ? "flippedX" : ""} ${this
                              .flippedY
                              ? "flippedY"
                              : ""}"
                      />`
                    : ""}
                <span>${this.label}</span>
            </button>
        `;
    }
}
