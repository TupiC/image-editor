import type { StorybookConfig } from "@storybook/web-components-vite";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        {
            name: getAbsolutePath("@storybook/addon-essentials"),
            options: {
                docs: false,
            },
        },
    ],
    framework: {
        name: getAbsolutePath("@storybook/web-components-vite"),
        options: {},
    },
    core: {
        builder: "@storybook/builder-vite",
    },
};
export default config;
