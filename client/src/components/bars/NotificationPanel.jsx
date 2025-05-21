import {Fragment} from 'react';
import {HiBellAlert} from "react-icons/hi2";
import {BiSolidMessageRounded} from "react-icons/bi";
import {Popover, Transition} from "@headlessui/react";
import {IoIosNotificationsOutline} from "react-icons/io";
import moment from "moment";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    useDeleteNotificationMutation,
    useGetNotificationsQuery,
    useUpdateNotificationMutation
} from "../../redux/slices/apiSlice.js";


const ICONS = {
    alert: (
        <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600'/>
    ),
    message: (
        <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600'/>
    )
};

const NotificationPanel = () => {
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.auth.userInfo);

    const { data, refetch } = useGetNotificationsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data
                ?.filter((notification) => notification.teamIds.includes(userInfo.id))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        }),
    });

    const [deleteNotification] = useDeleteNotificationMutation();
    const [updateNotification] = useUpdateNotificationMutation();

    const handleNotificationClick = (notification, close) => {
        const updatedTeamIds = notification.teamIds.filter((teamId) => teamId !== userInfo.id);

        if (updatedTeamIds.length === 0) {
            deleteNotification(notification.id).then(() => {
                refetch();
            });
        } else {
            updateNotification({
                id: notification.id,
                updatedData: {
                    teamIds: updatedTeamIds,
                },
            }).then(() => {
                refetch();
            });
        }

        navigate(`/task/${notification.taskId}`);
        close();
    };

    const handleMarkAllRead = async (close) => {
        if (!data || data.length === 0) return;

        const promises = data.map((notification) => {
            const updatedTeamIds = notification.teamIds.filter((teamId) => teamId !== userInfo.id);

            if (updatedTeamIds.length === 0) {
                return deleteNotification(notification.id);
            } else {
                return updateNotification({
                    id: notification.id,
                    updatedData: {
                        teamIds: updatedTeamIds,
                    },
                });
            }
        });

        await Promise.all(promises);
        refetch();
        close();
    };

    const callsToAction = (close) => [
        { name: 'Cancel', href: '#', icon: '', onClick: () => close() },
        {
            name: 'Mark All Read',
            href: '#',
            icon: '',
            onClick: () => handleMarkAllRead(close),
        },
    ];


    return (
        <Popover content='relative'>
            <Popover.Button className='inline-flex items-center outline-none'>
                <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
                    <IoIosNotificationsOutline className='text-2xl'/>
                    {data?.length > 0 && (
                        <span className='absolute text-center top-0 right-1 text-xs text-white
                        font-semibold w-4 h-4 rounded-full bg-red-600'>
                            {data?.length}
                        </span>
                    )}
                </div>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
                    {({close}) =>
                        data?.length > 0 && (
                            <div
                                className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                                <div className='p-4'>
                                    {data?.slice(0, 5).map((item, index) => (
                                        <div
                                            key={item.id + index}
                                            className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                                        >
                                            <div
                                                className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                                                {ICONS[item.type]}
                                            </div>

                                            <div
                                                className='cursor-pointer'
                                                onClick={() => handleNotificationClick(item, close)}
                                            >
                                                <div
                                                    className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                                                    <p> {item.type}</p>
                                                    <span className='text-xs font-normal lowercase'>
                                                      {moment(item.createdAt).fromNow()}
                                                    </span>
                                                </div>
                                                <p className='line-clamp-1 mt-1 text-gray-600'>
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='grid grid-cols-2 divide-x bg-gray-50'>
                                    {callsToAction(close).map((item) => (
                                        <Link
                                            key={item.name}
                                            onClick={item.onClick}
                                            className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                </div>
                            </div>
                        )
                    }
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default NotificationPanel;