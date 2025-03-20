import { Link } from "react-router-dom"
import DetailOrder from "./DetailOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import useOrder from '@api/useOrder';
import usePayment from '@api/usePayment';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Table, Space, Button } from 'antd';
import { Col, Form, Input, Modal, Row, Select, DatePicker, AutoComplete } from "antd";
import useUser from "@api/useUser";
import { Option } from "antd/es/mentions";

import OrderAddOrChange from './OrderAddOrChange';

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function OrderManager() {

    const { RangePicker } = DatePicker;

    const [dates, setDates] = useState([]);
    const { getListOrder } = useOrder();
    const { getListUser } = useUser();
    const [orders, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const { getListPayment } = usePayment();
    const [payments, setPayments] = useState([]);
    const [tableEmployeeParams, setTableEmployeeParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            roleId: 6,
            status: null
        }
    });
    const [tableUserParams, setTableUserParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            roleId: 5,
            status: null
        }
    });
    const [queryUser, setQueryUser] = useState("");
    const [user, setUsers] = useState([]);
    const [optionUser, setOptionsUser] = useState([]);

    const [queryEmployee, setQueryEmployee] = useState("");
    const [employee, setEmployee] = useState([]);
    const [optionEmployee, setOptionsEmployee] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            paymentId: null,
            userId: null,
            employeeId: null,
            status: null,
            type: null,
            startPrice: null,
            endPrice: null,
            startDate: null,
            endDate: null
        }
    });
    const fetchPayment = async () => {
        const { success, data } = await getListPayment(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            const result = data.data.map((e) => {
                return {
                    value: e.id,
                    label: e.name
                }
            });
            setPayments(result);
        }
    }
    const handleDateChange = (value) => {
        setDates(value); // value is an array of two moment objects (startDate, endDate)
    };

    const fetchData = async () => {
        const { success, data } = await getListOrder(tableParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setOrder(data.data);
            setLoading(false);
            setTotal(data.totalCount);
        } else {
            toast.error(data.message)
        }
    }
    useEffect(() => {
        if (tableEmployeeParams.pagination && tableEmployeeParams.pagination.keySearch.length > 0) {
            fetchEmployee();
        }
        if (tableUserParams.pagination && tableUserParams.pagination.keySearch.length > 0) {
            fetchUser();
        }
        fetchData();
        fetchPayment();
    }, [JSON.stringify(tableParams), JSON.stringify(tableEmployeeParams), JSON.stringify(tableUserParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setOrder([]);
        }
    }

    const onShowSizeChange = (current, pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    }

    const handleSetStartDate = date => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                startDate: date && date.toISOString().split("T")[0]
            }
        }))
    }

    const handleSetEndDate = date => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                endDate: date && date.toISOString().split("T")[0]
            }
        }))
    }

    const handleChangeStatusSelect = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                status: e
            }
        }))
    }


    const onSearchByKey = (e) => {
        debugger;
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e.target.value
            }
        }))
    }

    const onSearchMinValue = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                startPrice: e.target.value
            }
        }))
    }

    const handleSelectPayment = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                paymentId: e
            }
        }))
    }


    const handleSelectStatus = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                status: e
            }
        }))
    }

    const onSearchMaxValue = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                endPrice: e.target.value
            }
        }))
    }

    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</p>)
            }
        },
        {
            title: 'Mã đơn hàng',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.orderCode}`}</p>)
            }
        },
        {
            title: 'Ngày tạo',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.orderDate}`}</p>)
            }
        },
        {
            title: 'Tên khách hàng',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.customerName}`}</p>)
            }
        },
        {
            title: 'Số điện thoại',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.phoneNumber}`}</p>)
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'addressDetail',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.addressDetail}</p>
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.employeeName}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (_, record) => {
                if (record.orderStatus === 1) {
                    return <p style={{ fontSize: "13px", color: "red", fontWeight: "300" }}>Chờ xác nhận</p>;
                }
                if (record.orderStatus === 2) {
                    return <p style={{ fontSize: "13px", color: "yellow", fontWeight: "300" }}>Xác nhận</p>;
                }
                if (record.orderStatus === 3) {
                    return <p style={{ fontSize: "13px", color: "blueviolet", fontWeight: "300" }}>Đang vận chuyển</p>;
                }
                if (record.orderStatus === 4) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Đã giao hàng</p>;
                }
                if (record.orderStatus === 5) {
                    return <p style={{ fontSize: "13px", color: "green", fontWeight: "300" }}>Hoàn thành</p>;
                }
                if (record.orderStatus === 0) {
                    return <p style={{ fontSize: "13px", color: "green", fontWeight: "300" }}>Hủy đơn</p>;
                }
            }
        },
        {
            title: 'Giá trị',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(data.totalPrice)}</p>)
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/dashboard/order-detail/${record.orderId}`}>
                        <Button type='primary' title='Detail Order'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>

                </Space>
            ),
        },

    ];


    const onSearchByKeyUser = (e) => {
        setTableUserParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e
            }
        }))
    };
    const onSearchByKeyEmployee = (e) => {
        setTableEmployeeParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e
            }
        }))
    };
    const handleSelectUser = (value, option, index) => {
        setQueryUser(option.fullName);
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                userId: value
            }
        }));
    };

    const handleSelectEmployee = (value, option, index) => {
        debugger;
        setQueryEmployee(option.fullName);
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                employeeId: value
            }
        }));
    };

    const fetchUser = async () => {
        const { success, data } = await getListUser(tableUserParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setUsers(data.data);
            setLoading(false)
            toast.success(data.message);
            const model = data.data.map((e) => {
                return {
                    value: e.id,
                    label: e.code + " - " + e.phoneNumber + " - " + e.fullName,
                    key: e.id,
                    fullName: e.fullName
                }
            });
            setOptionsUser(model);
        } else {
            toast.error(data.message)
        }
    }

    const fetchEmployee = async () => {
        const { success, data } = await getListUser(tableEmployeeParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setEmployee(data.data);
            setLoading(false)
            toast.success(data.message);
            const model = data.data.map((e) => {
                return {
                    value: e.id,
                    label: e.code + " - " + e.phoneNumber + " - " + e.fullName,
                    key: e.id,
                    fullName: e.fullName
                }
            });
            setOptionsEmployee(model);
        } else {
            toast.error(data.message)
        }
    }
    return (
        <>
            <Row gutter={[16, 16]}>
                {/* <Col span={16}>
                    <Form.Item
                        label="Key search"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, name order..." onChange={onSearchByKey} />
                    </Form.Item>
                </Col> */}
                {/* <Col span={8} style={{textAlign: 'right'}}>
                    <OrderAddOrChange />
                </Col> */}
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Form.Item
                        label="Khách hàng"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}>

                        <AutoComplete
                            options={optionUser}
                            onSearch={onSearchByKeyUser}
                            onSelect={handleSelectUser}
                            value={queryUser}
                            onChange={setQueryUser}
                            style={{ width: '100%' }}
                        >
                            <Input placeholder="Enter code, phone number, name customer..." />
                        </AutoComplete>

                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item
                        label="Nhân viên"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                             <AutoComplete
                            options={optionEmployee}
                            onSearch={onSearchByKeyEmployee}
                            onSelect={handleSelectEmployee}
                            value={queryEmployee}
                            onChange={setQueryEmployee}
                            style={{ width: '100%' }}
                        >
                            <Input placeholder="Enter code, phone number, name customer..." />
                        </AutoComplete>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Thanh toán"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={handleSelectPayment}
                            style={{
                                width: '100%',
                            }}
                            options={payments}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Trạng thái"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={handleChangeStatusSelect}
                            style={{
                                width: '100%',
                            }}
                            >
                            <Option value={0}>Tất cả</Option>
                            <Option value={1}>Đã hủy</Option>
                            <Option value={2}>Chờ xác nhận</Option>
                            <Option value={3}>Xác nhận</Option>
                            <Option value={4}>Chờ vận chuyển</Option>
                            <Option value={5}>Đang vận chuyển</Option>
                            <Option value={6}>Đã giao hàng</Option>
                            <Option value={7}>Đã thanh toán</Option>
                            <Option value={7}>Hoàn thành</Option>
                        </Select>

                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        label="Giá trị đơn hàng"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Input placeholder="Enter start price" type="number" onChange={onSearchMinValue} /></Col>
                            <Col span={12}>
                                <Input placeholder="Enter end price" type="number" onChange={onSearchMaxValue} /></Col>

                        </Row>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Start date"
                        name="minValue"
                    >
                        <DatePicker onChange={handleSetStartDate} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="End date"
                        name="minValue"
                    >
                        <DatePicker onChange={handleSetEndDate} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Table
                dataSource={orders}
                columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total} />
        </>
    )
}

export default OrderManager