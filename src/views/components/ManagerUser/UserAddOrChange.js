import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import { Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UserAddOrChange = () => {
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const { createProduct } = useProduct();
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

    const onFinish = async (values) => {
        try {
            const formData = new FormData()
            formData.append('branchId', values.branchId);
            formData.append('originId', values.originId);
            formData.append('productName', values.productName);
            formData.append('ProdcutPrice', values.productPrice);
            formData.append('ProductQuanlity', values.productQuantity);
            formData.append('productDescription', values.productDescription);
            formData.append('productMaterial', values.productMaterial);
            formData.append('productType', values.productType);
            // fileList.forEach((file, index) => {
            //     formData.append(`ListFileImg`, file.originFileObj);
            // });
            const { success, data } = await createProduct(formData, { "Content-Type": "multipart/form-data" });
            if (data.status != 'Error' && success) {
                setModal2Open(false);
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("loi")
        }
    };

    const [gender, setGender] = useState("");

    // Handle change when a radio button is selected
    const handleGenderChange = (event) => {
      setGender(event.target.value);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const handleChange = (value) => {
        console.log(`Selected: ${value}`);
    };
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
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
            render: (text) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{formatCurrencyVND(text)}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            render: (_, record) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{record.productQuanlity + record.productSold >= 0 ? (record.productQuanlity + record.productSold) : 0}</p>,

        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {/* <Delete id={record.id} state={loading} action={setLoading} /> */}
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
        <div>
            <Button
                type="primary"
                value="large"
                style={{
                    marginTop: "40px",
                    display: "flex",
                    alignItems: "center",
                    background: "#1fbf39",
                    marginBottom: "20px",
                }}
                onClick={() => setModal2Open(true)}
            >
                <PlusSquareOutlined /> Thêm mới
            </Button>

            <Modal
                width={'65%'}
                title="Thêm mới người dùng"
                centered
                visible={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={null}
                style={{
                    content: {
                        width: '60%', // Width of the modal
                        height: '200px', // Set height for modal
                        overflowY: 'auto', // Enable scrolling for content
                        margin: 'auto', // Center the modal
                        padding: '20px', // Padding inside modal
                    },
                }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ layout: "horizontal" }}
                    layout="vertical"
                >


                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Mã người dùng"
                                name="code"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" readOnly={true} disabled={true}/>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Họ tên khách hàng"
                                name="fullName"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại khách hàng"
                                name="phoneNumber"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Username"
                                name="userName"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="password" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name="provinceId"
                                rules={[{ required: true, message: "Please select province" }]}
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
                                label="Quận/Huyện"
                                name="districtId"
                                rules={[{ required: true, message: "Please select district" }]}
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
                                label="Xã/Phường"
                                name="wardId"
                                rules={[{ required: true, message: "Please select wards" }]}
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

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Địa chỉ chi tiết"
                                name="productPrice"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                        <Form.Item
                                label="Quyền"
                                name="roleId"
                                rules={[{ required: true, message: "" }]}
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
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày sinh"
                                name="birthDate"
                            >
                               <DatePicker onChange={null} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                            >
                                <div >
                                    <label style={{paddingRight: '10px'}}>
                                        <input
                                            type="radio"
                                            value="male"
                                            checked={gender === "male"}
                                            onChange={handleGenderChange}
                                            style={{paddingRight: '5px'}}
                                        />
                                        Male
                                    </label>
                                    <label style={{paddingRight: '10px'}}>
                                        <input
                                            type="radio"
                                            value="female"
                                            checked={gender === "female"}
                                            onChange={handleGenderChange}
                                            style={{paddingRight: '5px'}}
                                        />
                                        Female
                                    </label>
                                    <label style={{paddingRight: '10px'}}>
                                        <input
                                            type="radio"
                                            value="other"
                                            checked={gender === "other"}
                                            onChange={handleGenderChange}
                                            style={{paddingRight: '5px'}}
                                        />
                                        Khác
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserAddOrChange;
