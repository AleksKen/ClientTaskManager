import {useForm} from "react-hook-form";
import ModalWrapper from "../ModalWrapper.jsx";
import Textbox from "../Textbox.jsx";
import {Dialog} from "@headlessui/react";
import Loader from "../Loader.jsx";
import Button from "../Button.jsx";
import {useCreateUserMutation, useUpdateUserMutation} from "../../redux/slices/apiSlice.js";
import {useEffect} from "react";


const AddUser = ({open, setOpen, userData, isEditMode}) => {
    const defaultValues = isEditMode ? userData : {
        firstName: '',
        lastName: '',
        title: '',
        role: '',
        email: undefined,
        password: undefined,
        isAdmin: false,
        isActive: true,
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [userData, isEditMode]);


    const [createUser, {isLoading, error}] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

    const submitHandler = async (data) => {
        const newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            role: data.role,
            email: data.email || undefined,
            password: data.password || undefined,
            isAdmin: data.isAdmin,
            isActive: data.isActive,
        };

        console.log("User data to be sent:", newUser);

        try {
            if (isEditMode) {
                await updateUser({ ...newUser, id: userData.id }).unwrap();
            } else {
                await createUser(newUser).unwrap();
            }
            reset();
            setOpen(false);
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        {isEditMode ? "UPDATE PROFILE" : "ADD NEW USER"}
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-6">
                        <div className="flex gap-4">
                            <Textbox
                                placeholder="First Name"
                                type="text"
                                name="firstName"
                                label="First Name"
                                className="w-full rounded"
                                register={register("firstName", {
                                    required: !isEditMode && "First name is required!",
                                })}
                                error={errors.firstName ? errors.firstName.message : ""}
                            />
                            <Textbox
                                placeholder="Last Name"
                                type="text"
                                name="lastName"
                                label="Last Name"
                                className="w-full rounded"
                                register={register("lastName", {
                                    required: !isEditMode && "Last name is required!",
                                })}
                                error={errors.lastName ? errors.lastName.message : ""}
                            />
                        </div>
                        <Textbox
                            placeholder="Status"
                            type="text"
                            name="status"
                            label="Status"
                            className="w-full rounded"
                            register={register("title")}
                            error={errors.title ? errors.title.message : ""}
                        />
                        <Textbox
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            label="Email Address"
                            className="w-full rounded"
                            register={register("email", {
                                required: !isEditMode && "Email Address is required!",
                            })}
                            error={errors.email ? errors.email.message : ""}
                        />

                        <Textbox
                            placeholder="Role"
                            type="text"
                            name="role"
                            label="Role"
                            className="w-full rounded"
                            register={register("role")}
                            error={errors.role ? errors.role.message : ""}
                        />
                        <Textbox
                            placeholder="Password"
                            type="password"
                            name="password"
                            label="Password"
                            className="w-full rounded"
                            register={register("password", {
                                required: !isEditMode && "Password is required!",
                            })}
                            error={errors.password ? errors.password.message : ""}
                        />


                        <div className="flex gap-4 items-center">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register("isAdmin")}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">Is Admin</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register("isActive")}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">Is Active</span>
                            </label>
                        </div>


                    </div>
                    {isLoading || isUpdating ? (
                        <div className="py-5">
                            <Loader/>
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                label="Submit"
                            >
                            </Button>

                            <Button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => {
                                    reset();
                                    setOpen(false);
                                }}
                                label="Cancel"
                            >
                            </Button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default AddUser;