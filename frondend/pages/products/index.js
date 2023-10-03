import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '../api/api';
import { ADD_TO_CART } from '@/store/cartSlice';
import { useDispatch } from 'react-redux';

const index = ({ data }) => {

  const products = data.products;
  const dispatch = useDispatch();

  const addToCartHandler = (item) => {
    dispatch(ADD_TO_CART(item));
  }

  return (
    <section className="bg-white py-12 text-gray-700 sm:py-16 lg:py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            All Products
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-6">
          {
            products?.map((product) => {
              return (
                <div key={product._id} className="group my-10 flex w-full max-w-xs flex-col overflow-hidden duration-200 hover:-translate-y-4 rounded-lg border border-gray-100 bg-white shadow-md">
                  <Link
                    className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                    href={`/products/${product._id}`}
                  >
                    <img
                      className="peer absolute top-0 right-0 h-full w-full object-cover"
                      src={product.images[0].url}
                      alt="product image"
                    />
                    <img
                      className="peer absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
                      src={product.images[0].url}
                      alt="product image"
                    />
                    {/* <div class="absolute  bottom-0 mb-4 flex space-x-4 w-full justify-center">
          <div class="rounded-full h-3 w-3 bg-gray-200 border-2 border-white"></div>
          <div class="rounded-full h-3 w-3 bg-gray-200 border-2 border-white"></div>
          <div class="rounded-full h-3 w-3 bg-gray-200 border-2 border-white"></div>
        </div> */}
                    <svg
                      className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-white  transition-opacity group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
                      />
                    </svg>
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">{product.discountPercentage}% OFF</span>
                  </Link>
                  <div className="mt-4 px-5 pb-5">
                    <Link href={`/products/${product._id}`}>
                      <h5 className="text-xl tracking-tight text-slate-900 hover:text-black">
                        {product.title}
                      </h5>

                      <div className="mt-2 mb-5 flex items-center justify-between">
                        <p>
                          <span className="text-3xl font-bold text-slate-900">{product.price}</span>
                          <span className="text-sm text-slate-900 line-through">{product.price}</span>
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => addToCartHandler(product)}
                      className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to cart
                    </button>
                  </div>
                </div>
              )
            })
          }

        </div>
      </div>
    </section>

  )
}

export default index;


export async function getServerSideProps() {
  const response = await getAllProducts();

  const products = await response.data;

  return {
    props: {
      data: products
    }
  }
}