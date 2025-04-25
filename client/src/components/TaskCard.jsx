import {MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp} from "react-icons/md";
import {useState} from "react";
import clsx from "clsx";
import {BGS, PRIOTITYSTYELS, TASK_TYPE} from "../utils/consts.js";
import TaskDialog from "./task/TaskDialog.jsx";
import {formatDate} from "../utils/dates.js";
import {BiMessageAltDetail} from "react-icons/bi";
import UserInfo from "./UserInfo.jsx";
import {useSelector} from "react-redux";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp/>, medium: <MdKeyboardArrowUp/>, low: <MdKeyboardArrowDown/>,
};

const TaskCard = ({task}) => {
    const {userInfo} = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);

    return (

        <div className="w-full h-fit bg-white shadow-md p-4 rounded">
            <div className="w-full flex justify-between">
                <div
                    className={clsx("flex flex-1 gap-1 items-center text-sm font-medium", PRIOTITYSTYELS[task?.priority])}>
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span>{task?.priority} Priority</span>
                </div>
                {userInfo?.isAdmin && <TaskDialog task={task}/>}
            </div>


            <div className="flex items-center gap-2">
                <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}></div>
                <h4 className="text-line-clamp-1">{task?.title}</h4>
            </div>

            <span className='text-sm text-red-400'>
                {"Deadline: " + formatDate(new Date(task?.deadline))}
            </span>

            <div className="w-full border-t border-gray-200 my-2"/>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 items-center text-sm text-gray-600">
                        <BiMessageAltDetail/>
                        <span>{task?.activities?.length || 0}</span>
                    </div>
                    <div className="flex gap-1 items-center text-sm text-gray-600">
                        <MdAttachFile/>
                        <span>{task?.assets?.length || 0}</span>
                    </div>
                </div>

                <div className="py-2" style={{minWidth: "80px"}}>
                    <div className="relative h-7">
                        {task?.team?.map((m, index) => (<div
                            key={index}
                            className={clsx("w-7 h-7 rounded-full text-white flex " +
                                "items-center justify-center text-sm absolute", BGS[index % BGS?.length])}
                            style={{right: `${index === 0 ? 0 : index * 18}px`}}
                        >
                            <UserInfo user={m}/>
                        </div>))}
                    </div>
                </div>
            </div>

            {/*description*/}
            <div className="py-4 border-t border-gray-200">
                {task?.description ? (
                    <h5 className="text-base text-black">
                        {task.description}
                    </h5>
                ) : (
                    <span className="text-gray-500">No Description</span>
                )}

                <div className="p-2 flex gap-2 items-center mt-2">
                    <span className="text-sm text-gray-600">
                        {"Created At: " + formatDate(new Date(task?.createdAt))}
                    </span>
                    {task?.labels && task.labels.map((label) => (
                        <span
                            key={label.id}
                            className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium mr-2"
                        >
                        {label.name}
                    </span>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TaskCard;