import {MdGridView} from "react-icons/md";
import {FaList} from "react-icons/fa";
import {useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "../components/design/Loader.jsx";
import Title from "../components/design/Title.jsx";

import {IoMdAdd} from "react-icons/io";
import Tabs from "../components/Tabs.jsx";
import TaskTitle from "../components/task/TaskTitle.jsx";
import BoardView from "../components/BoardView.jsx";
import Table from "../components/task/Table.jsx";
import AddTask from "../components/task/AddTask.jsx";
import Button from "../components/design/Button.jsx";
import {useGetTasksQuery} from "../redux/slices/apiSlice.js";
import {useSelector} from "react-redux";
import ChatWidget from "../components/ChatWidget.jsx";

const TABS = [
    {title: "Board View", icon: <MdGridView/>},
    {title: "List View", icon: <FaList/>},
];

const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
};

const Tasks = () => {
    const params = useParams();
    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState(false);
    const status = params?.status || "";
    const searchQuery = useSelector((state) => state.search.searchQuery);
    const { data: tasks, isLoading, error } = useGetTasksQuery();

    const filteredTasks = tasks?.filter((task) => {
        const matchesStatus = status ? task.stage?.toLowerCase() === status.toLowerCase() : true;

        const matchesQuery = task.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesQuery;
    });


    return isLoading ? (
        <div className="py-10">
            <Loader/>
        </div>
    ) : (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <Title title={status ? `${status} Tasks` : "Tasks"}/>
                {
                    !status && (<Button
                            onClick={() => setOpen(true)}
                            label="Create Task"
                            icon={<IoMdAdd className="text-lg"/>}
                            className="flex items-center gap-2 bg-blue-600 text-white rounded-md py-2 2xl:py-2.5 px-4"
                        >
                            <IoMdAdd className="text-lg"/>
                            <span>Create Task</span>
                        </Button>
                    )}
            </div>


            <Tabs tabs={TABS} setSelected={setSelected}>
                {!status && (
                    <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
                        <TaskTitle
                            label="To Do"
                            className={TASK_TYPE.todo}
                        />
                        <TaskTitle
                            label="In Progress"
                            className={TASK_TYPE["in progress"]}
                        />
                        <TaskTitle
                            label="Completed"
                            className={TASK_TYPE.completed}
                        />
                    </div>
                )}

                {
                    selected === 0
                        ? <BoardView tasks={filteredTasks}/>
                        : <div className="py-4">
                        <Table
                        tasks={filteredTasks}
                        />
                        </div>
                }
            </Tabs>

            <AddTask open={open} setOpen={setOpen}/>

            <ChatWidget />
        </div>
    );
};

export default Tasks;