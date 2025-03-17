import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Checkbox, Table } from "antd";
import React, { useEffect, useState } from "react";
import usePayment from '@api/usePayment';
import { toast } from 'react-toastify';

const PaymentPage = ({ userInfo, producs, callback }) => {

    const [modal2Open, setModal2Open] = useState(false);
    const [payments, setPayments] = useState([]);
    const { getListPayment } = usePayment();
    const [form] = Form.useForm();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: ''
        },
    });

    const showModel = () => {
        setModal2Open(true);
        fetchPayment();
        form.setFieldsValue({ name: userInfo.fullName, phone: userInfo.phoneNumber, address: userInfo.address && userInfo.address[0].fullInfo });
    }


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
            setPayments(result)
        }
    }

    const onFinish = () => {
        setModal2Open(false);
    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'code',
            key: 'images',
            render: (_, record) => <img src={record.image} style={{ width: "65px", height: "auto", borderRadius: "10px" }} />,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(text)}</p>,
        },
        {
            title: 'Giá khuyến mại',
            dataIndex: 'priceDiscount',
            render: (text) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(text)}</p>,
        },
    ];
    return (
        <div>
            <Button
                type="button"
                value="small"
                style={{
                    alignItems: "center",
                    background: "#1fbf39",
                    marginBottom: "20px",
                    color: 'white'
                }}
                onClick={() => showModel()}
            >
                <PlusSquareOutlined /> Thanh toán
            </Button>

            <Modal
                width={'60%'}
                title="Thanh toán"
                centered
                visible={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ layout: "horizontal" }}
                    layout="vertical"
                >


                    <Row gutter={[5, 5]}>
                        <Col span={16}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span>
                        </Col>
                    </Row>
                    <br />

                    <Row gutter={[12, 12]}>
                        <Col span={12}>
                            <Form.Item
                                label="Họ tên khách hàng"
                                name="name"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mã khuyến mại"
                                name="couponCode"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Hình thức thanh toán"
                                name="paymentId"
                            >
                                <Select
                                    placeholder="Please select"
                                    onChange={null}
                                    style={{
                                        width: '100%',
                                    }}
                                    options={payments}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Hình thức vận chuyện"
                                name="deliveryId"
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


                    <br />
                    <Row gutter={[5, 5]}>
                        <Col span={16}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin sản phẩm</span>
                        </Col>
                    </Row>

                    <Table
                        dataSource={producs} columns={columns}
                        pagination={false}
                        // loading={loading}
                        onChange={null}
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default PaymentPage;
