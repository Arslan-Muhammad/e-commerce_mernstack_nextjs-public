
import { useFormik } from 'formik';
import { createProduct, getBrand, getCategory, getColors } from '@/pages/api/api';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Select, Tag } from 'antd';

import Link from 'next/link';
import Head from 'next/head';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });



const index = ({ data, data1, data2 }) => {

    const allColors = data.colors;
    const allCategory = data1.category;
    const allBrand = data2.brand;

    const options = [];
    const categoryOptions = [];
    const brandOptions = [];

    // colors 
    for (let i = 0; i < allColors.length; i++) {
        options.push({
            label: allColors[i].label,
            value: allColors[i].value,
        });
    }

    // categories
    for (let i = 0; i < allCategory.length; i++) {
        categoryOptions.push({
            label: allCategory[i].title,
            value: allCategory[i].title,
        });
    }

    // Brand options
    for (let i = 0; i < allBrand.length; i++) {
        brandOptions.push({
            label: allBrand[i].title,
            value: allBrand[i].title,
        });
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [colors, setColors] = useState(['red']);
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");


    const { values, handleChange, resetForm } = useFormik({
        initialValues: {
            title: "",
            description: "",
            price: "",
            quantity: "",
            images: [],
        }
    })

    const colorSelectHandler = (value) => {
        setColors(value);
    };

    const categorySelectHandler = (value) => {
        setCategory(value);
    };
    const brandSelectHandler = (value) => {
        setBrand(value);
    };

    const submitProductHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            title: values.title,
            description: values.description,
            category: category,
            brand: brand,
            price: values.price,
            colors: colors,
            quantity: values.quantity,
            images: fileList,
        }
        const res = await createProduct(data);
        if (res.status === 200) {
            toast.success(res.data.message);
            setLoading(false);
        } else if (res.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(res.response.data.message);
            toast.error(res.response.data.error);
        }
        else if (res.code === "ERR_BAD_RESPONSE") {
            setLoading(false);
            toast.error(res.response.data.message);
        }
    }

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const changeHandler = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    // change color with options
    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={value}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    marginRight: 3,
                }}
            >
                {label}
            </Tag>
        );
    };

    return (
        <section className="bg-white dark:bg-gray-900 sm:ml-64">
            
            <Head>
                <title>Create Product</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="author" content="mrzahidfaiz"></meta>
            </Head>
            <div className="px-4 mx-auto max-w-full">
                <h2 className="mb-4 text-center text-xl font-bold dark:text-white bg-slate-800 rounded-xl py-1 shadow-md text-white">
                    ADD PRODUCT
                </h2>
                <form onSubmit={submitProductHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className='w-full'>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    id="title"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Type product title"
                                />
                            </div>
                            <div className="sm:col-span-2 mt-1">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Your description here"
                                />
                            </div>
                            <div className='w-full m-1'>
                                <label
                                    htmlFor="category"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Category
                                </label>
                                <Select
                                    onChange={categorySelectHandler}
                                    size="large"
                                    showSearch
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={categoryOptions}
                                />
                            </div>
                            <div className='w-full mt-1'>
                                <label
                                    htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Brand
                                </label>
                                <Select
                                    onChange={brandSelectHandler}
                                    showSearch
                                    size='large'
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={brandOptions}
                                />
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className="w-full">
                                <label
                                    htmlFor="price"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    id="price"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Total Price"
                                />
                            </div>
                            <div className="w-full mt-1">
                                <label
                                    htmlFor="quantity"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={values.quantity}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Total Quantity"
                                />
                            </div>
                            <div className='w-full mt-1'>
                                <label
                                    htmlFor="quantity"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Colors
                                </label>
                                <Select
                                    mode="multiple"
                                    tagRender={tagRender}
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    size='large'
                                    placeholder="Please select Colors..."
                                    onChange={colorSelectHandler}
                                    options={options}
                                />
                            </div>
                            <div className='w-full mt-1'>
                                <label
                                    htmlFor="images"
                                    className="block mb-2  text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Images
                                </label>
                                {/* iamsdhaud */}
                                <Upload
                                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={changeHandler}
                                >
                                    {fileList.length >= 5 ? null : uploadButton}
                                </Upload>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>

                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            loading ?
                                <button
                                    disabled
                                    className="items-center w-full cursor-wait px-5 py-2.5 mt-2 sm:mt-4 text-sm font-medium text-center text-white bg-primary-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-500"
                                >
                                    Adding...
                                </button>
                                :
                                <button
                                    type="submit"
                                    className="items-center w-full px-5 py-2.5 mt-2 sm:mt-4 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                                >
                                    Add product
                                </button>
                        }
                        <Link href="/products">
                            <div
                                className="items-center w-full px-5 py-2.5 mt-2 sm:mt-4 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                            >
                                Close
                            </div>
                        </Link>
                    </div>
                </form>
                {/* <div>
                    <button
                        onClick={resetForm}
                        className="items-center w-[50%] px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Reset
                    </button>
                    <Link href="/products">
                        <div
                            className="items-center w-[50%] px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            Close
                        </div>
                    </Link>
                </div> */}

            </div>
        </section>

    )
}

export default index

export async function getServerSideProps() {

    const res = await getColors();
    const colors = await res.data;
    const cateres = await getCategory();
    const category = await cateres.data;
    const brandRes = await getBrand();
    const brand = await brandRes.data;
    return {
        props: {
            data: colors,
            data1: category,
            data2: brand
        },
    }
}