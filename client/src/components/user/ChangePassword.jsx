import {Button, Dialog} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loader from "../Loader.jsx";
import ModalWrapper from "../ModalWrapper.jsx";
import Textbox from "../Textbox.jsx";
import {useUpdateUserMutation} from "../../redux/slices/apiSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {setUserInfo} from "../../redux/slices/authSlice.js";

const ChangePassword = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state) => state.auth);
    const [updateUser, {isLoading}] = useUpdateUserMutation();


    const handleOnSubmit = async (data) => {
        if (data.password !== data.cpass) {
            toast.warning("Passwords doesn't match");
            return;
        }

        const updatedUser = {
            password: data.password,
        };

        try {
            const updatedData = await updateUser({
                id: userInfo.id,
                ...updatedUser,
            }).unwrap();
            dispatch(setUserInfo(updatedData));
            toast.success("Password changed successfully");
            reset();
            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch (err) {
            reset();
            toast.error("Failed to changed password: " + err.data.detail);
        }
    };
    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        Change Passowrd
                    </Dialog.Title>
                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='New Passowrd'
                            type='password'
                            name='password'
                            label='New Passowrd'
                            className='w-full rounded'
                            register={register("password", {
                                required: "New Passowrd is required!",
                            })}
                            error={errors.password ? errors.password.message : ""}
                        />
                        <Textbox
                            placeholder='Confirm New Passowrd'
                            type='password'
                            name='cpass'
                            label='Confirm New Passowrd'
                            className='w-full rounded'
                            register={register("cpass", {
                                required: "Confirm New Passowrd is required!",
                            })}
                            error={errors.cpass ? errors.cpass.message : ""}
                        />
                    </div>
                    {isLoading ? (
                        <div className='py-5'>
                            <Loader />
                        </div>
                    ) : (
                        <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                label="Submit"
                            >
                                Save
                            </Button>

                            <Button
                                type='button'
                                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                                onClick={
                                    () => {
                                        reset();
                                        setOpen(false);
                                    }
                            }
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default ChangePassword;