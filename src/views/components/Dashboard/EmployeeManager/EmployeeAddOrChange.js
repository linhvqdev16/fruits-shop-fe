import { PlusSquareOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Image, Upload, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const EmployeeAddOrChange = () => {
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const { createProduct } = useProduct();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleRemove = () => {
        console.log('delete');
    };
    const onFinish = async (values) => {
        try {
            const formData = new FormData()
            formData.append('branchId', values.branchId);
            formData.append('originId', values.originId);
            formData.append('productName', values.productName);
            formData.append('ProdcutPrice', values.productPrice);
            formData.append('ProductQuanlity', values.productQuantity);
            formData.append('productDescription', values.productDescription);
            formData.append('product`Ma`terial', values.productMaterial);
            formData.append('productType', values.productType);
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

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const handleChange = (value) => {
        console.log(`Selected: ${value}`);
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    const [fileList, setFileList] = useState([]);
    const [fileListUpload, setfileListUpload] = useState([]);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChangeFile = ({ fileList: newFileList }) => {
        newFileList.forEach(items => items.status = 'done')
        setFileList(newFileList);
    };
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
                title="Thêm mới nhân viên"
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

                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span>
                        </Col>
                    </Row>
                    <br />

                    <Row gutter={[16, 16]}>
                        <Col span={12} style={{ textAlign: 'center' }}>
                            <Form.Item
                                name="listFileImg"
                                getValueFromEvent={e => {
                                    if (Array.isArray(e)) {
                                        var elist = [];
                                        console.log(e.fileList);
                                        e.fileList.forEach(element => {
                                            elist.push(element.originFileObj)
                                        })
                                    }
                                    return elist
                                }}
                            >
                                <Upload
                                    listType="picture-card"
                                    name="listFileImg"
                                    fileList={fileList}
                                    onRemove={() => {
                                        handleRemove();
                                    }}
                                    onPreview={handlePreview}
                                    onChange={handleChangeFile}
                                > {fileList.length > 1 ? null : uploadButton}</Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{
                                            display: 'none',
                                        }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mã người dùng"
                                name="code"
                                rules={[{ required: true, message: "" }]}
                            >
                                <Input placeholder="" type="text" readOnly={true} disabled={true} />
                            </Form.Item>

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
                                label="Ngày sinh"
                                name="birthDate"
                            >
                                <DatePicker onChange={null} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                rules={[{ required: true }]}
                            >
                                <div >
                                    <label style={{ paddingRight: '40px' }}>
                                        <input
                                            type="radio"
                                            value="male"
                                            checked={gender === "male"}
                                            onChange={handleGenderChange}
                                            style={{ paddingRight: '15px' }}
                                        />
                                        Male
                                    </label>
                                    <label style={{ paddingRight: '40px' }}>
                                        <input
                                            type="radio"
                                            value="female"
                                            checked={gender === "female"}
                                            onChange={handleGenderChange}
                                            style={{ paddingRight: '15px' }}
                                        />
                                        Female
                                    </label>
                                    <label style={{ paddingRight: '40px' }}>
                                        <input
                                            type="radio"
                                            value="other"
                                            checked={gender === "other"}
                                            onChange={handleGenderChange}
                                            style={{ paddingRight: '15px' }}
                                        />
                                        Khác
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin địa chỉ</span>
                        </Col>
                    </Row>
                    <br />

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

export default EmployeeAddOrChange;
