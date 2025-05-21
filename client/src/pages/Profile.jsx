import {useDispatch, useSelector} from "react-redux";
import {FaUserCircle, FaEnvelope, FaCalendarAlt} from "react-icons/fa";
import clsx from "clsx";
import moment from "moment";
import {AiFillApi} from "react-icons/ai";
import {getChartData} from "../utils/сhartData.js";
import {useGetTasksQuery, useUpdateUserMutation} from "../redux/slices/apiSlice.js";
import PieChart from "../components/charts/PieChart.jsx";
import {useState} from "react";
import {uploadImage} from "../redux/actions/UploadImage.js";
import {setUserInfo} from "../redux/slices/authSlice.js";
import AddUser from "../components/user/AddUser.jsx";
import {BiX} from "react-icons/bi";
import {toast} from "sonner";

const Profile = () => {
    const {userInfo} = useSelector((state) => state.auth);
    const {data: tasks} = useGetTasksQuery();


    const userTasks = tasks?.filter(task =>
        task.team?.some(member => member.id === userInfo.id)
    );

    const chartData = getChartData(userTasks);
    const dispatch = useDispatch();

    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [updateUser] = useUpdateUserMutation();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            await submitHandler(file);
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            setUploading(true);
            const updatedUser = {
                avatarProfile: null,
            };
            const updatedData = await updateUser({
                id: userInfo.id,
                ...updatedUser,
            }).unwrap();
            dispatch(setUserInfo(updatedData));
            setUploading(false);
        } catch (err) {
            console.error('Failed to remove user avatar:', err);
            setUploading(false);
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
            toast.error("Failed to update user avatar: " + err.message);
            setUploading(false);
        }
    };

    return (
        <>
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
                            <div className="relative w-32 h-32">
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer w-32 h-32 rounded-full bg-blue-700 flex items-center justify-center text-white text-6xl hover:bg-blue-800 transition overflow-hidden"
                                    title="Click to upload avatar"
                                >
                                    {uploading ? (
                                        <div
                                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    ) : (
                                        userInfo?.avatarProfile ? (
                                            <img
                                                src={userInfo.avatarProfile}
                                                alt="User Avatar"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <FaUserCircle/>
                                        )
                                    )}
                                </label>

                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept=".jpg, .png, .jpeg"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {userInfo?.avatarProfile && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                                        title="Remove Avatar"
                                    >
                                        <BiX className="w-6 h-6"/>
                                    </button>
                                )}
                            </div>


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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    onClick={() => setOpen(true)}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Правая часть */}
                        <div className="flex flex-col items-center justify-center gap-8 w-full p-8">
                            {userTasks?.length === 0 ? (
                                <div className="w-full max-w-4xl bg-white p-4 text-center">
                                    <span className="text-4xl">🎉</span>
                                    <h4 className="text-2xl font-semibold text-gray-700">No tasks found</h4>
                                    <p className="text-lg text-gray-500">You have no personal tasks yet — time to
                                        chill!</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl bg-white p-4 flex flex-col items-center gap-4">
                                    <h4 className="text-xl text-gray-600 font-semibold">Personal chart by priority</h4>
                                    <PieChart chartData={chartData}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AddUser
                open={open}
                setOpen={setOpen}
                userData={userInfo}
                isEditMode={true}
                key={new Date().getTime().toString()}
            />
        </>
    );
};

export default Profile;
