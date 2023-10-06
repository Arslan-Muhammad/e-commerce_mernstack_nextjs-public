import { Carousel } from 'antd';
import React from 'react';
import { ADD_TO_CART } from '@/store/cartSlice';
import { useDispatch } from 'react-redux';
import { BiHeart, BiCart } from "react-icons/bi"
import { getAllProducts } from './api/api';
import { AiOutlineArrowRight } from 'react-icons/ai'
import Link from 'next/link';

const contentStyle = {
  height: '520px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  width: '100%',
  background: '#364d79',
};

export default function Home({ data }) {


  const { products } = data;
  const dispatch = useDispatch();

  const addToCartHandler = (item) => {
    dispatch(ADD_TO_CART(item));
  }
  return (
    <main>
      <div className="grid grid-cols-6 grid-rows-4 gap-2 mx-16 my-2">
        <div className="col-span-4 row-span-4 rounded-md">
          <Carousel autoplay>
            <div>
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60" alt="slide1" className='rounded-md' style={contentStyle} />
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="slide2" className='rounded-md' style={contentStyle} />
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="slide2" className='rounded-md' style={contentStyle} />
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="slide2" className='rounded-md' style={contentStyle} />
            </div>
          </Carousel>
        </div>
        <div className="col-span-2 row-span-2 col-start-5">
          <img
            src="https://tecdn.b-cdn.net/img/new/standard/city/041.webp"
            class="h-auto max-w-sm rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30"
            alt="" />
        </div>
        <div className="col-span-2 row-span-2 col-start-5 row-start-3">
          <img
            src="https://tecdn.b-cdn.net/img/new/standard/city/041.webp"
            class="h-auto max-w-sm rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30"
            alt="" />
        </div>
      </div>
      <section className="bg-white py-12 text-gray-700 sm:py-16 lg:py-10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className='w-full py-2 border rounded-md flex flex-row justify-between'>
            <div className='font-serif text-2xl font-bold ml-4'>
             FLASH SALE
            </div>
            <div>
              <Link href="/products" className='font-serif text-xl mr-4 flex text-center items-center hover:text-lime-500' >
                SHOP MORE <AiOutlineArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-6 md:gap-1 lg:mt-6">
            {
              products?.map((product) => {
                return (
                  <article className="relative rounded-md bg-white p-3 border hover:shadow-xl" key={product._id}>
                    <div className="absolute top-3 right-3 z-10">
                    </div>
                    <a href="#">
                      <div className="relative flex items-end overflow-hidden rounded-md">
                        <img src={product.images[0].url} alt="pic" />
                        <div className="absolute top-2 right-2 inline-flex items-center rounded-md bg-white p-1 shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-slate-400 ml-1 text-sm">4.9</span>
                        </div>
                      </div>
                      <div className="mt-1 p-2">
                        <h2 className="text-slate-700 truncate">{product.title}</h2>
                        <p className="text-slate-400 mt-1 text-sm">{product.brand}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p>
                            <span className="text-lg font-bold text-blue-500">${product.price}</span>
                          </p>
                          <div className="group inline-flex rounded-md bg-blue-100 p-2 gap-3 ">
                            <button className='hover:bg-lime-500 rounded-md shadow-sm'><BiHeart size={20} /> </button>
                            <div className="h-[20px]  bg-lime-300 w-[2px]"></div>
                            <button onClick={() => addToCartHandler(product)} className='hover:bg-lime-500 rounded-md shadow-sm' ><BiCart size={20} /></button>
                          </div>
                        </div>
                      </div>
                    </a>
                  </article>
                )
              })
            }

          </div>
        </div>
      </section>
      <section className="bg-white py-12 text-gray-700 sm:py-16 lg:py-10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className='w-full py-2 border rounded-md flex flex-row justify-between'>
            <div className='font-serif text-2xl font-bold ml-4'>
              JUST FOR YOU
            </div>
            <div>
              <Link href="/products" className='font-serif text-xl mr-4 flex text-center items-center hover:text-lime-500' >
               SHOP MORE <AiOutlineArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-6 md:gap-1 lg:mt-6">
            {
              products?.map((product) => {
                return (
                  <article className="relative rounded-md bg-white p-3 border hover:shadow-xl" key={product._id}>
                    <div className="absolute top-3 right-3 z-10">
                    </div>
                    <a href="#">
                      <div className="relative flex items-end overflow-hidden rounded-md">
                        <img src={product.images[0].url} alt="pic" />
                        <div className="absolute top-2 right-2 inline-flex items-center rounded-md bg-white p-1 shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-slate-400 ml-1 text-sm">4.9</span>
                        </div>
                      </div>
                      <div className="mt-1 p-2">
                        <h2 className="text-slate-700 truncate">{product.title}</h2>
                        <p className="text-slate-400 mt-1 text-sm">{product.brand}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p>
                            <span className="text-lg font-bold text-blue-500">${product.price}</span>
                          </p>
                          <div className="group inline-flex rounded-md bg-blue-100 p-2 gap-3 ">
                            <button className='hover:bg-lime-500 rounded-md shadow-sm'><BiHeart size={20} /> </button>
                            <div className="h-[20px]  bg-lime-300 w-[2px]"></div>
                            <button onClick={() => addToCartHandler(product)} className='hover:bg-lime-500 rounded-md shadow-sm' ><BiCart size={20} /></button>
                          </div>
                        </div>
                      </div>
                    </a>
                  </article>
                )
              })
            }

          </div>
        </div>
      </section>
    </main>
  )
}

export async function getServerSideProps() {
  const response = await getAllProducts();

  const products = await response.data;

  return {
    props: {
      data: products
    }
  }
}