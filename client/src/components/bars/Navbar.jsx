import {useDispatch} from "react-redux";
import {setOpenSidebar} from "../../redux/slices/authSlice.js";
import {MdOutlineSearch} from "react-icons/md";
import UserAvatar from "../user/UserAvatar.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import {setSearchQuery} from "../../redux/slices/searchSlice.js";

const Navbar = () => {
    const dispatch = useDispatch();

    const handleSearchChange = (event) => {
        dispatch(setSearchQuery(event.target.value));
    };

    return <div className="flex items-center justify-between bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0">
        <div className="flex gap-4">
            <button
                onClick={() => dispatch(setOpenSidebar(true))}
                className="text-2xl text-gray-500 block md:hidden">≡</button>

            <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
                <MdOutlineSearch className="text-gray-500 text-xl"/>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
                ></input>
            </div>
        </div>

        <div className="flex gap-2 items-center">
            <NotificationPanel/>
            <UserAvatar/>
        </div>
    </div>
};

export default Navbar;