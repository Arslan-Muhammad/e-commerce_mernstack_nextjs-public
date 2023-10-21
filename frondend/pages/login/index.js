
import React from 'react';
import { login } from '../api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import *  as Yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const erroMessage = "use lowercase, uppercase and digits";

const Login = ({ toggle }) => {

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
  const handleLogin = async (e) => {
    e.preventDefault()
    const data = {
      email: values.email,
      password: values.password
    }
    const response = await login(data);
    if (response.status === 200) {
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        auth: response.data.auth
      }
      dispatch(setUser(user))
      toast.success(response.data.message)
      toggle()
    } else if (response.code === 'ERR_BAD_REQUEST') {
      toast.error(response.response.data.message)
      toast.error(response.response.data.error)
    }

  }
  return (

    <>
      <div className="fixed z-10 left-0 top-0 w-[100%] h-[100%] overflow-auto bg-white bg-opacity-10">
        <div className="bg-white absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-full max-w-sm  rounded-md">
          {/* close dialog */}
          <button onClick={toggle} className='absolute top-2 right-2 bg-red-600 h-6 w-6 hover:bg-red-800 rounded-md text-white'>
            X
          </button>
          {/* component */}
          <div className=" flex flex-col items-center justify-center">
            <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
              <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
                Login To Your Account
              </div>
              <button className="relative mt-2 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
                <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500">
                  <i className="fab fa-facebook-f" />
                </span>
                <span>Login with Facebook</span>
              </button>
              <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    Or Login With Email
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col mb-2">
                    <label
                      htmlFor="email"
                      className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                    >
                      Email:
                    </label>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <svg viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          stroke="currentColor"
                          stroke-width="2"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="h-5 w-5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12"
                            cy="7"
                            r="4"></circle>
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="text-sm  sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none focus:border-blue-400"
                        placeholder="Enter Email Address"
                        style={errors.email && touched.email && { borderBlockColor: "red" }}
                      />
                    </div>
                    {errors.email && touched.email ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </span> : undefined}

                  </div>
                  <div className="flex flex-col mb-6">
                    <label
                      htmlFor="password"
                      className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                    >
                      Password:
                    </label>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                        placeholder="Password"
                        style={errors.password && touched.password && { borderBlockColor: "red" }}
                      />
                    </div>
                    {errors.password && touched.password ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                      {errors.password}
                    </span> : undefined}
                  </div>
                  <div className="flex items-center mb-6 -mt-4">
                    <div className="flex ml-auto">
                      <a
                        href="#"
                        className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                      >
                        Forgot Your Password?
                      </a>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <button
                      type="submit"
                      className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                    >
                      <span className="mr-2 uppercase">Login</span>
                      <span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex justify-center items-center mt-2">
                <a
                  href="#"
                  target="_blank"
                  className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
                >
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                  <span className="ml-2">You don't have an account?</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  )
}

export default Login

