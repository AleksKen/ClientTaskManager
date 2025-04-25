import ModalWrapper from "../ModalWrapper.jsx";
import {Dialog} from "@headlessui/react";
import Textbox from "../Textbox.jsx";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import UserList from "../user/UserList.jsx";
import SelectList from "../SelectList.jsx";
import {BiImages, BiX} from "react-icons/bi";
import Button from "../Button.jsx";
import {useCreateTaskMutation, useUpdateTaskMutation, useUpdateUserMutation} from "../../redux/slices/apiSlice.js";
import LabelList from "../LabelList.jsx";
import {uploadImage} from "../../redux/actions/UploadImage.js";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({task, open, setOpen, label}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm();

    useEffect(() => {
        if (task) {
            reset({
                title: task.title || "",
                description: task.description || "",
                date: task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
            });
        }
    }, [task, reset]);


    const [team, setTeam] = useState(task?.team || []);
    const [taskLabels, setTaskLabels] = useState(task?.labels || []);
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || label?.toUpperCase() || LISTS[0]);
    const [priority, setPriority] = useState(
        task?.priority?.toUpperCase() || PRIORITY[2]
    );
    const [assets, setAssets] = useState(task?.assets || []);
    const [uploading, setUploading] = useState(false);
    const [createTask, { isLoading, error }] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();

    const handleSelect = (e) => {
        setAssets([...assets, ...Array.from(e.target.files)]);
    };

    const handleRemoveAsset = (index) => {
        const newAssets = [...assets];
        newAssets.splice(index, 1);
        setAssets(newAssets);
    };

    const submitHandler = async (data) => {
        try {
            setUploading(true);

            const uploadedAssets = [];
            for (let i = 0; i < assets.length; i++) {
                const imageUrl = await uploadImage(assets[i]);
                uploadedAssets.push(imageUrl);
            }

            const newTask = {
                title: data.title,
                description: data.description || undefined,
                deadline: new Date(data.date).toISOString(),
                priority: priority.toString().toLowerCase(),
                stage: stage.toString().toLowerCase(),
                teamIds: team.map(user => user.id),
                taskLabelIds: taskLabels.map(label => label.id),
                assets: uploadedAssets,
            };

            console.log("Task data to be sent:", newTask);

            if (task) {
                await updateTask({
                    id: task.id,
                    ...newTask
                }).unwrap();
            } else {
                await createTask(newTask).unwrap();
            }

            reset();
            setTeam([]);
            setStage(LISTS[0]);
            setPriority(PRIORITY[2]);
            setAssets([]);
            setOpen(false);
            setUploading(false);
        } catch (err) {
            console.error('Failed to create task:', err);
            setUploading(false);
        }
    };

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Dialog.Title
                    as="h2"
                    className="text-base font-bold leading-6 text-gray-900 mb-4"
                >
                    {task ? "UPDATE TASK" : "ADD TASK"}
                </Dialog.Title>

                <div className="mt-2 flex flex-col gap-6">
                    <Textbox
                        placeholder="Task Title"
                        type="text"
                        name="title"
                        label="Task Title"
                        className="w-full rounded"
                        register={register("title", {required: "Title is required"})}
                        error={errors.title ? errors.title.message : ""}
                    />

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700 mb-1">Task Description</label>
                        <textarea
                            placeholder="Description"
                            {...register("description")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>

                    <UserList
                        setTeam={setTeam}
                        team={team}
                    />

                    <LabelList
                        setTaskLabels={setTaskLabels}
                        taskLabels={taskLabels}
                    />

                    <div className="flex gap-4">
                        <SelectList
                            label="Task Stage"
                            lists={LISTS}
                            selected={stage}
                            setSelected={setStage}
                        />

                        <SelectList
                            label="Priority Level"
                            lists={PRIORITY}
                            selected={priority}
                            setSelected={setPriority}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full">
                            <Textbox
                                placeholder="Date"
                                type="date"
                                name="date"
                                label="Task Date"
                                className="w-full rounded"
                                register={register("date", {
                                    required: "Date is required!",
                                })}
                                error={errors.date ? errors.date.message : ""}
                            />
                        </div>
                        <div className="w-full flex items-center justify-center mt-4">
                            <label
                                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                                htmlFor="imgUpload"
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    id="imgUpload"
                                    onChange={(e) => handleSelect(e)}
                                    accept=".jpg, .png, .jpeg"
                                    multiple={true}
                                />
                                <BiImages/>
                                <span>Add Assets</span>
                            </label>
                        </div>
                    </div>
                    {assets.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {assets.map((asset, idx) => (
                                <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden">
                                    <img
                                        src={typeof asset === "string" ? asset : URL.createObjectURL(asset)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAsset(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                                    >
                                        <BiX className="w-full h-full text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="py-6 sm:flex sm:flex-row-reverse gap-4">
                        {uploading ? (
                            <span className="text-sm py-2 text-red-500">
                  Uploading assets
                </span>
                        ) : (
                            <Button
                                label="Submit"
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                            />
                        )}

                        <Button
                            type="button"
                            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                            onClick={() => {
                                reset();
                                setTeam([]);
                                setTaskLabels([]);
                                setStage(label?.toUpperCase() || LISTS[0]);
                                setPriority(PRIORITY[2]);
                                setAssets([]);
                                setOpen(false);
                            }}
                            label="Cancel"
                        />
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default AddTask;