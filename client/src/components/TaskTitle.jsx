import clsx from "clsx";
import {IoMdAdd} from "react-icons/io";
import AddTask from "./task/AddTask.jsx";
import {useState} from "react";

const TaskTitle = ({label, className}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <div className={clsx("w-4 h-4 rounded-full", className)}/>
                <p className="text-sm md:text-base text-gray-600">{label}</p>
            </div>

            <button
                onClick={() => setOpen(true)}
                className="hidden md:block">
                <IoMdAdd className="text-lg text-black"/>
            </button>

            <AddTask open={open} setOpen={setOpen} label={label}/>
        </div>
    );
};

export default TaskTitle;