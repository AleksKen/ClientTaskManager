import {useEffect, useRef, useState} from "react";
import {IoMdAdd} from "react-icons/io";


const DrawingBoard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [context, setContext] = useState(null);

    const [canvasWidth, setCanvasWidth] = useState(200);
    const [canvasHeight, setCanvasHeight] = useState(200);

    useEffect(() => {
        const updateCanvasSize = () => {
            const width = window.innerWidth * 0.7;
            const height = window.innerHeight * 0.7;
            setCanvasWidth(width);
            setCanvasHeight(height);
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        setContext(ctx);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#000000';
    }, [lineWidth]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        context.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = context;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (isErasing) {
            ctx.clearRect(x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const startDrawingTouch = (e) => {
        setIsDrawing(true);
        drawTouch(e);
    };

    const stopDrawingTouch = () => {
        setIsDrawing(false);
        context.beginPath();
    };

    const drawTouch = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = context;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width); // Масштабирование координат
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height); // Масштабирование координат

        if (isErasing) {
            ctx.clearRect(x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const toggleErase = () => {
        setIsErasing(!isErasing);
    };

    const changeLineWidth = (e) => {
        setLineWidth(e.target.value);
    };

    return (
        <div className="w-full md:px-4 px-0 mb-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">Drawing Board</h1>
                <button
                    onClick={toggleErase}
                    className="flex items-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4"
                >
                    <IoMdAdd className="text-lg"/>
                    <span>{isErasing ? "Switch to Draw" : "Switch to Erase"}</span>
                </button>
            </div>

            <div className="py-4">
                <div className="bg-white px-4 py-6 shadow-md rounded-md">
                    <div className="flex justify-center">
                        <canvas
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            style={{ border: "1px solid #ddd" }}
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseMove={draw}
                            onTouchStart={startDrawingTouch}
                            onTouchEnd={stopDrawingTouch}
                            onTouchMove={drawTouch}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center mt-6">
                    <div className="flex gap-4">
                        <label htmlFor="line-width" className="text-gray-600">Line Width:</label>
                        <input
                            type="range"
                            id="line-width"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={changeLineWidth}
                            className="w-32"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawingBoard;
