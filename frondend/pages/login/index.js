import React from 'react';
import Link from 'next/link';
import { login } from '../api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import *  as Yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const erroMessage = "use lowercase, uppercase and digits";

const index = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const { values, handleChange, handleBlur, touched, errors, resetForm } = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required('email is required'),
      password: Yup.string().min(8).max(25).matches(passwordPattern, { message: erroMessage }).required('password is required')
    })

  })
  const loginHandler = async () => {
    const data = {
      email: values.email,
      password: values.password
    }
    const response = await login(data);
    if(response.status === 200) {
      toast.success(response.data.messgae);
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        auth: response.data.auth
      }
      dispatch(setUser(user));
      router.push('/');
    }
  }
  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://i.imgur.com/BkxGS9k.gif)"
      }}
    >
      <div className="absolute bg-gradient-to-b from-green-400 to-green-300 opacity-75 inset-0 z-0" />
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10 ">
          {/* <div className="self-center hidden lg:flex flex-col  text-white ">
        <img src="login-logo.gif" className="mb-3 w-96 rounded-md shadow-lg" />
      </div> */}
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-100 bg-opacity-80 ">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
              <p className="text-gray-500">Please sign in to your account.</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="Enter Your Email Address"
                />
                 {errors.email && touched.email ? <p className='text-red-500 text-sm'>{errors.email}</p> : undefined}
              </div>
              <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="Enter your password"
                />
                 {errors.password && touched.password ? <p className='text-red-500 text-sm'>{errors.password}</p> : undefined}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-green-400 hover:text-green-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={loginHandler}
                  className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Sign in
                </button>
              </div>
            </div>
            <div className="pt-5 text-center text-gray-400 text-xs">

              <div className="text-sm">
                <span>
                  Don't have account?
                </span>
                <Link href="/signup" className="ml-2 text-green-400 hover:text-green-500">
                  Sign up
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default index