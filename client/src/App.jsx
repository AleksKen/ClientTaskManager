import Login from "./pages/Login.jsx";
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import React from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Users from "./pages/Users.jsx";
import {Toaster} from "sonner";
import Sidebar from "./components/Sidebar.jsx";
import Trash from "./pages/Trash.jsx";
import Navbar from "./components/Navbar.jsx";

function Layout() {
    // const {user} = useSelector((state) => state.auth);
    const user = JSON.parse('{ "name": "Maria Konyashova" }');
    const location = useLocation()
    return user ? (
        <div className='w-full h-screen flex flex-col md:flex-row'>
            <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
                <Sidebar/>
            </div>
            {/*{MobileSidebar}*/}
            <div className="flex-1 overflow-y-auto">
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

function App() {
    return (
        <main className='w-full min-h-screen bg-[#f3f4f6]'>
            <Routes>
                <Route element={<Layout/>}>
                    <Route index path="/" element={<Navigate to="/dashboard"/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/team" element={<Users/>}/>
                    <Route path="/trash" element={<Trash/>}/>
                    <Route path="/tasks/:taskId" element={<Tasks/>}/>
                </Route>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <Toaster richColors/>
        </main>
    );
}

export default App;