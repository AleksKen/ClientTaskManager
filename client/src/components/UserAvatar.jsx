import {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Menu} from "@headlessui/react";
import {getInitials} from "../utils/initials.js";
import {FaUser, FaUserLock} from "react-icons/fa";
import {IoLogOutOutline} from "react-icons/io5";
import {logout} from "../redux/slices/authSlice.js";

const UserAvatar = () => {
    const [open, setOpen] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const {userInfo} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = () => {
        dispatch(logout());
        console.log("logout");
    };
    return <div>
        <Menu as='div' className='relative inline-block text-left'>
            <div>
                <Menu.Button className='flex w-12 h-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600'>
                    <span className='text-white font-semibold'>
                        {getInitials(userInfo?.firstName, userInfo?.lastName)}
                    </span>
                </Menu.Button>
            </div>
            <Menu.Items
                transition
                className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100
                rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
                <div className='p-4'>
                    <Menu.Item>
                        <button
                            onClick={() => setOpen(true)}
                            className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                        >
                            <FaUser className='mr-2' aria-hidden='true'/>
                            <span className='p-2'>Profile</span>
                        </button>
                    </Menu.Item>
                    <Menu.Item>
                        <button
                            onClick={() => setOpenPassword(true)}
                            className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                        >
                            <FaUserLock className='mr-2' aria-hidden='true'/>
                            <span className='p-2'>Change Password</span>
                        </button>
                    </Menu.Item>
                    <Menu.Item>
                        <button
                            onClick={logoutHandler}
                            className='text-red-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                        >
                            <IoLogOutOutline className='mr-2' aria-hidden='true'/>
                            <span className='p-2'>Logout</span>
                        </button>
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Menu>
    </div>
};

export default UserAvatar;