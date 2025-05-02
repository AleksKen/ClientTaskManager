import {useState} from "react";
import Title from "../components/Title.jsx";
import {Button} from "@headlessui/react";
import {IoMdAdd} from "react-icons/io";
import {getInitials} from "../utils/initials.js";
import clsx from "clsx";
import AddUser from "../components/user/AddUser.jsx";
import {ConfirmationDialog, UserAction} from "../components/Dialogs.jsx";
import {useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation} from "../redux/slices/apiSlice.js";
import {toast} from "sonner";



const Users = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAction, setOpenAction] = useState(false);
    const [selected, setSelected] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const userActionHandler = async () => {
        if (!selected) return;

        const updatedUser = {
            ...selected,
            isActive: !selected.isActive,
        };
        try {
            await updateUser(updatedUser).unwrap();
        } catch (err) {
            toast.error("Failed to update user.");
        } finally {
            setOpenAction(false);
            setSelected(null);
        }
    };

    const deleteHandler = async () => {
        try {
            await deleteUser(selected).unwrap();
        } catch (err) {
            toast.error("Delete user failed.");
        } finally {
            setOpenDialog(false);
            setSelected(null);
        }
    };

    const { data: users } = useGetUsersQuery();

    const deleteClick = (id) => {
        setSelected(id);
        setOpenDialog(true);
    };

    const editClick = (el) => {
        setSelected(el);
        setIsEditMode(true);
        setOpen(true);
    };

    const userStatusClick = (user) => {
        setSelected(user);
        setOpenAction(true);
    };

    const TableHeader = () => (
        <thead className='border-b border-gray-300'>
        <tr className='text-black text-left'>
            <th className='py-2'>Full Name</th>
            <th className='py-2'>State</th>
            <th className='py-2'>Email</th>
            <th className='py-2'>Role</th>
            <th className='py-2'>Active</th>
        </tr>
        </thead>
    );


    const TableRow = ({user}) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
            <td className='p-2'>
                <div className='flex items-center gap-3'>
                    <div
                        className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700 flex-shrink-0'>


                        {user?.avatarProfile ? (
                            <img
                                src={user.avatarProfile}
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className='text-xs md:text-sm text-center'>
                              {getInitials(user?.firstName, user?.lastName)}
                            </span>
                        )}
                    </div>
                    {user?.firstName + " " + user?.lastName}
                </div>
            </td>

            <td className='p-2'>{user.title}</td>
            <td className='p-2'>{user.email || "user.emal.com"}</td>
            <td className='p-2'>{user.role}</td>

            <td>
                <button
                    onClick={() => userStatusClick(user)}
                    className={clsx(
                        "w-fit px-4 py-1 rounded-full",
                        user?.isActive ? "bg-blue-200" : "bg-yellow-100"
                    )}
                >
                    {user?.isActive ? "Active" : "Disabled"}
                </button>
            </td>
            <td className='py-2 flex gap-2 md:gap-4 justify-end'>
                <Button
                    className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
                    label='Edit'
                    type='button'
                    onClick={() => editClick(user)}
                >Edit</Button>

                <Button
                    className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
                    label='Delete'
                    type='button'
                    onClick={() => deleteClick(user?.id)}
                >Delete</Button>
            </td>
        </tr>
    );

    return (
        <>
            <div className='w-full md:px-1 px-0 mb-6'>
                <div className='flex items-center justify-between mb-8'>
                    <Title title="Team Members"/>
                    <Button
                        onClick={() => {
                            setIsEditMode(false);
                            setOpen(true);
                        }}
                        label="Add New User"
                        icon={<IoMdAdd className="text-lg"/>}
                        className="flex items-center gap-2 bg-blue-600 text-white rounded-md py-2 2xl:py-2.5 px-4"
                    >
                        <IoMdAdd className="text-lg"/>
                        <span>Add New User</span>
                    </Button>
                </div>

                <div className='py-4'>

                </div>

                <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
                    <div className='overflow-x-auto'>
                        <table className='w-full mb-5'>
                            <TableHeader/>
                            <tbody>
                            {users?.map((user, index) => (
                                <TableRow key={index} user={user}/>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddUser
                open={open}
                setOpen={setOpen}
                userData={selected}
                isEditMode={isEditMode}
                key={new Date().getTime().toString()}
            />

            <ConfirmationDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onClick={deleteHandler}
            />

            <UserAction
                open={openAction}
                setOpen={setOpenAction}
                onClick={userActionHandler}
            />
        </>
    );
};

export default Users;