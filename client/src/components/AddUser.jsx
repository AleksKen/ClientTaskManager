import {useForm} from "react-hook-form";
import ModalWrapper from "./ModalWrapper.jsx";
import Textbox from "./Textbox.jsx";
import {Dialog} from "@headlessui/react";
import Loader from "./Loader.jsx";
import Button from "./Button.jsx";

const AddUser = ({open, setOpen, userData, isEditMode}) => {
    let defaultValues = userData ?? {};

    const isLoading = false,
        isUpdating = false;

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({defaultValues});

    const handleOnSubmit = () => {
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        {isEditMode ? "UPDATE PROFILE" : "ADD NEW USER"}
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-6">
                        <Textbox
                            placeholder="Full name"
                            type="text"
                            name="name"
                            label="Full Name"
                            className="w-full rounded"
                            register={register("name", {
                                required: "Full name is required!",
                            })}
                            error={errors.name ? errors.name.message : ""}
                        />
                        <Textbox
                            placeholder="Title"
                            type="text"
                            name="title"
                            label="Title"
                            className="w-full rounded"
                            register={register("title", {
                                required: "Title is required!",
                            })}
                            error={errors.title ? errors.title.message : ""}
                        />
                        <Textbox
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            label="Email Address"
                            className="w-full rounded"
                            register={register("email", {
                                required: "Email Address is required!",
                            })}
                            error={errors.email ? errors.email.message : ""}
                        />

                        <Textbox
                            placeholder="Role"
                            type="text"
                            name="role"
                            label="Role"
                            className="w-full rounded"
                            register={register("role", {
                                required: "User role is required!",
                            })}
                            error={errors.role ? errors.role.message : ""}
                        />
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
                                onClick={() => setOpen(false)}
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