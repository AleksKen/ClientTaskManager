import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getInitials } from "../../utils/initials.js";

const UserInfo = ({ user }) => {
    return (
        <div className="px-0">
            <Popover className="">
                {({ open }) => (
                    <>
                        <Popover.Button className="h-7 w-7 rounded-full overflow-hidden text-white flex items-center justify-center text-sm">
                            {user?.avatarProfile ? (
                                <img
                                    src={user.avatarProfile}
                                    alt="User Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>{getInitials(user?.firstName, user?.lastName)}</span>
                            )}
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            show={open}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-80 max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
                                <div className="flex items-center gap-4 rounded-lg shadow-lg bg-white p-8">
                                    <div className="w-16 h-16 min-w-16 min-h-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl">
                                        {user?.avatarProfile ? (
                                            <img
                                                src={user.avatarProfile}
                                                alt="User Avatar"
                                                className="w-full h-full rounded-full object-cover" // Применяем object-cover, чтобы изображение заполнило круг
                                            />
                                        ) : (
                                            <span className="text-center font-bold">
                                                {getInitials(user?.firstName, user?.lastName)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-black text-xl font-bold">{user?.firstName + " " + user?.lastName}</p>
                                        <span className="text-base text-gray-500">{user?.title}</span>
                                        <span className="text-blue-500">
                                            {user?.email ?? "email@example.com"}
                                        </span>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};

export default UserInfo;
