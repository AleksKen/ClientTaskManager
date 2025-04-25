import {summary} from "../assets/data.js";
import {FaNewspaper} from "react-icons/fa";
import {MdAdminPanelSettings, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp} from "react-icons/md";
import {LuClipboardPenLine} from "react-icons/lu";
import {FaArrowsToDot} from "react-icons/fa6";
import clsx from "clsx";
import Chart from "../components/Chart.jsx";
import {BGS, PRIOTITYSTYELS, TASK_TYPE} from "../utils/consts.js";
import UserInfo from "../components/user/UserInfo.jsx";
import moment from "moment";
import {getInitials} from "../utils/initials.js";
import {useGetTasksQuery, useGetUsersQuery} from "../redux/slices/apiSlice.js";
import {getChartData} from "../utils/сhartData.js";

const TaskTable = ({tasks}) => {
    const ICONS = {
        high: <MdKeyboardDoubleArrowUp/>,
        medium: <MdKeyboardArrowUp/>,
        low: <MdKeyboardArrowDown/>,
    };

    const TableHeader = () => (
        <thead className="border-b border-gray-300">
        <tr className="text-black text-left">
            <th className="py-2">Task Title</th>
            <th className="py-2">Priority</th>
            <th className="py-2">Team</th>
            <th className="py-2 hidden md:block">Created At</th>
        </tr>
        </thead>
    );

    const TableRow = ({task}) => (
        <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
            <td className='py-2'>
                <div className='flex items-center gap-2'>
                    <div
                        className={clsx("w-4 h-4 rounded-full flex-shrink-0", TASK_TYPE[task.stage])}
                    />

                    <p className='text-base text-black'>{task.title}</p>
                </div>
            </td>

            <td className='py-2'>
                <div className='flex gap-1 items-center'>
                    <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                    {ICONS[task.priority]}
                    </span>
                    <span className='capitalize'>{task.priority}</span>
                </div>
            </td>

            <td className='py-2' style={{ minWidth: "80px" }}>
                <div className="relative h-7">
                    {task.team.map((m, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm absolute",
                                BGS[index % BGS.length]
                            )}
                            style={{ left: `${index === 0 ? 0 : index * 18}px` }}
                        >
                            <UserInfo user={m}/>
                        </div>
                    ))}
                </div>
            </td>
            <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {moment(task?.createdAt).fromNow()}
        </span>
            </td>
        </tr>
    );
    return (
        <div className="w-full bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
            <table className="w-full">
                <TableHeader/>
                <tbody>
                {
                    tasks?.map((task, id) => (
                        <TableRow
                            key={id}
                            task={task}
                        />
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

const UserTable = ({users}) => {
    const TableHeader = () => (
        <thead className='border-b border-gray-300'>
        <tr className='text-black text-left'>
            <th className='py-2'>Full Name</th>
            <th className='py-2'>Status</th>
            <th className="py-2 hidden md:block">Created At</th>
        </tr>
        </thead>
    );

    const TableRow = ({user}) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
            <td className='py-2'>
                <div className='flex items-center gap-3'>
                    <div
                        className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
                        <span className='text-center'>{getInitials(user?.firstName, user?.lastName)}</span>
                    </div>

                    <div>
                        <p> {user?.firstName + " " + user?.lastName}</p>
                        <span className='text-xs text-black'>{user?.role}</span>
                    </div>
                </div>
            </td>

            <td>
                <p
                    className={clsx(
                        "w-fit px-3 py-1 rounded-full text-sm",
                        user?.isActive ? "bg-blue-200" : "bg-yellow-100"
                    )}
                >
                    {user?.isActive ? "Active" : "Disabled"}
                </p>
            </td>
            <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {moment(user?.createdAt).fromNow()}
        </span>
            </td>
        </tr>
    );

    return (
        <div className='w-full md:w-2/3 min-w-[350] bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
            <table className='w-full mb-5'>
            <TableHeader />
                <tbody>
                {users?.map((user, index) => (
                    <TableRow key={index + user?.id} user={user} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

const Dashboard = () => {
    const totals = summary.tasks

    const { data: tasks } = useGetTasksQuery();
    const { data: users } = useGetUsersQuery();

    const stats = [
        {
            _id: "1",
            label: "TOTAL TASK",
            total: tasks?.length || 0,
            icon: <FaNewspaper/>,
            bg: "bg-[#1d4ed8]",
        },
        {
            _id: "2",
            label: "COMPLETED TASK",
            total: tasks?.filter(task => task.stage === "completed").length || 0,
            icon: <MdAdminPanelSettings/>,
            bg: "bg-[#0f766e]",
        },
        {
            _id: "3",
            label: "TASK IN PROGRESS",
            total: tasks?.filter(task => task.stage === "in progress").length || 0,
            icon: <LuClipboardPenLine/>,
            bg: "bg-[#f59e0b]",
        },
        {
            _id: "4",
            label: "TODOS",
            total: tasks?.filter(task => task.stage === "todo").length || 0,
            icon: <FaArrowsToDot/>,
            bg: "bg-[#be185d]",
        },
    ]

    const latest10Tasks = tasks
        ? [...tasks]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
        : [];

    const chartData = getChartData(tasks);

    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;

    const tasksFromLastMonth = tasks?.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.getMonth() === lastMonth;
    });

    const Card = ({label, count, bg, icon}) => {
        return (
            <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
                <div className="h-full flex flex-1 flex-col justify-between">
                    <p className="text-base text-gray-600">{label}</p>
                    <span className="text-2x1 font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">{tasksFromLastMonth?.length + " last month"}</span>
                </div>

                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
                    {icon}
                </div>
            </div>
        )
    }

    return <div className="h-full py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 pb-4 gap-5">
            {
                stats.map(({icon, bg, label, total}, index) => (
                    <Card
                        key={index}
                        icon={icon}
                        bg={bg}
                        label={label}
                        count={total}
                    />
                ))
            }
        </div>

        <div className="w-full bg-white p-4 rounded shadow-sm">
            <h4 className="text-xl text-gray-600 font-semibold">Chart by priority</h4>
            <Chart chartData={chartData} />
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
            {/*/left*/}
            <TaskTable tasks={latest10Tasks}/>
            {/*/right*/}
            <UserTable users={users}/>
        </div>
    </div>;
};

export default Dashboard;