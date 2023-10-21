import React, { useState } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { getProductById } from '../api/api';
import { ADD_TO_CART } from '@/store/cartSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Select } from 'antd';
import { useRouter } from 'next/router';


const index = ({ product }) => {

  const { images, colors } = product;
  const [color, setColor] = useState(colors[0].value);

  const dispatch = useDispatch();
  const router = useRouter();
  const addToCartHandler = async (item) => {

    const itemx = {
      _id: item._id,
      title: item.title,
      description: item.description,
      images: item.images,
      price: item.price,
      sold: item.sold,
      quantity: item.quantity,
      color: color,
    }
    dispatch(ADD_TO_CART(itemx));
    toast.success('Product added successfully');
  }
  const buyNowHandler = async (item) => {

    const itemx = {
      _id: item._id,
      title: item.title,
      description: item.description,
      images: item.images,
      price: item.price,
      sold: item.sold,
      quantity: item.quantity,
      color: color,
    }
    dispatch(ADD_TO_CART(itemx));
    router.push('/cart')
    toast.success('Product added successfully');
  }

  // send Color on Cart
  const handleChange = (value) => {
    setColor(value)
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-14">
        {/* item Image */}
        <div className='w-[60%] mx-auto p-4'>
          <Carousel>
            {images.map((image, index) => (
              <div key={index}>
                <img src={image.url} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Carousel></div>

        {/* item Details */}
        <div className='w-[60] p-4 flex flex-col gap-4'>
          <h2 className="text-lg font-bold">{product.brand}</h2>
          {/* Rating and Review */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Rating:</span>
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0l2.5 6.5h6.5l-5 4.1 1.9 6.4L10 14.9l-5.9 4.1 1.9-6.4-5-4.1h6.5L10 0zm0 2.4L7.1 7.1H1.6l5 4.1-1.9 6.4L10 15.8l4.3 2.9-1.9-6.4 5-4.1h-5.5L10 2.4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-800">4.5</span>
            </div>
            <span className="text-gray-600">Reviews:</span>
            <span className="text-gray-800">25</span>
          </div>
          <h3 className="text-2xl font-semibold">{product.title}</h3>
          <p className="text-gray-600">{product.description}</p>
          {/* Colors */}
          <div className="flex flex-row gap-1">
            <label className="font-bold text-gray-700">
              Select Color:
            </label>
            {
              colors.map((clr, i) => {
                return <button className={`w-6  h-6 rounded-full`} style={{ backgroundColor: `${clr.value}` }} key={i} />
              })
            }
          </div>
          {/* price */}
          <div className="flex items-center space-x-2 mt-2">

            <label htmlFor="price" className="font-bold text-gray-700">
              Price:
            </label>
            <span id='price' className="text-gray-800">{product.price}</span>
          </div>
          {/* Sizes */}
          <div className="flex items-center space-x-2 mt-2">

            <label htmlFor="size" className="font-bold text-gray-700">
              Select Color:
            </label>
            <Select
              defaultValue={colors[0].value}
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={colors}
            />
          </div>
          <div >
            {/* Add more sizes as needed */}
          </div>
          {/* Buttons */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => addToCartHandler(product)}
              className="px-4 py-2 bg-blue-500 text-white rounded">
              Add to Cart
            </button>
            <button
              onClick={() => buyNowHandler(product)}
              className="px-4 py-2 bg-green-500 text-white rounded">
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </>

  )
}

export default index

export async function getServerSideProps({ params }) {
  const response = await getProductById(params.productId) || [];
  const product = await response.data.product;
  return {
    props: {
      product: product,
    },
  };
}