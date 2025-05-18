import React, { useEffect, useRef, useState } from "react";
import { TupiImageEditor as CoreEditor } from "@tupi/image-editor";
import { EditorControls } from "./EditorControls";
import "@tupi/design-system";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "top-controls": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

export interface TupiImageEditorProps {
    src: string;
    width?: number;
    height?: number;
    onReady?: (editor: CoreEditor) => void;
}

export const TupiImageEditor: React.FC<TupiImageEditorProps> = ({
    src,
    width = 800,
    height = 600,
    onReady,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [editor, setEditor] = useState<CoreEditor | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const editorInstance = new CoreEditor(canvasRef.current);
        setEditor(editorInstance);

        const loadImage = async () => {
            try {
                await editorInstance.loadImage(src);
                onReady?.(editorInstance);
            } catch (error) {
                console.error("Failed to load image:", error);
            }
        };

        loadImage();

        return () => {
            setEditor(null);
        };
    }, [src, onReady]);

    return (
        <>
            {editor && <EditorControls editor={editor} />}
            <top-controls></top-controls>
            <canvas ref={canvasRef} width={width} height={height}></canvas>
        </>
    );
};
