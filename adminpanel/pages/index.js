
import { adminLogin } from './api/api';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/UserSlice';
import { Checkbox, Label, TextInput } from 'flowbite-react';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { useState } from 'react';
import Link from 'next/link';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const erroMessage = "use lowercase, uppercase and digits";

export default function Home() {

  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { values, handleChange, handleBlur, touched, errors, resetForm } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required('email is required'),
      password: Yup.string().min(8).max(25).matches(passwordPattern, { message: erroMessage }).required('password is required')
    })
  })

  // password hide show
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const adminLoginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: values.email,
      password: values.password
    }

    const response = await adminLogin(data);
    if (response.status === 200) {
      const user = {
        _id: response.data.user._id,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        auth: response.data.auth,
      }
      dispatch(setUser(user));
      toast.success(response.data.message);
      setLoading(false)
      router.push('/dashboard');
      resetForm();
    } else if (response.code === 'ERR_BAD_REQUEST') {
      setLoading(false);
      toast.error(response.response.data.message);
      toast.error(response.response.data.error);
      values.password = "";
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
                  Admin Login
                </h1>
              </div>
              <form className="space-y-2 md:space-y-6" onSubmit={adminLoginHandler} >
                <div className="max-w-md">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email"
                      value="Your email"
                    />
                  </div>
                  <TextInput
                    icon={HiMail}
                    id="email"
                    placeholder="Enter Email Address"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='email'
                  />
                  {errors.email && touched.email ? <p className='text-red-500 text-sm'>{errors.email}</p> : undefined}
                </div>
                <div className="max-w-md">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="password"
                      value="Password"
                    />
                  </div>
                  <TextInput
                    icon={HiLockClosed}
                    id="password"
                    placeholder="***********"
                    type={isPasswordVisible ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='password'
                  />
                  {errors.password && touched.password ? <p className='text-red-500 text-sm'>{errors.password}</p> : undefined}
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox id="show/hide"
                      checked={isPasswordVisible}
                      onChange={togglePasswordVisibility}
                    />
                    <Label
                      htmlFor="show/hide"
                      className='text-gray-500'
                    >
                      <p>
                        Show Password
                      </p>

                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgetPassword"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                {loading ? <button
                  type="submit"
                  className="w-full disabled cursor-wait text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in...
                </button> : <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>}
              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
