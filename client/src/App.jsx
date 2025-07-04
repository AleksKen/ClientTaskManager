import Login from "./pages/Login.jsx";
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import {Fragment, useRef} from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Users from "./pages/Users.jsx";
import {Toaster} from "sonner";
import Sidebar from "./components/bars/Sidebar.jsx";
import Navbar from "./components/bars/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setOpenSidebar} from "./redux/slices/authSlice.js";
import {Transition} from "@headlessui/react";
import clsx from "clsx";
import {IoClose} from "react-icons/io5";
import TaskDetails from "./pages/TaskDetails.jsx";
import DrawingBoard from "./pages/DrawingBoard.jsx";
import Profile from "./pages/Profile.jsx";


function Layout() {
    const {userInfo} = useSelector((state) => state.auth);
    const location = useLocation()
    return userInfo ? (
        <div className='w-full h-full flex flex-col md:flex-row'>
            <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
                <Sidebar/>
            </div>
            <MobileSidebar/>
            <div className="flex-1">
                <Navbar/>
                <div className='p-4 2xl:px-10'>
                    <Outlet/>
                </div>
            </div>
        </div>
    ) : (
        <Navigate to="/login" state={{from: location}} replace/>
    );
}

const MobileSidebar = () => {
    const {isSidebarOpen} = useSelector((state) => state.auth);
    const mobileMenuRef = useRef(null);
    const dispatch = useDispatch();
    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };
    return (
        <>
            <Transition
                show={isSidebarOpen}
                as={Fragment}
                enter='transition-opacity duration-700'
                enterFrom='opacity-x-10'
                enterTo='opacity-x-100'
                leave='transition-opacity duration-700'
                leaveFrom='opacity-x-100'
                leaveTo='opacity-x-0'
            >
                {(ref) => (

                    <div
                        ref={(node) => (mobileMenuRef.current = node)}
                        className={clsx(
                            'fixed inset-0 z-50 md:hidden bg-black/40 transition-all duration-700 transform',
                            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        )}
                        onClick={() => closeSidebar()}
                    >
                        <div
                            className="bg-white w-3/4 h-full"
                            onClick={(e) => e.stopPropagation()} // чтобы клик по самому сайдбару не закрывал его
                        >
                            <div className="w-full flex px-5 mt-5 justify-end">
                                <button onClick={closeSidebar} className="flex items-end justify-end">
                                    <IoClose size={25}/>
                                </button>
                            </div>
                            <div className="-mt-10">
                                <Sidebar/>
                            </div>
                        </div>
                    </div>

                )}
            </Transition>
        </>
    );
};


function App() {
    return (
        <main className='w-full min-h-full bg-[#f3f4f6]'>
            <Routes>
                <Route element={<Layout/>}>
                    <Route index path="/" element={<Navigate to="/dashboard"/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path='/completed/:status' element={<Tasks/>}/>
                    <Route path='/in-progress/:status' element={<Tasks/>}/>
                    <Route path='/todo/:status' element={<Tasks/>}/>
                    <Route path="/team" element={<Users/>}/>
                    <Route path="/task/:id" element={<TaskDetails />} />
                    <Route path="/drawing" element={<DrawingBoard />} />
                </Route>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <Toaster richColors/>
        </main>
    );
}

export default App;