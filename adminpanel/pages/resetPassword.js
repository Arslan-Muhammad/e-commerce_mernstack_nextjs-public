import { resetPasswordReq } from '../pages/api/api';
import { toast } from 'react-toastify';
import { Label, TextInput } from 'flowbite-react';
import { BiLockAlt } from 'react-icons/bi';
import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

const resetPassword = () => {

    const router = useRouter();

    const {token} = router.query;
    const {id} = router.query;

    const [loading, setLoading] = useState(false);

    const { values, handleChange } = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        }
    })

    const resetPasswordhanlder = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            password: values.password,
            confirmPassword: values.confirmPassword
        }
        const response = await resetPasswordReq(data, token, id);
        if (response.status === 200) {
            setLoading(false)
            toast.success(response.data.message)
        } else if (response.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(response.response.data.message);
            toast.error(response.response.data.error);
        }
    }
    return (
        <main>
            <img
                src="/loginbg.jpg"
                className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                    <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="relative bg-white bg-opacity-60 rounded-xl p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="absolute -top-5 bg-slate-900 p-3 sm:w-80 md:w-96 rounded-xl shadow-lg">
                                <h1 className="text-xl text-center font-bold leading-tight tracking-tight md:text-2xl text-white">
                                    Change Password
                                </h1>
                            </div>
                            <form className="space-y-2 md:space-y-6" onSubmit={resetPasswordhanlder} >
                                <div className="max-w-md">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="password"
                                            value="Your Password"
                                        />
                                    </div>
                                    <TextInput
                                        icon={BiLockAlt}
                                        id="password"
                                        placeholder="Enter Password"
                                        type="password"
                                        name='password'
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="max-w-md">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="confirmPassword"
                                            value="Your Confirm Password"
                                        />
                                    </div>
                                    <TextInput
                                        icon={BiLockAlt}
                                        id="confirmPassword"
                                        placeholder="Enter Confirm Password"
                                        type="password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        href="/"
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Login here
                                    </Link>
                                </div>
                                {loading ? <button
                                    type="submit"
                                    className="w-full disabled cursor-wait text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Send Request...
                                </button> : <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Send Request
                                </button>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default resetPassword;