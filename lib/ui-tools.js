import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Show Table Tool
export const showTable = tool(
    async ({ query, tablePayload }) => {
        if (query === "hide") {
            return "Component hidden";
        }
        if (query === "show" && tablePayload) {
            return {
                type: "Table shown",
                columns: tablePayload.columns,
                rows: tablePayload.rows,
                options: tablePayload.options || {}
            };
        }
        return "Invalid query";
    },
    {
        name: "show_table",
        description: `
        Show or hide a table in the UI. Use 'show' to display a table with columns and rows.
        Use 'hide' to remove the table. The tablePayload must include columns and rows.
        `,
        schema: z.object({
            query: z.enum(["show", "hide"]).describe("Action to perform: 'show' or 'hide'"),
            tablePayload: z.object({
                columns: z.array(z.string()).describe("Table column headers"),
                rows: z.array(z.array(z.any())).describe("Table rows, each row is an array of cell values"),
                options: z.record(z.any()).optional().describe("Optional table display options")
            }).optional().describe("Table configuration object")
        })
    }
);

// Show Code Tool
export const showCode = tool(
    async ({ query, codePayload }) => {
        if (query === "hide") {
            return "Component hidden";
        }
        if (query === "show" && codePayload) {
            return {
                type: "Code shown",
                language: codePayload.language,
                code: codePayload.code,
                options: codePayload.options || {}
            };
        }
        return "Invalid query";
    },
    {
        name: "show_code",
        description: `
        Show or hide a code block in the UI. Use 'show' to display code with language.
        Use 'hide' to remove the code block.
        `,
        schema: z.object({
            query: z.enum(["show", "hide"]).describe("Action to perform: 'show' or 'hide'"),
            codePayload: z.object({
                language: z.string().describe("Programming language of the code"),
                code: z.string().describe("Code content"),
                options: z.record(z.any()).optional().describe("Optional code display options")
            }).optional().describe("Code configuration object")
        })
    }
);

// Show Video Tool
export const showVideo = tool(
    async ({ query, videoPayload }) => {
        if (query === "hide") {
            return "Component hidden";
        }
        if (query === "show" && videoPayload) {
            return {
                type: "Video shown",
                url: videoPayload.url,
                options: videoPayload.options || {}
            };
        }
        return "Invalid query";
    },
    {
        name: "show_video",
        description: `
        Show or hide a video in the UI. Use 'show' to display a video with a URL.
        Use 'hide' to remove the video.
        `,
        schema: z.object({
            query: z.enum(["show", "hide"]).describe("Action to perform: 'show' or 'hide'"),
            videoPayload: z.object({
                url: z.string().url().describe("URL of the video"),
                options: z.record(z.any()).optional().describe("Optional video display options")
            }).optional().describe("Video configuration object")
        })
    }
);

// Show Image Tool
export const showImage = tool(
    async ({ query, imagePayload }) => {
        if (query === "hide") {
            return "Component hidden";
        }
        if (query === "show" && imagePayload) {
            return {
                type: "Image shown",
                url: imagePayload.url,
                alt: imagePayload.alt || "",
                options: imagePayload.options || {}
            };
        }
        return "Invalid query";
    },
    {
        name: "show_image",
        description: `
        Show or hide an image in the UI. Use 'show' to display an image with a URL.
        Use 'hide' to remove the image.
        `,
        schema: z.object({
            query: z.enum(["show", "hide"]).describe("Action to perform: 'show' or 'hide'"),
            imagePayload: z.object({
                url: z.string().url().describe("URL of the image"),
                alt: z.string().optional().describe("Alternative text for the image"),
                options: z.record(z.any()).optional().describe("Optional image display options")
            }).optional().describe("Image configuration object")
        })
    }
);

// Show Many Items Tool
export const showItems = tool(
    async ({ query, itemsPayload }) => {
        if (query === "hide") {
            return "Component hidden";
        }
        if (query === "show" && itemsPayload) {
            return {
                type: "Items shown",
                items: itemsPayload.items,
                options: itemsPayload.options || {}
            };
        }
        return "Invalid query";
    },
    {
        name: "show_items",
        description: `
        Show or hide a list of items in the UI. Use 'show' to display multiple items (images, videos, text, etc.).
        Use 'hide' to remove the items.
        `,
        schema: z.object({
            query: z.enum(["show", "hide"]).describe("Action to perform: 'show' or 'hide'"),
            itemsPayload: z.object({
                items: z.array(z.any()).describe("Array of items to display"),
                options: z.record(z.any()).optional().describe("Optional display options for items")
            }).optional().describe("Items configuration object")
        })
    }
);

export const uiTools = [
    showTable, showImage, showVideo, showCode, showTable
]