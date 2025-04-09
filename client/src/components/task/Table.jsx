import {MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp} from "react-icons/md";
import {useState} from "react";
import {BGS, PRIOTITYSTYELS, TASK_TYPE} from "../../utils/consts.js";
import clsx from "clsx";
import {formatDate} from "../../utils/dates.js";
import {BiMessageAltDetail} from "react-icons/bi";
import UserInfo from "../UserInfo.jsx";
import {Button} from "@headlessui/react";
import ConfirmationDialog from "../Dialogs.jsx";
import {useNavigate} from "react-router-dom";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp/>, medium: <MdKeyboardArrowUp/>, low: <MdKeyboardArrowDown/>,
};

const Table = ({tasks}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selected, setSelected] = useState(null);

    const navigate = useNavigate();

    const deleteClicks = (id) => {
        setSelected(id);
        setOpenDialog(true);
    };

    const deleteHandler = () => {
    };

    const TableHeader = () => (
        <thead className="w-full border-b border-gray-300">
        <tr className="w-full text-black  text-left">
            <th className="py-2">Task Title</th>
            <th className="py-2">Priority</th>
            <th className="py-2 line-clamp-1">Created At</th>
            <th className="py-2">Assets</th>
            <th className="py-2">Team</th>
        </tr>
        </thead>
    );

    const TableRow = ({task}) => (
        <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <div
                        className={clsx("w-4 h-4 rounded-full flex-shrink-0", TASK_TYPE[task?.stage])}
                    />
                    <p className="w-full line-clamp-2 text-base text-black">
                        {task?.title}
                    </p>
                </div>
            </td>

            <td className="py-2">
                <div className={"flex gap-1 items-center"}>
                    <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
                        {ICONS[task?.priority]}
                    </span>
                    <span className="capitalize line-clamp-1">
                        {task?.priority} Priority
                    </span>
                </div>
            </td>

            <td className="py-2">
                <span className="text-sm text-gray-600">
                    {formatDate(new Date(task?.date))}
                </span>
            </td>

            <td className="py-2">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 items-center text-sm text-gray-600">
                        <BiMessageAltDetail/>
                        <span>{task?.activities?.length}</span>
                    </div>
                    <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
                        <MdAttachFile/>
                        <span>{task?.assets?.length}</span>
                    </div>
                </div>
            </td>

            <td className="py-2" style={{minWidth: "80px"}}>
                <div className="relative h-7">
                    {task.team.map((m, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm absolute",
                                BGS[index % BGS.length]
                            )}
                            style={{left: `${index === 0 ? 0 : index * 18}px`}}
                        >
                            <UserInfo user={m}/>
                        </div>
                    ))}
                </div>
            </td>

            <td className="py-2 flex gap-2 md:gap-4 justify-end">
                <Button
                    onClick={() => {navigate(`/task/${task._id}`)}}
                    className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
                    label="Open"
                    type="button"
                >Open</Button>

                <Button
                    onClick={() => deleteClicks()}
                    className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
                    label="Delete"
                    type="button"
                >Delete</Button>
            </td>
        </tr>
    )

    return (
        <>
            <div className="bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <TableHeader/>
                        <tbody>
                        {tasks.map((task, index) => (
                            <TableRow key={index} task={task}/>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onClick={deleteHandler}
            />
        </>
    );
};

export default Table;