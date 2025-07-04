import {Fragment, useEffect, useState} from "react";
import {Listbox, Transition} from "@headlessui/react";
import {BsChevronExpand} from "react-icons/bs";
import clsx from "clsx";
import {MdCheck} from "react-icons/md";
import {useGetLabelsQuery} from "../../redux/slices/apiSlice.js";

const LabelList = ({taskLabels, setTaskLabels}) => {
    const [selectedLabels, setSelectedLabels] = useState([]);
    const { data: labels } = useGetLabelsQuery();

    const handleChange = (e) => {
        setSelectedLabels(e);
        setTaskLabels(e);
    };

    useEffect(() => {
        if (labels) {
            if (taskLabels?.length < 1) {
                setSelectedLabels([labels[0]]);
                setTaskLabels([labels[0]]);
            } else {
                setSelectedLabels(taskLabels);
            }
        }
    }, [labels]);

    return (
        <div>
            <p className="text-gray-700">Labels: </p>
            <Listbox
                value={selectedLabels}
                onChange={handleChange}
                multiple
            >
                <div className="relative mt-1">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
                        <span className="block truncate">
                          {selectedLabels?.map((label) => label?.name).join(", ")}
                        </span>

                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <BsChevronExpand
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                          />
                        </span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >

                        <Listbox.Options
                            className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {labels?.map((label, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({active}) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4. ${
                                            active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                        } `
                                    }
                                    value={label}
                                >
                                    {({selected}) => (
                                        <>
                                            <div
                                                className={clsx(
                                                    "flex items-center gap-2 truncate",
                                                    selected ? "font-medium" : "font-normal"
                                                )}
                                            >
                                                <span>{label?.name}</span>
                                            </div>
                                            {selected ? (
                                                <span
                                                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true"/>
                        </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};


export default LabelList;