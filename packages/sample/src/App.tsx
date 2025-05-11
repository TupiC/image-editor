import "./App.css";
import { TupiImageEditor } from "@tupi/image-editor";

function App() {
    const handleClick = () => {
        const l = new TupiImageEditor(
            document.getElementById("canvas") as HTMLCanvasElement
        );
        l.loadImage(
            "https://images.pexels.com/photos/12620919/pexels-photo-12620919.jpeg"
        );
        console.log("Button clicked");
    };

    return (
        <>
            <canvas id="canvas" width="500" height="500"></canvas>
            <button onClick={handleClick}>Load image</button>
        </>
    );
}

export default App;
