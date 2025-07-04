import {MdDashboard, MdOutlinePendingActions, MdTaskAlt} from "react-icons/md";
import {FaTasks, FaUsers} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation} from "react-router-dom";
import {setOpenSidebar} from "../../redux/slices/authSlice.js";
import clsx from "clsx";
import {CgPen} from "react-icons/cg";
import {HiOutlineRocketLaunch} from "react-icons/hi2";
import {GiProgression} from "react-icons/gi";

const Sidebar = () => {
    const {userInfo} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const path = location.pathname.split("/")[1];

    const sidebarLinks = userInfo.isAdmin ? linkData : linkData.slice(0, 6);

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };

    const NavLink = ({el}) => {
        return (
            <Link to={el.link} onClick={closeSidebar}
                  className={clsx("w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 " +
                      "text-base hover:bg-[#2564ed2d]",
                      path === el.link.split("/")[0] ? "bg-blue-700 text-white" : ""
                  )}>
                {el.icon}
                <span className="hover:text-[#2564ed]">{el.label}</span>
            </Link>
        )
    };

    return <div className="w-full h-full flex flex-col gap-6 p-5">
        <h1 className="flex gap-1 items-center">
            <p className="bg-blue-600 p-2 rounded-full">
                <HiOutlineRocketLaunch className="text-white text-2xl font-black"/>
            </p>
            <span className="text-black text-2xl font-black">MariaTask</span>
        </h1>

        <div className="flex-1 flex flex-col gap-y-5 py-8">
            {
                sidebarLinks.map((link) => (
                    <NavLink el={link} key={link.label}/>
                ))
            }
        </div>
    </div>
};

const linkData = [
    {
        label: "Dashboard",
        link: "dashboard",
        icon: <MdDashboard/>,
    },
    {
        label: "Tasks",
        link: "tasks",
        icon: <FaTasks/>,
    },
    {
        label: "Completed",
        link: "completed/completed",
        icon: <MdTaskAlt/>,
    },
    {
        label: "In Progress",
        link: "in-progress/in progress",
        icon: <GiProgression/>,
    },
    {
        label: "To Do",
        link: "todo/todo",
        icon: <MdOutlinePendingActions/>,
    },
    {
        label: "Drawing Board",
        link: "drawing",
        icon: <CgPen/>,
    },
    {
        label: "Team",
        link: "team",
        icon: <FaUsers/>,
    }
];

export default Sidebar;