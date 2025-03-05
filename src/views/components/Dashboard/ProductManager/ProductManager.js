import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table, Tag } from 'antd';
import useProduct from '@api/useProduct';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import Delete from './DeleteProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import { render } from '@testing-library/react';
import AddProduct from './AddProduct';
import { Col, Form, Input, Modal, Row, DatePicker } from "antd";

function ProductManager() {
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    const { getAll } = useProduct()

    const [product, setProduct] = useState([])

    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
        },
    });
    const fetchData = async () => {
        const { success, data } = await getAll(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setProduct(data.data.items)
            setLoading(false);
            setTotal(data.data.totalCount)
        }
    }
    // useEffect(() => {
    //     fetchData()
    // }, [JSON.stringify(tableParams), loading])


    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setProduct([]);
        }
    };
    const onShowSizeChange = (current, pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            render: (text) => <a style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{formatCurrencyVND(text)}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            render: (_, record) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{record.productQuanlity + record.productSold >= 0 ? (record.productQuanlity + record.productSold) : 0}</p>,

        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (_, record) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{record.branchName}</p>
        },
        {
            title: 'Kiểu sản phẩm',
            dataIndex: 'typeName',
            key: 'typeName',
            render: (_, record) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{record.branchName}</p>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{record.productSold}</p>
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: 'soldQuantity',
            key: 'soldQuantity',
            render: (_, record) => <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>{record.productQuanlity}</p>,

        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Delete id={record.id} state={loading} action={setLoading} />
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Product'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                    <Link to={`/dashboard/product/edit/${record.id}`}>
                        <Button title='Edit Product' style={{
                            backgroundColor: 'brown'
                        }}>
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "white" }} />
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Form.Item
                        label="Key search"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, name category" />
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <AddProduct />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
            <Col span={8}>
                    <Form.Item
                        label="Loại sản phẩm"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={origin}
                        />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Gói bán SP"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={origin}
                        />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={origin}
                        />

                    </Form.Item>
                </Col>
            </Row>
            <Table
                dataSource={product} columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination
                showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '24px' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total}
            />
        </>
    );
}
export default ProductManager;