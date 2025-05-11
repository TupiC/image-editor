import React, { useEffect, useRef } from "react";
import { TupiImageEditor as CoreEditor } from "@tupi/image-editor";

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
    const editorRef = useRef<CoreEditor | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        editorRef.current = new CoreEditor(canvasRef.current);

        const loadImage = async () => {
            try {
                await editorRef.current?.loadImage(src);
                if (editorRef.current) {
                    onReady?.(editorRef.current);
                }
            } catch (error) {
                console.error("Failed to load image:", error);
            }
        };

        loadImage();

        return () => {
            editorRef.current = null;
        };
    }, [src]);

    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};
