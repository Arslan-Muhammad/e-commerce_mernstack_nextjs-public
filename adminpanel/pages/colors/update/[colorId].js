
import { useFormik } from 'formik';
import { getColor, updateColor } from '@/pages/api/api';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { SketchPicker } from 'react-color'

const index = (props) => {

    const myColor = props.data.color;

    if (!myColor) {
        return <Loading />
    }

    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('');

    

    const updateHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            id: myColor._id,
            title: color,
        }
        const res = await updateColor(data);
        if (res.status === 200) {
            toast.success(res.data.message);
            setLoading(false);
        } else if (res.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(res.response.data.message);
            toast.error(res.response.data.error);
        }
    }
    const setColorHandler = (color) => {
        setColor(color.hex);
    }

    useEffect(() => {
        if (myColor) {
            setColor(myColor.title);
        }
    }, [])


    return (
        <section className="bg-white dark:bg-gray-900 p-4 sm:ml-64">
            <div className="px-4 mx-auto max-w-full">
                <h2 className="mb-4 text-center text-xl font-bold dark:text-white bg-slate-800 rounded-xl py-1 shadow-md text-white">
                    UPDATE COLOR
                </h2>
                <form onSubmit={updateHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className='w-full'>
                        <SketchPicker
                            color={ color }
                            onChangeComplete={setColorHandler}
                            />
                        </div>


                    </div>
                    {
                        loading ?
                            <button
                                disabled
                                className="items-center cursor-wait w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-500"
                            >
                                Updating...
                            </button>
                            :
                            <button
                                type="submit"
                                className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            >
                                Update Color
                            </button>
                    }
                </form>
                <div
                    className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                >
                    <Link href="/colors">
                        Close
                    </Link>
                </div>

            </div>
        </section>

    )
}

export default index;

export async function getServerSideProps({ params }) {
    const id = params.colorId;
    const res = await getColor(id);
    const color = await res.data;
    return {
        props: {
            data: color
        }
    }
} 