import { deleteProduct, getAllProducts } from '../api/api';
import { toast } from 'react-toastify';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const { confirm } = Modal;

const index = ({ data }) => {

  const allProducts = data.products;

  const router = useRouter();

  //refresh Page on Delete Product
  const refreshData = () => {
    router.replace(router.asPath);
  }

  // search with multiple
  const [searchQuery, setSearchQuery] = useState('');
  const multipleSearch = allProducts.filter((product) =>
    Object.keys(product).some((parameter) =>
      product[parameter].toString().toLowerCase().includes(searchQuery)
    )
  )


  // pagination
  const [currentPageX, setCurrentPageX] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPageX * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = multipleSearch.slice(firstIndex, lastIndex)
  const npages = Math.ceil(allProducts.length / recordsPerPage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  // for previous pages
  const prePage = () => {
    if (currentPageX !== firstIndex) {
      setCurrentPageX(currentPageX - 1)
    }
  }

  // for next pages
  const nextPage = () => {
    if (currentPageX !== lastIndex) {
      setCurrentPageX(currentPageX + 1)
    }
  }

  // for changed pages
  const changePage = async (id) => {
    setCurrentPageX(id)
  }

  // delete products model
  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure delete this Product?',
      icon: <ExclamationCircleFilled />,
      content: "Are you sure delete this Product",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProductHandler(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // product delete Handler 
  const deleteProductHandler = async (id) => {
    const res = await deleteProduct(id);
    if (res.status === 200) {
      refreshData();  // call refresh function here
      toast.success(res.data.message);
    }
  }

  return (
    <main className='p-4 sm:ml-64'>

      <Head>
        <title>Products</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="author" content="mrzahidfaiz" />
      </Head>

      <section>
        {/* Start coding here */}
        <div className="relative bg-white shadow-sm mb-4 dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <div className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name='search'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              <Link
                href="/products/submit"
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add product
              </Link>
            </div>
          </div>
        </div>

      </section>
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Sold</th>
                <th className="px-4 py-3">Create Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {records.map((product) => {
                const date = product.createdAt;
                const newDate = date.slice(0, 10);
                const time = date.slice(11, 19)
                return (
                  <tr className="text-gray-700 dark:text-gray-400" key={product._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        {/* Avatar with inset shadow */}
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={product.images[0].url}
                            alt={product.title}
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{product.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.price}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm">{product.brand}</td>
                    <td className="px-4 py-3 text-sm">{product.sold}</td>
                    <td className="px-4 py-3 text-sm">{time + " " + newDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={() => router.push(`/products/update/${product._id}`,)}
                          className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => showDeleteConfirm(product._id)}
                          className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
          <span className="flex items-center col-span-3">Showing {currentPageX}-{npages} of {npages}</span>
          <span className="col-span-2" />
          {/* Pagination */}
          <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
              <ul className="inline-flex items-center">
                <li>
                  <button
                    onClick={prePage}
                    className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Previous"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {
                  numbers.map((n, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={() => changePage(n)}
                          className={` ${currentPageX === n ? 'text-white bg-purple-600 border-purple-600 focus:outline-none focus:shadow-outline-purple' : ''} px-3 py-1  transition-colors duration-150  border border-r-0  rounded-md `}>
                          {n}
                        </button>
                      </li>
                    )
                  })
                }

                <li>
                  <button
                    onClick={nextPage}
                    className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Next"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </div>
      </div>
    </main>
  )
}
export default index;



export async function getServerSideProps({ query }) {
  const res = await getAllProducts();
  const product = await res.data;

  return {
    props: {
      data: product
    }
  }
}