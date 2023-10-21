
import { useFormik } from 'formik';
import { getBrand, getCategory, getProduct, updateProduct, getColors } from '@/pages/api/api';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Select, Tag } from 'antd';
import Link from 'next/link';
import Loading from '@/components/Loading';
import Head from 'next/head';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const index = ({ data, data1, data2, data3 }) => {

    const product = data.product;
    const allCategory = data1.category;
    const allBrand = data2.brand;
    const allColors = data3.colors;

    if (!product) {
        return <Loading />
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [colors, setColors] = useState([]);
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");

    const categoryOptions = [];
    const brandOptions = [];
    const colorOptions = [];

    for (let i = 0; i < allColors.length; i++) {
        colorOptions.push({
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

    //  colorSelector is Working Don't tocuh it
    const colorSelecthandler = (value, label) => {
        setColors(label);
    };

    const categorySelectHandler = (value) => {
        setCategory(value);
    };
    const brandSelectHandler = (value) => {
        setBrand(value);
    };

    const { values, handleChange, resetForm } = useFormik({
        initialValues: {
            title: "",
            description: "",
            price: "",
            quantity: "",
            colors: colors,
            images: [],
        }
    })

    const updateHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            id: product._id,
            title: values.title,
            description: values.description,
            category: category,
            brand: brand,
            price: values.price,
            quantity: values.quantity,
            images: fileList,
            colors: colors,
        }
        const res = await updateProduct(data);
        if (res.status === 200) {
            toast.success(res.data.message);
            setLoading(false);
        } else if (res.code === 'ERR_BAD_REQUEST') {
            setLoading(false);
            toast.error(res.response.data.message);
            toast.error(res.response.data.error);
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

    useEffect(() => {
        console.log('product-->>', product);
        if (product) {
            values.title = product.title;
            values.description = product.description;
            values.price = product.price;
            values.quantity = product.quantity;
            values.sold = product.sold;
            setFileList(product.images);
            setColors(product.colors);
            setBrand(product.brand)
            setCategory(product.category);
        }
    }, [])

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
        <section className="bg-white dark:bg-gray-900 p-4 sm:ml-64">

            <Head>
                <title>Update Product</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="author" content="mrzahidfaiz"></meta>
            </Head>
            <div className="px-4 mx-auto max-w-full">
                <h2 className="mb-4 text-center text-xl font-bold dark:text-white bg-slate-800 rounded-xl py-1 shadow-md text-white">
                    UPDATE PRODUCT
                </h2>
                <form onSubmit={updateHandler}>
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
                            <div className="sm:col-span-2">
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
                            <div className='w-full'>
                                <label
                                    htmlFor="category"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Category
                                </label>
                                <Select
                                    onChange={categorySelectHandler}
                                    size="large"
                                    value={category}
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
                            <div className='w-full'>
                                <label
                                    htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Brand
                                </label>
                                <Select
                                    onChange={brandSelectHandler}
                                    showSearch
                                    value={brand}
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
                        <div className='w-full '>
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
                            <div className="w-full">
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

                            <div className='w-full mt-2'>
                                <label
                                    htmlFor="colors"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Colors
                                </label>
                                <Select
                                    id='colors'
                                    mode="multiple"
                                    tagRender={tagRender}
                                    size='large'
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Please select"
                                    value={colors}
                                    onChange={colorSelecthandler}
                                    options={colorOptions}
                                />
                            </div>
                            <div className='w-full mt-2'>
                                <label
                                    htmlFor="images"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    {
                        loading ?
                            <button
                                disabled
                                className="items-center cursor-wait w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-500"
                            >
                                Updating...
                            </button>
                            :
                            <button
                                type="submit"
                                className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            >
                                Update product
                            </button>
                    }
                    <Link href="/products">
                        <div
                            className="items-center w-full px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                        >
                            Close
                        </div>
                    </Link>
                </form>

            </div>
        </section>

    )
}

export default index;

export async function getServerSideProps({ params }) {
    const id = params.productId;
    const res = await getProduct(id);
    const product = await res.data;
    const cateres = await getCategory();
    const category = await cateres.data;
    const brandRes = await getBrand();
    const brand = await brandRes.data;
    const colorRes = await getColors();
    const color = await colorRes.data;
    return {
        props: {
            data: product,
            data1: category,
            data2: brand,
            data3: color,
        }
    }
} 