import React, { useEffect, useState } from 'react';
import { Button, Select, Dropdown, Table, Menu, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import DiscountAddOrChange from './DiscountAddOrChange';
import { Col, Form, Input, Row } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import useDiscount from '../../../../api/useDiscount';
import { format } from 'date-fns';
function DiscountManager() {
    const { getListDiscount } = useDiscount();
    const [coupon, setCoupon] = useState([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const { RangePicker } = DatePicker;
    const [dates, setDates] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            startDate: null,
            endDate: null,
            minValue: null,
            maxValue: null,
            keySearch: null,
            status: 1
        },
    });
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const fetchData = async () => {
        const { success, data } = await getListDiscount(tableParams.pagination);
        if (!success || data.status === 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setCoupon(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    };

    const handleSetEndDate = date => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                endDate: date &&  date.toISOString().split("T")[0]
            }
        }))
    }

    const handleSetStartDate = date => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                startDate: date &&  date.toISOString().split("T")[0]
            }
        }))
    }

    const handleChangeStatus = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                status: e
            }
        }))
    }


    const onSearchByKey = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e.target.value
            }
        }))
    }


    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), loading])
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setCoupon([]);
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
    const menu = (record) => (
        <Menu>
            <Menu.Item>
                <DiscountAddOrChange fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
            </Menu.Item>
            <Menu.Item>
                <Button
                    type="button"
                    value="small"
                    onClick={null}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu >
    );
    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            render: (_, __, index) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</a>,
        },
        {
            title: 'Tên chương trình khuyến mại',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Kiểu khuyến mại',
            dataIndex: 'type',
            render: (value) => {
                if (value === 1) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Chiết khấu phần trăm sản phẩm </p>
                } else {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Chiết khấu giá trị sản phẩm </p>
                }
            }
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{format(record.startDate, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'dateEnd',
            key: 'dateEnd',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{format(record.endDate, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value === 1) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Hoạt động</p>
                } else {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Không hoạt động</p>
                }
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Dropdown overlay={menu(record)} trigger={['click']}>
                    <Button>
                        Actions <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"><Input placeholder="" onChange={onSearchByKey}/>
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <DiscountAddOrChange fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item
                        label="Start date"
                        name="minValue"
                    >
                        <DatePicker onChange={handleSetStartDate} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="End date"
                        name="minValue"
                    >
                        <DatePicker onChange={handleSetEndDate}  style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={handleChangeStatus}
                            style={{
                                width: '100%',
                            }}
                        >
                            <Option value={1}>Hoạt động</Option>
                            <Option value={0}>Không hoạt động</Option>
                        </Select>

                    </Form.Item>
                </Col>
            </Row>
            <Table
                dataSource={coupon} columns={columns}
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
export default DiscountManager;