import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { INCREMENT_ITEM, DECREMENT_ITEM, DELETE_ITEM } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { getAddress, createAddress, updateAddress, createOrder } from "../api/api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";



const Cart = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const itemInCart = useSelector((state) => state.cart.cart);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const IncrementHandler = (item) => {
    dispatch(INCREMENT_ITEM(item))
  }

  const decrementHandler = (item) => {
    dispatch(DECREMENT_ITEM(item))
  }

  const deleteHandler = (item) => {
    dispatch(DELETE_ITEM(item))
  }

  const prices = itemInCart.map((item) => item.totalPrice);
  let subTotal = 0;
  for (let i = 0; i < prices.length; i++) {
    subTotal += prices[i];
  }

  useEffect(() => {
    (async function getAdressHandler() {
      const response = await getAddress();
      if (response.status === 200) {
        setName(response.data.address.name);
        setAddress(response.data.address.address);
        setCity(response.data.address.city);
        setPhone(response.data.address.phone);
      } else if (response.status === 'ERR_BAD REQUEST') {
        router.push('/login');
        toast.warn('please login to get address')
      }
    })();

  }, [])

  const updateAddressHandler = async () => {
    const data = {
      name, address, city, phone
    }
    const response = await updateAddress(data);
    if (response.status === 200) {
      toast.success(response.data.message);
    } else if (response.code === 'ERR_BAD_REQUEST') {
      router.push('/login');
      toast.error(response.response.data.message);
    }
  }
  const createAddressHandler = async () => {
    const data = {
      name, address, city, phone
    }
    const response = await createAddress(data);
    if (response.status === 200) {
      toast.success(response.data.message);
    } else if (response.code === 'ERR_BAD_REQUEST') {
      router.push('/login');
      toast.error(response.response.data.message);
    }
  }


  const createOrderHandler = async () => {
    const response = await createOrder({cart: itemInCart});
    if(response.status === 200) {
      toast.success(response.data.message);
    } else if(response.code === 'ERR_BAD_REQUEST') {
      toast.error(response.response.data.message);
    }
  }

  if (!itemInCart.length) {
    return (
      <Link href="/">
        <img className="w-full" src="https://wpmet.com/wp-content/uploads/2022/09/EmptyCart_3-Copy.png" alt="asad" />
      </Link>
    )
  }
  return (
    <section className="h-screen w-full bg-gray-100">
      <div className="container h-screen w-full px-4 md:px-8 py-6 ">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-2 ">
          <div className="col-span-2 h-[500px] overflow-y-auto p-4">
            <ul className="">
              {itemInCart.map((item) => {
                return (
                  <li className="flex flex-col space-y-3 py-4 text-left sm:flex-row sm:space-x-5 sm:space-y-0 my-2 bg-slate-50 p-4 rounded-md border">
                    <div className="shrink-0">
                      <img
                        className="h-24 w-24 max-w-full rounded-lg object-cover"
                        src={item.images[0].url}
                        alt=""
                      />
                    </div>
                    <div className="relative flex flex-1 flex-col justify-between">
                      <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                        <div className="pr-8 sm:pr-5">
                          <p className="text-base font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">
                            {item.description}
                          </p>

                          <span className="flex items-center">Color:
                            <button className={`w-6 ml-2  h-6 rounded-full`} style={{ backgroundColor: `${item.color}` }} /></span>
                          Price: ${item.price}
                        </div>
                        <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                          <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                            ${item.totalPrice}
                          </p>
                          <div className="sm:order-1">
                            <div className="mx-auto flex h-8 items-stretch text-gray-600">
                              <button onClick={() => decrementHandler(item)} className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">
                                -
                              </button>
                              <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">
                                {item.qty}
                              </div>
                              <button onClick={() => IncrementHandler(item)} className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                        <button
                          type="button"
                          onClick={() => deleteHandler(item._id)}
                          className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                              className=""
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {/*  */}
          <div className="col-span-2 h-[500px] md:col-span-1">
            <div className="bg-gray-100 p-4">
              <h2 className="text-lg font-bold mb-4">Summary</h2>
              <div className="mt-2 bg-white rounded-lg shadow">
                <div className="flex">
                  <div className="flex-1 py-3 pl-5 overflow-hidden">
                    <svg
                      className="inline align-text-top"
                      width={21}
                      height="20.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#000000"
                    >
                      <g>
                        <path
                          d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z"
                          fill="none"
                          id="svg_1"
                          stroke="null"
                        />
                        <path
                          d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z"
                          id="svg_2"
                        />
                        <circle cx="7.04807" cy="6.97256" r="2.5" id="svg_3" />
                      </g>
                    </svg>
                    <h1 className="inline text-xl font-semibold leading-none">
                      Address
                    </h1>
                  </div>
                  <div className="flex-none pt-2.5 pr-2 pl-1" />
                </div>
                <div className="px-5  pb-5">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className=" text-black placeholder-gray-600 w-full px-4 py-2 mt-1 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                  />
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className=" text-black placeholder-gray-600 w-full px-4 py-2 mt-1 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                  />
                  <div className="flex">
                    <div className="flex-grow w-1/4 pr-2">
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className=" text-black placeholder-gray-600 w-full px-4 py-2 mt-1 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Phone No."
                        className=" text-black placeholder-gray-600 w-full px-4 py-2 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-1" />
                <div className="flex flex-row-reverse p-2">
                  <div className="flex-initial pl-3">
                    <button
                      onClick={createAddressHandler}
                      type="button"
                      className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-gray-800 rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z"
                          opacity=".3"
                        />
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                      </svg>
                      <span className="pl-2 mx-1">Save</span>
                    </button>

                  </div>
                  <button
                    onClick={updateAddressHandler}
                    type="button"
                    className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-gray-800 rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#FFFFFF"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z"
                        opacity=".3"
                      />
                      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                    </svg>
                    <span className="pl-2 mx-1">Update</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between mb-2 mt-2">
                <span className="font-bold">Subtotal:</span>
                <span>${subTotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Shipping Fee:</span>
                <span>$5</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="font-bold">Total:</span>
                <span>${subTotal + 5}</span>
              </div>
              <button
                onClick={createOrderHandler}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Cart;