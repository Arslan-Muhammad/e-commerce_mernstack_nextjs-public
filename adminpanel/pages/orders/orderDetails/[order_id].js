import { toast } from 'react-toastify';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { getOrderbyUserId } from '@/pages/api/api';

const index = () => {


    const router = useRouter();

    const id = router.query.order_id;

    const [allOrders, setAllOrders] = useState([]);
    const [orderBy, setOrderBy] = useState([]);

    // // // search with multiple
    const [searchQuery, setSearchQuery] = useState('');
    const multipleSearch = allOrders.filter((product) =>
        Object.keys(product).some((parameter) =>
            product[parameter].toString().toLowerCase().includes(searchQuery)
        )
    )

    // pagination
    const [currentPageX, setCurrentPageX] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPageX * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = multipleSearch.slice(firstIndex, lastIndex)
    const npages = Math.ceil(allOrders.length / recordsPerPage);
    const numbers = [...Array(npages + 1).keys()].slice(1);

    // for previous pages
    const prePage = () => {
        if (currentPageX !== firstIndex) {
            setCurrentPageX(currentPageX - 1)
        }
    }

    // for next pages
    const nextPage = () => {
        if (currentPageX !== lastIndex) {
            setCurrentPageX(currentPageX + 1)
        }
    }

    // for changed pages
    const changePage = async (id) => {
        setCurrentPageX(id)
    }
    useEffect(() => {
        (async function getOrderHandler() {
            const response = await getOrderbyUserId(id);
            if (response.status === 200) {
                setAllOrders(response.data);
                setOrderBy(response.data);
            }
        })()
    }, []);

    // if (allOrders.length === 0) {
    //     return <Loading />
    // }


    return (
        <main className='p-4 sm:ml-64'>

            <Head>
                <title> Signle Order Detail</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="author" content="mrzahidfaiz" />
            </Head>

            <section>
                {/* Start coding here */}
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

                    </div>
                </div>

            </section>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Order_id</th>
                                <th className="px-4 py-3">OrderBy</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Brand</th>
                                <th className="px-4 py-3">Color</th>
                                <th className="px-4 py-3">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {records.map((order) => {
                                return (
                                    <div key={order._id}>
                                        {
                                            order.products.map((product, index) => {
                                                return (
                                                    <tr className="text-gray-700 dark:text-gray-400" key={index}>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center text-sm">
                                                                {/* Avatar with inset shadow */}
                                                                <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                                    <img
                                                                        className="object-cover w-full h-full rounded-full"
                                                                        src={product._id.images[0].url}
                                                                        alt={product._id.title}
                                                                        loading="lazy"
                                                                    />
                                                                    <div
                                                                        className="absolute inset-0 rounded-full shadow-inner"
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold">{product._id.title}</p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {product._id.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs">
                                                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                                                {product._id.title}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">{product.color}</td>
                                                        <td className="px-4 py-3 text-sm">{product.qty}</td>
                                                        <td className="px-4 py-3 text-sm">{product.totalPrice}</td>

                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center space-x-4 text-sm">
                                                                {/* <Link
                                                                        href={`/orders/orderDetails/${order._id}`}
                                                                        className="flex items-center underline justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                                                        aria-label="Edit"
                                                                    >
                                                                        View Detail
                                                                    </Link> */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </div>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                    <span className="flex items-center col-span-3">Showing {currentPageX}-{npages} of {npages}</span>
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
                                    numbers.map((n, i) => {
                                        return (
                                            <li key={i}>
                                                <button
                                                    onClick={() => changePage(n)}
                                                    className={` ${currentPageX === n ? 'text-white bg-purple-600 border-purple-600 focus:outline-none focus:shadow-outline-purple' : ''} px-3 py-1  transition-colors duration-150  border border-r-0  rounded-md `}>
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

export default index