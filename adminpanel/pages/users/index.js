import { useEffect, useState } from "react";
import { getAllUsersInfo, unBlock, block } from "../api/api";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/router";

const index = () => {

    const [data, setData] = useState([]);

    const router = useRouter();

    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);

    // search with multiple fields
    const [searchQuery, setSearchQuery] = useState('');
    const multipleSearch = data.filter((product) =>
        Object.keys(product).some((parameter) =>
            product[parameter].toString().toLowerCase().includes(searchQuery)
        )
    )

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = multipleSearch.slice(firstIndex, lastIndex)
    const npages = Math.ceil(data.length / recordsPerPage);
    const numbers = [...Array(npages + 1).keys()].slice(1);

    // for previous pages
    const prePage = () => {
        if (currentPage !== firstIndex) {
            setCurrentPage(currentPage - 1)
        }
    }

    // for next pages
    const nextPage = () => {
        if (currentPage !== lastIndex) {
            setCurrentPage(currentPage + 1)
        }
    }

    // for changed pages
    const changePage = async (id) => {
        setCurrentPage(id)
    }

    // block user Handler
    const blockHandler = async (id) => {
        const res = await block(id);
        if (res.status === 200) {
            setReload(!reload);
            toast.success(res.data.message);
        }
    }

    // unblock User handler
    const unBlockHandler = async (id) => {
        const res = await unBlock(id);
        if (res.status === 200) {
            setReload(!reload);
            toast.success(res.data.message);
        }
    }

    // Api DataBase Record Fetcher
    useEffect(() => {
        (async () => {
            const res = await getAllUsersInfo();
            if (res.status === 200) {
                setLoading(true);
                setData(res.data.user);
            }
        })();
    }, [reload]);

    return (
        <main className='p-4 sm:ml-64'>
            <div className="relative bg-white shadow-sm mb-4 dark:bg-gray-800 sm:rounded-lg">
                <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">
                                Search
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name='search'
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                        <Link
                            href="/colors/submit"
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                        >
                            <svg
                                className="h-3.5 w-3.5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                />
                            </svg>
                            Add Color
                        </Link>
                    </div>
                </div>
            </div>
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
                                    {records.map((user) => {
                                        const createdAt = user.createdAt;
                                        const updatedAt = user.updatedAt;

                                        const createdAtDate = createdAt.slice(0, 10);
                                        const createdAtTime = createdAt.slice(11, 19);

                                        const updatedAtDate = updatedAt.slice(0, 10);
                                        const updatedAtTime = updatedAt.slice(11, 19);
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
                                                <td className="px-4 py-3 text-sm">{createdAtTime + " " + createdAtDate}</td>
                                                <td className="px-4 py-3 text-sm">{updatedAtTime + " " + updatedAtDate}</td>
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
                                        onClick={prePage}
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
                                {
                                    numbers?.map((n, i) => {
                                        return (
                                            <li key={i}>
                                                <button
                                                    onClick={() => changePage(n)}
                                                    className={` ${currentPage === n ? 'text-white bg-purple-600 border-purple-600 focus:outline-none focus:shadow-outline-purple' : ''} px-3 py-1  transition-colors duration-150  border border-r-0  rounded-md `}>
                                                    {n}
                                                </button>
                                            </li>
                                        )
                                    })
                                }

                                <li>
                                    <button
                                        onClick={nextPage}
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