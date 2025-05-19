import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("control-button")
export class ControlButton extends LitElement {
    @property({ type: String }) label = "";
    @property({ type: String }) icon = "";
    @property({ type: String }) variant: "primary" | "secondary" = "secondary";
    @property({ type: Boolean }) disabled = false;

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
            <button
                ?disabled=${this.disabled}
                @click=${this.handleClick}
                class=${this.variant}
            >
                ${this.icon
                    ? html`<img src=${this.icon} alt="${this.label} icon" />`
                    : nothing}
                ${this.label ? html`<span>${this.label}</span>` : nothing}
            </button>
        `;
    }

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
}
