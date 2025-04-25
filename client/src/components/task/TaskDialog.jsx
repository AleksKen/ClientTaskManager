import {useState, Fragment} from "react";
import {useNavigate} from "react-router-dom";
import {AiTwotoneFolderOpen} from "react-icons/ai";
import {MdOutlineEdit} from "react-icons/md";
import {Menu, Transition} from "@headlessui/react";
import {BsThreeDots} from "react-icons/bs";
import {RiDeleteBin6Line} from "react-icons/ri";
import AddTask from "./AddTask.jsx";
import {ConfirmationDialog} from "../Dialogs.jsx";
import {useDeleteTaskMutation} from "../../redux/slices/apiSlice.js";
import {useSelector} from "react-redux";


const TaskDialog = ({task}) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteTask] = useDeleteTaskMutation();
    const {userInfo} = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const deleteClicks = () => {
        setOpenDialog(true);
    };

    const deleteHandler = async () => {
        try {
            await deleteTask(task.id).unwrap();
        } catch (err) {
            console.error('Ошибка при удалении задачи:', err);
        } finally {
            setOpenDialog(false);
        }
    };

    const items = [
        {
            label: "Open Task",
            icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true"/>,
            onClick: () => navigate(`/task/${task.id}`),
        },
        {
            label: "Edit",
            icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true"/>,
            onClick: () => setOpenEdit(true),
        }
    ].filter(item => {
        if (item.label !== "Open Task") {
            return userInfo?.isAdmin;
        }
        return true;
    });

    return (
        <>
            <div>
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button
                        className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600">
                        <BsThreeDots/>
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            className="absolute z-50 p-1 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="px-1 py-1 space-y-2">
                                {items.map((el) => (
                                    <Menu.Item key={el.label}>
                                        {({active}) => (
                                            <button
                                                onClick={el?.onClick}
                                                className={`${
                                                    active ? "bg-blue-500 text-white" : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {el.icon}
                                                <span className="pl-2">{el.label}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                            {userInfo?.isAdmin && (
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({active}) => (
                                            <button
                                                onClick={() => deleteClicks()}
                                                className={`${
                                                    active ? "bg-blue-500 text-white" : "text-red-900"
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                <RiDeleteBin6Line
                                                    className="mr-2 h-5 w-5 text-red-400"
                                                    aria-hidden="true"
                                                />
                                                <span className="pl-2">Delete</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            )}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            <AddTask
                open={openEdit}
                setOpen={setOpenEdit}
                task={task}
                key={new Date().getTime()}
            />

            <ConfirmationDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onClick={deleteHandler}
            />
        </>
    );
};

export default TaskDialog;