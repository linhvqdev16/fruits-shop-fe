import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Pagination, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import useUser from '@api/useUser';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faCheckDouble } from "@fortawesome/free-solid-svg-icons"

const CustomerPopup = ({ handlePopupSelected, model }) => {

    const [modal2Open, setModal2Open] = useState(false);
    const { getListUser } = useUser();

    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '', 
            roleId: 5, 
            status: null
        },
    });

    const fetchData = async () => {
        const { success, data } = await getListUser(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setUser(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    };

    const showModel = () => {
        setModal2Open(true);
        fetchData();
    }

    const onFinish = () => {
        setModal2Open(false);
    }

    useEffect(() => {
        if (modal2Open) {
            fetchData();
        }
    }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setUser([]);
        }
    };

    const handleChangeKeySearch = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                pageIndex: 1,
                pageSize: 5,
                keySearch: e.target.value
            }
        }));
        setUser([]);
    }
    const handleSeletecCoupon = (model) => {
        debugger;
        handlePopupSelected(model); 
        setModal2Open(false);
    }

    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }


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
            title: 'Mã khách hàng',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Sinh nhật',
            dataIndex: 'dateBirth',
            key: 'dateBirth',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{format(record.dateBirth, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                     <Button onClick={(e) => handleSeletecCoupon(record)} type='primary' title='Select'>
                             <FontAwesomeIcon icon={faCheckDouble} />
                        </Button>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Button
                type="button"
                value="small"
                style={{
                    alignItems: "center",
                    background: "#2596be",
                    marginBottom: "20px",
                    color: 'white'
                }}
                onClick={() => showModel()}
            >
                Chọn khách hàng
            </Button>

            <Modal
                width={'60%'}
                title="Khách hàng"
                centered
                visible={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={null}
            >
                <br />
                <Row gutter={[5, 5]}>
                    <Col span={18}>
                        <Form.Item
                            name="searchProduct"
                            rules={[{ required: false, message: "" }]}>
                            <Input placeholder="Enter code, name to search" onChange={handleChangeKeySearch} />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Button
                            type="button"
                            value="small"
                            style={{
                                alignItems: "center",
                                background: "#2596be",
                                marginBottom: "20px",
                                color: "white"
                            }}
                            onClick={() => onFinish()}
                        >
                            Chọn khách hàng
                        </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={user} columns={columns}
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
            </Modal>
        </div>
    );
};

export default CustomerPopup;
