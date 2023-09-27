import { useEffect, useState } from "react";
import { getAllUsersInfo, unBlock, block } from "../api/api";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const index = () => {

    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        (async () => {
            const res = await getAllUsersInfo();
            if (res.status === 200) {
                setLoading(true)
                setData(res.data.user);
            }
        })();
    }, [reload])

    const blockHandler = async (id) => {
        const res = await block(id);
        if (res.status === 200) {
            setReload(!reload);
            toast.success(res.data.message);
        }
    }

    const unBlockHandler = async (id) => {
        const res = await unBlock(id);
        if (res.status === 200) {
            setReload(!reload);
            toast.success(res.data.message);
        }
    }
    return (
        <main className='p-4 sm:ml-64'>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    Total Users: {data.length}
                    {
                        loading ?
                            <table className="w-full whitespace-no-wrap">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">active</th>
                                        <th className="px-4 py-3">Create At</th>
                                        <th className="px-4 py-3">Last Update</th>
                                        <th className="px-4 py-3">Status</th>

                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {data.map((user) => {
                                        return (
                                            <tr className="text-gray-700 dark:text-gray-400" key={user._id}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center text-sm">
                                                        {/* Avatar with inset shadow */}
                                                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                            <img
                                                                className="object-cover w-full h-full rounded-full"
                                                                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                                                alt=""
                                                                loading="lazy"
                                                            />
                                                            <div
                                                                className="absolute inset-0 rounded-full shadow-inner"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{user.firstName + user.lastName}</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{user.role}</td>
                                                <td className="px-4 py-3 text-xs">
                                                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                                        Online
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{user.createdAt}</td>
                                                <td className="px-4 py-3 text-sm">{user.updatedAt}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center space-x-4 text-sm">
                                                        {user.isBlocked ? <button
                                                            onClick={() => unBlockHandler(user._id)}
                                                            className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 bg-red-700 dark:bg-red-600 text-white rounded-lg dark:text-black-400 focus:outline-none focus:shadow-outline-gray"
                                                        >
                                                            UnBlocked
                                                        </button>
                                                            :
                                                            <button
                                                                onClick={() => blockHandler(user._id)}
                                                                className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 bg-green-700 dark:bg-green-600 text-white rounded-lg dark:black-gray-400 focus:outline-none focus:shadow-outline-gray"
                                                            >
                                                                Blocked
                                                            </button>}
                                                    </div>
                                                </td>
                                            </tr>)
                                    })
                                    }
                                </tbody>

                            </table>
                            :
                            <Loading />}
                </div>
                <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                    <span className="flex items-center col-span-3">Showing 1-2 of 10</span>
                    <span className="col-span-2" />
                    {/* Pagination */}
                    <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                        <nav aria-label="Table navigation">
                            <ul className="inline-flex items-center">
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                                        aria-label="Previous"
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple text-white bg-purple-600 border border-r-0 border-purple-600 focus:shadow-outline-purple ">
                                        1
                                    </button>
                                </li>
                                <li>
                                    <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                                        2
                                    </button>
                                </li>
                                <li>
                                    <button className="px-3 py-1  transition-colors duration-150 focus:outline-none ">
                                        3
                                    </button>
                                </li>
                                <li>
                                    <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                                        4
                                    </button>
                                </li>
                                <li>
                                    <span className="px-3 py-1">...</span>
                                </li>
                                <li>
                                    <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                                        8
                                    </button>
                                </li>
                                <li>
                                    <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                                        9
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                                        aria-label="Next"
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </span>
                </div>
            </div>
        </main>
    )
}

export default index;