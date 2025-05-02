import {useDispatch, useSelector} from "react-redux";
import {FaUserCircle, FaEnvelope, FaCalendarAlt, FaPlus} from "react-icons/fa";
import clsx from "clsx";
import moment from "moment";
import "leaflet/dist/leaflet.css";
import "react-calendar/dist/Calendar.css";
import {AiFillApi} from "react-icons/ai";
import {getChartData} from "../utils/сhartData.js";
import {useGetTasksQuery, useUpdateUserMutation} from "../redux/slices/apiSlice.js";
import PieChart from "../components/PieChart.jsx";
import {useState} from "react";
import {uploadImage} from "../redux/actions/UploadImage.js";
import {setUserInfo} from "../redux/slices/authSlice.js";
import {getInitials} from "../utils/initials.js";

const Profile = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: tasks } = useGetTasksQuery();


    const userTasks = tasks?.filter(task =>
        task.team?.some(member => member.id === userInfo.id)
    );

    const chartData = getChartData(userTasks);
    const dispatch = useDispatch();

    const [isHovering, setIsHovering] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [updateUser] = useUpdateUserMutation();

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            await submitHandler(file);
        }
    };


    const submitHandler = async (file) => {
        try {
            setUploading(true);
            const imageUrl = await uploadImage(file);
            const updatedUser = {
                avatarProfile: imageUrl,
            };
            const updatedData = await updateUser({
                id: userInfo.id,
                ...updatedUser,
            }).unwrap();
            dispatch(setUserInfo(updatedData));
            setUploading(false);
        } catch (err) {
            console.error('Failed to update user avatar:', err);
            setUploading(false);
        }
    };

    return (
        <div className="w-full bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl  bg-white shadow-md rounded-md p-6 md:p-10">
                {/* Приветствие */}
                <h1
                    className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-10"
                >
                    Welcome, {userInfo.firstName}!
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Левая часть */}
                    <div className="flex flex-col items-center gap-6">
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer w-32 h-32 rounded-full bg-blue-700 flex items-center justify-center text-white text-6xl hover:bg-blue-800 transition"
                            title="Click to upload avatar"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            ) : (

                                isHovering ? <FaPlus /> : (
                                    userInfo?.avatarProfile ? (
                                    <img
                                        src={userInfo.avatarProfile}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    ) : (
                            <FaUserCircle />
                                    )
                            ))}
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept=".jpg, .png, .jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {userInfo.firstName} {userInfo.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">{userInfo.role}</p>
                        </div>

                        <div className="flex flex-col gap-4 w-full mt-4">
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-gray-600"/>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-gray-700">{userInfo.email || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <FaCalendarAlt className="text-gray-600"/>
                                <div>
                                    <p className="text-gray-400 text-sm">Joined</p>
                                    <p className="text-gray-700">{moment(userInfo.createdAt).format("MMMM D, YYYY")}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <AiFillApi className="text-gray-600"/>
                                <div>
                                    <p className="text-gray-400 text-sm">State</p>
                                    <p className={clsx(
                                        "text-sm font-semibold",
                                        userInfo.isActive ? "text-green-600" : "text-yellow-600"
                                    )}>
                                        {userInfo.isActive ? "Active" : "Disabled"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className="flex flex-col items-center justify-center gap-8 w-full p-8">
                        <div className="w-full max-w-4xl bg-white p-4 flex justify-center">
                            <h4 className="text-xl text-gray-600 font-semibold">Personal chart by priority</h4>
                            <PieChart chartData={chartData}/>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
