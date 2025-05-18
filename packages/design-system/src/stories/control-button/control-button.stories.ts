import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";
import "./control-button";

const meta: Meta = {
    title: "ControlButton",
    component: "control-button",
    argTypes: {
        label: { control: "text" },
        icon: { control: "text" },
        disabled: { control: "boolean" },
    },
    parameters: {
        controls: { expanded: true },
    },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
    args: {
        label: "Click Me",
        icon: "",
        disabled: false,
    },
    render: ({ label, icon, disabled }) => html`
        <control-button
            .label=${label}
            .icon=${icon}
            .disabled=${disabled}
            @control-click=${() => alert("Button clicked!")}
        ></control-button>
    `,
};

export const WithIcon: Story = {
    args: {
        label: "With Icon",
        icon: "⭐",
        disabled: false,
    },
    render: Default.render,
};

export const Disabled: Story = {
    args: {
        label: "Disabled",
        icon: "",
        disabled: true,
    },
    render: Default.render,
};
