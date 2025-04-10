import {useEffect, useRef, useState} from "react";
import {FaEraser} from "react-icons/fa";


const DrawingBoard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [context, setContext] = useState(null);
    const [strokeColor, setStrokeColor] = useState('#757575');


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
        ctx.strokeStyle = strokeColor;

    }, [lineWidth, strokeColor]);

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

    const handleColorChange = (e) => {
        setStrokeColor(e.target.value);
    };

    return (
        <div className="w-full md:px-4 px-0 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Drawing Board</h1>

                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="line-width" className="text-gray-600 text-sm md:text-base">Line Width:</label>
                        <input
                            type="range"
                            id="line-width"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={changeLineWidth}
                            className="w-24 md:w-32"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="stroke-color" className="text-gray-600 text-sm md:text-base">Color:</label>
                        <input
                            type="color"
                            id="stroke-color"
                            value={strokeColor}
                            onChange={handleColorChange}
                            className="w-6 h-6 md:w-8 md:h-8 p-0"
                        />
                    </div>

                    <button
                        onClick={toggleErase}
                        className={`flex items-center gap-1 rounded-md py-1 px-2 md:py-2 md:px-4 text-sm md:text-base ${
                            isErasing
                                ? "bg-blue-100 text-blue-600 border border-blue-300"
                                : "bg-gray-100 text-gray-600 border border-gray-300"
                        }`}
                    >
                        <FaEraser className="text-base"/>
                    </button>
                </div>
            </div>

            <div className="py-4">
                <div className="bg-white px-4 py-6 shadow-md rounded-md">
                    <div className="flex justify-center">
                        <canvas
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            style={{border: "1px solid #ddd"}}
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseMove={draw}
                            onTouchStart={startDrawingTouch}
                            onTouchEnd={stopDrawingTouch}
                            onTouchMove={drawTouch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawingBoard;
