import React, { useEffect, useRef, useState } from "react";
import { TupiImageEditor as CoreEditor } from "@tupi/image-editor";
import { EditorControls } from "./EditorControls";
import "@tupi/design-system";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "top-controls": {
                width?: number;
                height?: number;
            };
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
    width,
    height,
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
            {/* {editor && <EditorControls editor={editor} />} */}
            <top-controls width={width} height={height}></top-controls>
            {/* <canvas ref={canvasRef} width={width} height={height}></canvas> */}
        </>
    );
};
