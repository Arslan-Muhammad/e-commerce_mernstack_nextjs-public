
import { createColor } from '@/pages/api/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link';
import { SketchPicker } from 'react-color'
import Head from 'next/head';



const index = () => {


    const [loading, setLoading] = useState(false);
    const [colors, setColors] = useState('');
    const [label, setLabel] = useState('');

    console.log(colors, 'color--->')
    const handleChangeComplete = (color) => {
        setColors(color.hex);
    };

    const submitColorHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            label: label,
            value: colors,
        }
        const res = await createColor(data);
        if (res.status === 200) {
            toast.success(res.data.message);
            setLoading(false);
        } else if (res.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(res.response.data.message);
            toast.error(res.response.data.error);
        }
    }


    return (
        <section className="bg-white dark:bg-gray-900 p-4 sm:ml-64">

             <Head>
                <title>Create Color</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="author" content="mrzahidfaiz" />
            </Head>

            <div className="py-2 px-4 mx-auto max-w-full">
                <h2 className="mb-4 text-center text-xl font-bold dark:text-white bg-slate-800 rounded-xl py-1 shadow-md text-white">
                    Add a new Color
                </h2>
                <form onSubmit={submitColorHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className='w-full'>

                            <SketchPicker
                                color={colors}
                                onChangeComplete={handleChangeComplete}
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="label"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Color Name
                            </label>
                            <input
                                type="text"
                                name="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                id="title"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type product title"
                            />
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
                                Add Color
                            </button>
                    }
                </form>
                <Link href="/colors">
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