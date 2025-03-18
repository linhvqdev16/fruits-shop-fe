import { PlusSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, AutoComplete } from "antd";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import useUser from "@api/useUser";
import { EyeClosed, Trash2, CircleX, Eye } from "lucide-react";
import ProductPopUp from "./ProductPopUp";
import VoucherPopup from "./VoucherPopup";
import PaymentType from "./PaymentType";
import usePayment from '@api/usePayment';
import useDelivery from '@api/useDelivery';
import useCoupon from "@api/useCoupons";
import CustomerPopup from "./CustomerPopup";
import { Option } from "antd/es/mentions";
import useAddress from "@api/useAddress";
import useOrder from '@api/useOrder';
import { useParams } from 'react-router-dom';
const Tab = ({ label, activeTab, setActiveTab, closeTab }) => {
    return (
      <></>
    );
};


const OrderDetail = () => {
    const [form] = Form.useForm();
    const { createProduct } = useProduct();
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([{ id: 'Đơn hàng 1', active: true, user: null, products: [] }]);
    const [activeTab, setActiveTab] = useState('Đơn hàng 1');
    const [query, setQuery] = useState("");
    const [user, setUsers] = useState([]);
    const [option, setOptions] = useState([]);
    const { getListUser } = useUser();
    const [payments, setPayments] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [optionDelivery, setOptionDelivery] = useState([]);
    const { getListPayment } = usePayment();
    const { getListDelivery } = useDelivery();
    const { getCouponCode } = useCoupon();
    const [totalPrice, setTotalPrice] = useState(0);
    const [feeDelivery, setFeeDelivery] = useState(0);
    const [paymentId, setPaymentId] = useState(0);
    const [deleveryId, setDeleveryId] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponModel, setCouponModel] = useState(null);
    const [userModel, setUserModel] = useState(null);
    const { createOrder,getOrderDetail } = useOrder();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            roleId: 5,
            status: null
        }
    });
    const [fullName, setFullName] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [email, setEmail] = useState(null);

    const { getProvince, getDistrict, getWard } = useAddress();
    const [address, setListAddress] = useState([{ id: null, provinceId: null, districtId: null, wardId: null, addressDetail: null, provinceName: null, districtName: null, wardName: null, stage: 0, addressDetail: '' }]);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [provinceId, setProvinceId] = useState(null);
    const [districtId, setDistrictId] = useState(null);
    const [wardId, setWardId] = useState(null);
    
    const { id } = useParams(); 

    const handleProductSelected = (products, index) => {
        const modelTabs = [...tabs];
        modelTabs[index] = { ...modelTabs[index], products: products };
        const sum = products.reduce((accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity), 0);
        if (couponModel !== undefined && couponModel !== null) {
            if (couponModel.minValue <= totalPrice && couponModel.maxValue >= totalPrice) {
                var discountNumber = 0;
                if (couponModel.type === 1) {
                    discountNumber = (sum * couponModel.couponAmount / 100);
                } else {
                    discountNumber = couponModel.couponAmount;
                }
                setDiscount(discountNumber);
            } else {
                toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
            }
        }
        setTotalPrice(sum);
        setTabs(modelTabs);
    }
    const addTab = () => {
        if (tabs.length < 5) {
            const newTabId = `Đơn hàng ${tabs.length + 1}`;
            setTabs([...tabs, { id: newTabId, active: false, user: null, products: [] }]);
            setActiveTab(newTabId);
        } else {
            toast.error("Only can create 5 order in one time!");
        }
    };
    
    const fetchOrderDetail = async () => {
        const { success, data } = await getOrderDetail(id);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            modelTabs[index] = { ...modelTabs[index], products: data.data.product };
            setTabs(modelTabs);
        }
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
            setPayments(result);
        }
    }
    const fetchDelivery = async () => {
        const { success, data } = await getListDelivery(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setDelivery(data.data);
            const result = data.data.map((e) => {
                return {
                    value: e.id,
                    label: e.name
                }
            });
            setOptionDelivery(result)
        }
    }
    const closeTab = (tabId) => {
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTab === tabId && newTabs.length > 0) {
            setActiveTab(newTabs[newTabs.length - 1].id);
        }
    };
    const onCreateOrder = async (modelProducts, tabIds) => {
        try {
            const addressModel = address.map((e) => {
                return {
                    provinceId: e.provinceId,
                    districtId: e.districtId,
                    wardId: e.wardId,
                    addressDetail: e.addressDetail,
                    stage: 1,
                    provinceName: e.provinceName,
                    districtName: e.districtName,
                    wardName: e.wardName,
                    id: e.id
                }
            });
            const model = {
                code: null,
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                dateBirth: null,
                userName: phoneNumber,
                gender: false,
                address: addressModel,
                roleId: 8,
                description: "Customer visitor",
                status: 1,
                id: null
            }
            var product = modelProducts.map((e) => {
                return {
                    productId: e.id,
                    quantity: e.quantity,
                    total: e.quantity * e.price,
                    status: 1,
                    price: e.price,
                    originPrice: e.price
                }
            });
            var objectModel = {
                userId: userModel ? userModel.id : null,
                price: totalPrice,
                paymentId: paymentId,
                feeDelivery: feeDelivery,
                deliveryType: deleveryId,
                description: null,
                status: deleveryId === 1 ? 8 : 4,
                stage: 1,
                type: 1,
                realPrice: totalPrice,
                addressId: userModel ? (userModel.address && userModel.address[0].id) : null,
                orderDetailModels: product,
                couponCode: couponModel && couponModel.code,
                userModel: model,
                userType: userModel ? 2 : 1
            }
            const { success, data } = await createOrder(objectModel);
            if (data.status != 'Error' && success) {
                closeTab(tabIds);
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    };
    const onFinish = (errorInfo) => {
        console.log("Failed:", errorInfo);
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

    const fetchData = async () => {
        const { success, data } = await getListUser(tableParams.pagination);
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
            setOptions(model);
        } else {
            toast.error(data.message)
        }
    }
    const onSearchByKey = (e) => {
        setQuery(e);
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e
            }
        }))
    }
    useEffect(() => {
        if (tableParams.pagination && tableParams.pagination.keySearch.length > 0) {
            fetchData();
        }
        fetchOrderDetail();
        fetchDelivery();
        fetchPayment();
        fetchProvince();
    }, [JSON.stringify(tableParams), loading])
    const handleInputQuantity = (index, value) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models[index] = { ...models[index], quantity: parseInt(value) };
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models }

        const sum = modelTabs[tabIndex].products.reduce((accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity), 0);
        setTotalPrice(sum);
        setTabs(modelTabs);
    }
    const handleRemoveProd = (index) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models.splice(index, 1);
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models }
        setTabs(modelTabs);
    }
    const handleChangeAddress = (e) => {
        const addressModel = [...address];
        addressModel[0] = { ...addressModel[0], addressDetail: e.target.value };
        setListAddress(addressModel);
    }
    const handleSelect = (value, option, index) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        var userInfo = user.find((e) => e.id === value);
        const modelTabs = [...tabs];
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], user: userInfo };
        setTabs(modelTabs);
        form.setFieldsValue({ customerName: userInfo.fullName, phoneNumber: userInfo.phoneNumber, addressDetail: userInfo.address && userInfo.address.length > 0 && userInfo.address[0].fullInfo });
        setQuery(option.fullName);
    };
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
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(text)}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            width: 150,
            render: (_, record, index) => {
                return <Input style={{ textAlign: 'center' }} type="number" value={record.quantity}
                    onChange={(e) => handleInputQuantity(index, e.target.value)}
                >
                </Input>
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space style={{ textAlign: 'center' }}>
                    <Trash2 style={{ color: "gray" }} onClick={(e) => handleRemoveProd(index)} />
                </Space>
            ),
        },
    ];
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    const handlePaymentId = (e) => {
        setPaymentId(e);
        if (delivery && delivery.length > 0) {
            const deliveryModel = delivery.find((m) => m.id === e);
            setFeeDelivery(deliveryModel ? deliveryModel.fee : 0);
        }
    }
    const handleSelectDelivery = (e) => {
        setDeleveryId(e);
        if (delivery && delivery.length > 0) {
            const deliveryModel = delivery.find((m) => m.id === e);
            setFeeDelivery(deliveryModel ? deliveryModel.fee : 0);
        }
    }

    const fetchProvince = async () => {
        var request = {
            name: null
        };
        const { success, data } = await getProvince(request);
        if (!success || data.status == 'Error') {
            toast.error(data.message);
        } else {
            setProvince(data.data);
        }
    };

    const fetchDistrict = async (provinceId) => {
        setDistrictId(0);
        var request = {
            code: provinceId,
            name: null
        };
        const { success, data } = await getDistrict(request);
        if (!success || data.status == 'Error') {
            toast.error(data.message);
        } else {
            setDistrict(data.data);
        }
    };

    const fetchWard = async (districtId) => {
        setWardId(0);
        var request = {
            code: districtId,
            name: null
        };
        const { success, data } = await getWard(request);
        if (!success || data.status == 'Error') {
            toast.error(data.message);
        } else {
            setWard(data.data);
        }
    };

    const handleSelectProvince = (e) => {
        setProvinceId(e);
        fetchDistrict(e);
        const addressModel = [...address];
        addressModel[0] = { ...addressModel[0], provinceId: e, districtId: 0, wardId: 0 };
        setListAddress(addressModel);
    }

    const handleSelectDistrict = (e) => {
        setDistrictId(e);
        fetchWard(e);
        const addressModel = [...address];
        addressModel[0] = { ...addressModel[0], districtId: e, wardId: 0 };
        setListAddress(addressModel);
    }

    const handleSelectWard = (e) => {
        setWardId(e);
        const addressModel = [...address];
        addressModel[0] = { ...addressModel[0], wardId: e };
        setListAddress(addressModel);
    }

    const handleSelectUser = (e) => {
        form.setFieldsValue({ customerName: e.fullName, phoneNumber: e.phoneNumber, email: e.email, addressDetail: e.address && e.address.length > 0 && e.address[0].fullInfo });
        setUserModel(e);
    }

    const handleSelectCounpon = (e) => {
        if (e.minValue <= totalPrice && e.maxValue >= totalPrice) {
            var discountNumber = 0;
            if (e.type === 1) {
                discountNumber = (totalPrice * e.couponAmount / 100);
            } else {
                discountNumber = e.couponAmount;
            }
            setDiscount(discountNumber);
            setCouponModel(e);
        } else {
            toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
        }
    }

    return (
        <div>
            {/* <Row>

                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        value="large"
                        style={{
                            alignItems: "center",
                            background: "#2596be",
                            marginRight: "10px"
                        }}
                        onClick={() => addTab()}
                    >  Thêm đơn hàng
                    </Button>
                </Col>
            </Row> */}
            <div style={{ marginBottom: '10px' }}>
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={tab.id}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        closeTab={closeTab}
                    />
                ))}
            </div>

            {tabs.map(
                (tab, index) =>
                    activeTab === tab.id && (
                        <Form
                            form={form}
                            onFinish={null}
                            onFinishFailed={onFinishFailed}
                            initialValues={{ layout: "horizontal" }}
                            layout="vertical"
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <ProductPopUp handleProductSelected={handleProductSelected} modelProduct={tab.products} tabIndex={index} />
                                </Col>
                            </Row>
                            <Table
                                dataSource={tab.products} columns={columns}
                                pagination={false}
                                loading={false}
                                onChange={null}
                            />
                            <br />
                            <Row gutter={[25, 25]} style={{ justifyContent: 'space-between' }}>
                                <Col span={11}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span>
                                        </Col>

                                        <br />
                                        {/* <Col span={18}> */}
                                            {/* <AutoComplete
                                                options={option}
                                                onSearch={onSearchByKey}
                                                onSelect={handleSelect}
                                                value={query}
                                                onChange={setQuery}
                                                style={{ width: '100%' }}
                                            >
                                                <Input placeholder="Enter code, phone number, name customer..." />
                                            </AutoComplete> */}
                                            {/* <Input readOnly={true} value={userModel != null ? userModel.fullName : "Khách hàng lẻ"} />

                                        </Col>
                                        <Col span={6} style={{ textAlign: 'right' }}>
                                            <CustomerPopup handlePopupSelected={handleSelectUser} model={userModel} />
                                        </Col> */}


                                        <Col span={12}>
                                            <Form.Item
                                                label="Họ tên khách hàng"
                                                name="customerName"
                                                style={{ fontWeight: '500' }}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input placeholder="" type="text" value={userModel && userModel.fullName} onChange={(e) => setFullName(e.target.value)} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label="Số điện thoại khách hàng"
                                                name="phoneNumber"
                                                style={{ fontWeight: '500' }}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input placeholder="" type="text" value={userModel && userModel.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Email khách hàng"
                                                name="email"
                                                style={{ fontWeight: '500' }}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input placeholder="" type="text" value={userModel && userModel.email} onChange={(e) => setEmail(e.target.value)} />
                                            </Form.Item>
                                        </Col>
                                        {deleveryId > 0 && deleveryId !== 1 && <>

                                            {
                                                userModel === null && <>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label="Tỉnh/Thành phố"
                                                            name="provinceId"
                                                            style={{ fontWeight: '500' }}
                                                            rules={[{ required: true, message: "Please select province" }]}
                                                        >
                                                            <Select
                                                                value={provinceId}
                                                                placeholder="Please select"
                                                                onChange={(e) => handleSelectProvince(e)}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                            >   <Option value={0}>Chọn Tỉnh/Thành phố</Option>
                                                                {province && province.map((e) => {
                                                                    return <Option value={e.code}>{e.name}</Option>
                                                                })
                                                                }
                                                            </Select>

                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label="Quận/Huyện"
                                                            name="districtId"
                                                            style={{ fontWeight: '500' }}
                                                            rules={[{ required: true, message: "Please select district" }]}
                                                        >
                                                            <Select
                                                                value={districtId}
                                                                placeholder="Please select"
                                                                onChange={(e) => handleSelectDistrict(e)}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                            >   <Option value={0}>Chọn Quận/Huyện</Option>
                                                                {district && district.map((e) => {
                                                                    return <Option value={e.code}>{e.name}</Option>
                                                                })
                                                                }
                                                            </Select>

                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label="Xã/Phường"
                                                            name="wardId"
                                                            style={{ fontWeight: '500' }}
                                                            rules={[{ required: true, message: "Please select wards" }]}
                                                        >
                                                            <Select
                                                                value={wardId}
                                                                placeholder="Please select"
                                                                onChange={(e) => handleSelectWard(e)}
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                            >   <Option value={0}>Chọn Xã/Phường</Option>
                                                                {Array.isArray(ward) && ward.map((e) => {
                                                                    return <Option value={e.code}>{e.name}</Option>
                                                                })
                                                                }
                                                            </Select>

                                                        </Form.Item>
                                                    </Col>
                                                </>
                                            }

                                            <Col span={24}>
                                                <Form.Item
                                                    label="Địa chỉ chi tiết"
                                                    name="addressDetail"
                                                    style={{ fontWeight: '500' }}
                                                    rules={[{ required: true, message: "" }]}
                                                >
                                                    <Input placeholder="" type="text" onChange={(e) => handleChangeAddress(e)} />
                                                </Form.Item>
                                            </Col></>}
                                    </Row>
                                </Col>
                                <Col span={11}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin thanh toán</span>
                                        </Col>
                                        <br />
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Mã khuyến mại: </p>
                                                </Col>
                                                <Col span={10}>
                                                    <Input placeholder="" value={couponModel && couponModel.code} type="text" onBlur={handleChange} readOnly={true} /></Col>
                                                <Col span={8} style={{ textAlign: 'right' }}>
                                                    <VoucherPopup handlePopupSelected={handleSelectCounpon} model={couponModel} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <br />
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Thanh toán: </p>
                                                </Col>
                                                <Col span={18}>

                                                    <Select
                                                        placeholder="Please select"
                                                        onChange={handlePaymentId}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        options={payments}
                                                    /></Col>
                                            </Row>
                                        </Col>
                                        <br />
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Giao hàng: </p>
                                                </Col>
                                                <Col span={18}>
                                                    <Select
                                                        placeholder="Please select"
                                                        onChange={(e) => handleSelectDelivery(e)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        options={optionDelivery}
                                                    /></Col>
                                            </Row>

                                        </Col>
                                        <br />
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Tiền hàng: </p>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{formatCurrencyVND(totalPrice)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Phí vận chuyển: </p>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{feeDelivery && formatCurrencyVND(feeDelivery ?? 0)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Tiền giảm giá voucher: </p>
                                                </Col>
                                                <Col span={16} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{discount && formatCurrencyVND(discount ?? 0)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Tổng thanh toán: </p>
                                                </Col>
                                                <Col span={16} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{discount && formatCurrencyVND(totalPrice + feeDelivery - discount)}</p></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <br />
                            <Col span={6} style={{ textAlign: 'left' }}>
                                <PaymentType callback={onCreateOrder} amount={totalPrice + feeDelivery - discount} paymentId={paymentId} deliveryId={deleveryId} products={tab.products} tabIds={tab.id} />
                            </Col>
                        </Form>
                    )
            )}
        </div>
    );
};

export default OrderDetail;
