import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
    MdOutlineDoneAll,
    MdOutlineMessage
} from "react-icons/md";
import {FaBug, FaTasks, FaThumbsUp, FaUser} from "react-icons/fa";
import {RxActivityLog} from "react-icons/rx";
import {GrInProgress} from "react-icons/gr";
import {useParams} from "react-router-dom";
import {useState} from "react";
import Tabs from "../components/Tabs.jsx";
import {PRIOTITYSTYELS, TASK_TYPE} from "../utils/consts.js";
import clsx from "clsx";
import {getInitials} from "../utils/initials.js";
import moment from "moment";
import Loader from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import {useGetTasksQuery} from "../redux/slices/apiSlice.js";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp/>,
    medium: <MdKeyboardArrowUp/>,
    low: <MdKeyboardArrowDown/>,
};

const bgColor = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-blue-200",
};

const TABS = [
    {title: "Task Detail", icon: <FaTasks/>},
    {title: "Activities/Timeline", icon: <RxActivityLog/>},
];

const TASKTYPEICON = {
    commented: (
        <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
            <MdOutlineMessage/>
        </div>
    ),
    started: (
        <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
            <FaThumbsUp size={20}/>
        </div>
    ),
    assigned: (
        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-white'>
            <FaUser size={14}/>
        </div>
    ),
    bug: (
        <div className='text-red-600'>
            <FaBug size={24}/>
        </div>
    ),
    completed: (
        <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
            <MdOutlineDoneAll size={24}/>
        </div>
    ),
    "in progress": (
        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-600 text-white'>
            <GrInProgress size={16}/>
        </div>
    ),
};

const act_types = [
    "Started",
    "Completed",
    "In Progress",
    "Commented",
    "Bug",
    "Assigned",
];

const TaskDetails = () => {
    const {id} = useParams();
    const [selected, setSelected] = useState(0);
    const { data: tasks, isLoading, error } = useGetTasksQuery();
    const task = tasks.find((task) => task.id === id);
    return (
        <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
            <h1 className="text-2xl text-gray-600 font-bold">
                {task?.title}
            </h1>
            <Tabs tabs={TABS} setSelected={setSelected}>
                <div className="py-4">
                    {
                        selected === 0
                            ?
                            <div
                                className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-4 overflow-y-auto">
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div className="flex items-center gap-5 pb-4">
                                        <div
                                            className={clsx(
                                                "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                                                PRIOTITYSTYELS[task?.priority],
                                                bgColor[task?.priority]
                                            )}
                                        >
                                            <span className='text-lg'>{ICONS[task?.priority]}</span>
                                            <span className='uppercase'>{task?.priority} Priority</span>
                                        </div>
                                        <div className={clsx("flex items-center gap-2")}>
                                            <div
                                                className={clsx(
                                                    "w-4 h-4 rounded-full",
                                                    TASK_TYPE[task.stage]
                                                )}
                                            />
                                            <span className='text-black uppercase'>{task?.stage}</span>
                                        </div>
                                    </div>

                                    <p className='text-gray-500'>
                                        Created At: {new Date(task?.date).toDateString()}
                                    </p>
                                    <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                                        <div className='space-x-2'>
                                            <span className='font-semibold'>Assets: </span>
                                            <span>{task?.assets?.length}</span>
                                        </div>

                                        <span className='text-gray-400'>|</span>

                                        <div className='space-x-2'>
                                            <span className='font-semibold'>Activities: </span>
                                            <span>{task?.activities?.length}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 py-6">
                                        <p className="text-gray-600 font-semibold text-sm">
                                            TASK TEAM
                                        </p>
                                        <div className="space-y-3">
                                            {
                                                task?.team?.map((m, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-4 py-2 items-center border-t border-gray-200"
                                                    >
                                                        <div
                                                            className={
                                                                "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                                                            }
                                                        >
                                                        <span className='text-center'>
                                                            {getInitials(m?.name)}
                                                        </span>
                                                        </div>

                                                        <div>
                                                            <p className="text-lg font-semibold">{m?.name}</p>
                                                            <span className="text-gray-500">{m?.title}</span>
                                                        </div>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 space-y-8">
                                    <p className="text-lg font-semibold">ASSETS</p>
                                    <div className="w-full grid grid-cols-2 gap-4">
                                        {task?.assets?.map((el, index) => (
                                            <img
                                                key={index}
                                                src={el}
                                                alt={task?.title}
                                                className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            :
                            <Activities activity={task?.activities} id={id}/>
                    }
                </div>
            </Tabs>
        </div>
    );
};

const Activities = ({activity, id}) => {
    const [selected, setSelected] = useState(act_types[0]);
    const [text, setText] = useState("");
    const isLoading = false;

    const handleSubmit = async () => {
    };


    const Card = ({item}) => {
        return (
            <div className="flex items-start space-x-4 relative pl-6">
                <div className=" left-5 top-0 flex flex-col items-center">
                    <div className="w-1 h-10 bg-gray-300"/>
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full z-10">
                        {TASKTYPEICON[item?.type]}
                    </div>

                    <div className="w-1 flex-1 bg-gray-300"/>

                </div>

                <div className="ml-2">
                    <div className="text-gray-500 text-sm">
                        <span className="capitalize">{item?.type}</span>
                        {" • "}
                        <span>{moment(item?.date).fromNow()}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{item?.activity}</p>
                </div>
            </div>
        );
    };


    return (
        <div className="w-full flex flex-col md:flex-row gap-10 px-10 py-8 bg-white shadow rounded-md overflow-y-auto">
            <div className="w-full md:w-2/3">
                <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>
                <div className="relative">
                    {activity?.map((el, index) => (
                        <Card
                            key={index}
                            item={el}
                            isConnected={index !== activity.length - 1}
                        />
                    ))}
                </div>
            </div>


            <div className="w-full md:w-1/3">
                <h4 className="text-gray-600 font-semibold text-lg mb-5">Add Activity</h4>
                <div className="w-full flex flex-wrap gap-5">
                    {act_types.map((item) => (
                        <div key={item} className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selected === item}
                                onChange={() => setSelected(item)}
                            />
                            <p>{item}</p>
                        </div>
                    ))}
                    <textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type ......"
                        className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
                    ></textarea>
                    {isLoading ? (
                        <Loader active={isLoading}/>
                    ) : (
                        <Button
                            type="button"
                            label="Submit"
                            onClick={handleSubmit}
                            className="w-full h-10 bg-blue-700 text-white rounded-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};


export default TaskDetails;