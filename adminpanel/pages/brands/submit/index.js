
import { createBrand } from '@/pages/api/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link';

const index = () => {


    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);



    const submitBrandHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            title: title
        }
        const res = await createBrand(data);
        if (res.status === 200) {
            toast.success(res.data.message);
            setLoading(false);
        } else if (res.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(res.response.data.message);
            toast.error(res.response.data.error);
        } else if (res.code === 'ERR_BAD_RESPONSE') {
            toast.error(res.message);
        }
    }


    return (
        <section className="bg-white dark:bg-gray-900 p-4 sm:ml-64">
            <div className="py-2 px-4 mx-auto max-w-full">
                <h2 className="mb-4 text-center text-xl font-bold dark:text-white bg-slate-800 rounded-xl py-1 shadow-md text-white">
                    Add a new Brand
                </h2>
                <form onSubmit={submitBrandHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className='w-full'>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Brand Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    id="title"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Type product title"
                                />
                            </div>
                        </div>
                    </div>
                    {
                        loading ?
                            <button
                                disabled
                                className="items-center cursor-wait w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-500"
                            >
                                Adding...
                            </button>
                            :
                            <button
                                type="submit"
                                className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            >
                                Add Brand
                            </button>
                    }
                </form>
                <Link href="/brands">
                    <div
                        className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Close
                    </div>
                </Link>
            </div>
        </section>

    )
}

export default index;