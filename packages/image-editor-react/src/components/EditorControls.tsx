import { TupiImageEditor } from "@tupi/image-editor";
import React from "react";
import { useState } from "react";

interface EditorControlsProps {
    editor: TupiImageEditor | null;
}

export const EditorControls: React.FC<EditorControlsProps> = ({ editor }) => {
    const [rotation, setRotation] = useState(0);

    const handleFlipHorizontal = () => {
        editor?.flip(true, false);
    };

    const handleRotate = (degrees: number) => {
        setRotation(degrees);
        editor?.rotate(degrees);
    };

    const handleCrop = (
        x: number,
        y: number,
        width: number,
        height: number
    ) => {
        editor?.crop(x, y, width, height);
    };

    const handleUndo = () => {
        editor?.undo();
    };

    return (
        <div className="editor-controls">
            <button onClick={handleFlipHorizontal}>Flip Horizontal</button>
            <button onClick={() => handleRotate(rotation + 90)}>
                Rotate 90°
            </button>
            <button onClick={handleUndo}>Undo</button>
        </div>
    );
};
