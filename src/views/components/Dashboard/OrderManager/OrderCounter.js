import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Card } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUser from "@api/useUser";
import { Trash2, CircleX, Eye } from "lucide-react";
import ProductPopUp from "./ProductPopUp";
import VoucherPopup from "./VoucherPopup";
import PaymentType from "./PaymentType";
import usePayment from '@api/usePayment';
import useDelivery from '@api/useDelivery';
import CustomerPopup from "./CustomerPopup";
import { Option } from "antd/es/mentions";
import useAddress from "@api/useAddress";
import useOrder from '@api/useOrder';
const Tab = ({ label, activeTab, setActiveTab, closeTab }) => {
    return (
        <div
            onClick={() => setActiveTab(label)}
            style={{
                display: 'inline-block',
                padding: '5px 5px',
                cursor: 'pointer',
                backgroundColor: activeTab === label ? '#2596be' : '#fff',
                margin: '5px',
                borderRadius: 10,
            }}
        >
            <input
                type="text"
                value={label}
                onChange={(e) => null}
                style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: activeTab === label ? '#fff' : '#000'
                }}
            />
            <CircleX size={25} onClick={(e) => {
                e.stopPropagation(); // Prevent tab switching on close button click
                closeTab(label);
            }}
                color={activeTab === label ? '#fff' : '#000'}
            />
        </div>
    );
};
const OrderCounter = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([{ id: 'Đơn hàng 1', active: true, user: null, products: [], userModel: null, fullName: '', phoneNumber: '', email: '', provinceId: null, districtId: null, wardId: null, addressDetail: '', totalPrice: null, paymentId: null, delevryId: null, couponModel: null, discount: null, feeDelivery: null, address: [] }]);
    const [activeTab, setActiveTab] = useState('Đơn hàng 1');
    const [user, setUsers] = useState([]);
    const { getListUser } = useUser();
    const [payments, setPayments] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [optionDelivery, setOptionDelivery] = useState([]);
    const { getListPayment } = usePayment();
    const { getListDelivery } = useDelivery();
    const [totalPrice, setTotalPrice] = useState(0);
    const [feeDelivery, setFeeDelivery] = useState(0);
    const [paymentId, setPaymentId] = useState(0);
    const [deleveryId, setDeleveryId] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponModel, setCouponModel] = useState(null);
    const [userModel, setUserModel] = useState(null);
    const { createOrder } = useOrder();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            roleId: 5,
            status: 1
        }
    });
    const { getProvince, getDistrict, getWard } = useAddress();
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);

    const addTab = () => {
        if (tabs.length < 5) {
            const newTabId = `Đơn hàng ${tabs.length + 1}`;
            setTabs([...tabs, { id: newTabId, active: false, user: null, products: [], userModel: null, fullName: '', phoneNumber: '', email: '', provinceId: null, districtId: null, wardId: null, addressDetail: '', totalPrice: null, paymentId: null, delevryId: null, couponModel: null, address: [] }]);
            setActiveTab(newTabId);
        } else {
            toast.error("Only can create 5 order in one time!");
        }
    };
    const closeTab = (tabId) => {
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTab === tabId && newTabs.length > 0) {
            setActiveTab(newTabs[newTabs.length - 1].id);
        }
    };
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
    const onCreateOrder = async (modelProducts, tabIds) => {
        try {
            debugger;
            const tabInfoModel = tabs[tabs.findIndex(e => e.id === tabIds)];
            const addressModel = tabInfoModel.address.map((e) => {
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
                code: tabInfoModel.userModel ? tabInfoModel.userModel.code : null,
                fullName: tabInfoModel.fullName,
                phoneNumber: tabInfoModel.phoneNumber,
                email: tabInfoModel.email,
                dateBirth: null,
                userName: tabInfoModel.email,
                gender: false,
                address: addressModel,
                roleId: 8,
                description: "Customer visitor",
                status: 1,
                id: tabInfoModel.userModel ? tabInfoModel.userModel.id : null
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
                userId: tabInfoModel.userModel ? tabInfoModel.userModel.id : null,
                price: tabInfoModel.totalPrice,
                paymentId: tabInfoModel.paymentId,
                feeDelivery: tabInfoModel.feeDelivery,
                deliveryType: tabInfoModel.delevryId,
                description: null,
                status: tabInfoModel.delevryId === 1 ? 4 : 1,
                stage: 1,
                type: 1,
                realPrice: tabInfoModel.totalPrice,
                addressId: tabInfoModel.userModel ? (tabInfoModel.userModel.address && tabInfoModel.userModel.address[0].id) : null,
                orderDetailModels: product,
                couponCode: tabInfoModel.couponModel && tabInfoModel.couponModel.code,
                userModel: model,
                userType: tabInfoModel.userModel ? 2 : 1
            }
            const { success, data } = await createOrder(objectModel);
            if (data.status != 'Error' && success) {
                if (data.code == 200) {
                    closeTab(tabIds);
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    };
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
        } else {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        if (tableParams.pagination && tableParams.pagination.keySearch.length > 0) {
            fetchData();
        }
        fetchDelivery();
        fetchPayment();
        fetchProvince();
    }, [JSON.stringify(tableParams), loading])

    const handleProductSelected = (products, index) => {
        const modelTabs = [...tabs];
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
        modelTabs[index] = { ...modelTabs[index], products: products, totalPrice: sum};
        setTabs(modelTabs);
    }
    const handleInputQuantity = (index, value) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models[index] = { ...models[index], quantity: parseInt(value) };
        const sum = modelTabs[tabIndex].products.reduce((accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity), 0);
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models, totalPrice: sum }
        setTotalPrice(sum);
        setTabs(modelTabs);
    }
    const handleRemoveProd = (index) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models.splice(index, 1);
        const sum = models.reduce((accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity), 0);
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models, totalPrice: sum }
        setTabs(modelTabs);
    }
    const handleChangeAddress = (e, index) => {
        const tabModel = [...tabs];
        const addressModel = tabModel[index].address;
        addressModel[0] = { ...addressModel[0], addressDetail: e.target.value };
        tabModel[index] = { ...tabModel[index], address: addressModel[0] };
        setTabs(tabModel);
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
    const handlePaymentId = (e, index) => {
        setPaymentId(e);
        if (e !== 3) {
            fetchDelivery();
            setDeleveryId(1);
            const tabModel = [...tabs];
            tabModel[index] = { ...tabModel[index], paymentId: e, delevryId: 1 };
            setTabs(tabModel);
        } else {
            const models = [...delivery];
            const result = models.map((e) => {
                return {
                    value: e.id,
                    label: e.name
                }
            });
            setOptionDelivery(result.filter(e => e.value !== 1));
            const tabModel = [...tabs];
            tabModel[index] = { ...tabModel[index], paymentId: e };
            setTabs(tabModel);
        }
    }
    const handleSelectDelivery = (e, index) => {
        setDeleveryId(e);
        if (delivery && delivery.length > 0) {
            const deliveryModel = delivery.find((m) => m.id === e);
            setFeeDelivery(deliveryModel ? deliveryModel.fee : 0);
            const tabModel = [...tabs];
            tabModel[index] = { ...tabModel[index], feeDelivery: deliveryModel.fee, delevryId: e };
            setTabs(tabModel);
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
    const handleSelectProvince = (e, index) => {
        fetchDistrict(e);
        const tabModel = [...tabs];
        const addressModel = tabModel[index].address;
        addressModel[0] = { ...addressModel[0], provinceId: e, districtId: 0, wardId: 0 };
        tabModel[index].address = { ...tabModel[index], address: addressModel };
        setTabs(tabModel);
    }
    const handleSelectDistrict = (e, index) => {
        fetchWard(e);
        const tabModel = [...tabs];
        const addressModel = tabModel[index].address;
        addressModel[0] = { ...addressModel[0], districtId: e, wardId: 0 };
        tabModel[index].address = { ...tabModel[index], address: addressModel };
        setTabs(tabModel);
    }

    const handleSelectWard = (e, index) => {
        const tabModel = [...tabs];
        const addressModel = tabModel[index].address;
        addressModel[0] = { ...addressModel[0], wardId: e };
        tabModel[index].address = { ...tabModel[index], address: addressModel };
        setTabs(tabModel);
    }
    const handleSelectUser = (e, index) => {
        const tabModel = [...tabs];
        debugger;
        tabModel[index] = { ...tabModel[index], userModel: {id: e.id, fullName: e.fullName, phoneNumber: e.phoneNumber, email: e.email, addressDetail: e.address && e.address.length > 0 && e.address[0].fullInfo, address: e.address }, address: e.address, addressDetail:  e.address && e.address.length > 0 && e.address[0].fullInfo };
        setUserModel(e);
        setTabs(tabModel);
    }
    const handleSelectCounpon = (e, index) => {
        if (e.minValue <= totalPrice && e.maxValue >= totalPrice) {
            var discountNumber = 0;
            if (e.type === 1) {
                discountNumber = (totalPrice * e.couponAmount / 100);
            } else {
                discountNumber = e.couponAmount;
            }
            const tabModel = [...tabs];
            tabModel[index] = { ...tabModel[index], discount: discountNumber, couponModel: e };
            setTabs(tabModel);
            setDiscount(discountNumber);
            setCouponModel(e);
        } else {
            toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
        }
    }
    const handleSetFullName = (e, index) => {
        const tabModel = [...tabs];
        tabModel[index] = { ...tabModel[index], fullName: e };
        setTabs(tabModel);
    }
    const handleSetEmail = (e, index) => {
        const tabModel = [...tabs];
        tabModel[index] = { ...tabModel[index], email: e };
        setTabs(tabModel);
    }
    const handleSetPhone = (e, index) => {
        const tabModel = [...tabs];
        tabModel[index] = { ...tabModel[index], phoneNumber: e };
        setTabs(tabModel);
    }
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    return (
        <div>
            <Row>

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
            </Row>
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

            {tabs.map((tab, index) => {
                return (activeTab === tab.id && (
                    <>
                        <Card>
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
                        </Card>
                        <br />
                        <Row gutter={[25, 25]} style={{ justifyContent: 'space-between' }}>
                            <Col span={11}>
                                <Card>   <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span>
                                    </Col>

                                    <br />
                                    <Col span={18}>
                                        <Input readOnly={true} value={tab.userModel != null ? tab.userModel.fullName : "Khách hàng lẻ"} />

                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <CustomerPopup handlePopupSelected={(e) => handleSelectUser(e, index)} index={index} />
                                    </Col>
                                    <Col span={12}>
                                        <p style={{ fontWeight: '500' }}>Họ tên khách hàng: <span style={{ color: 'red' }}>(*)</span> </p>
                                        <Input placeholder="" type="text" value={tab.userModel && tab.userModel.fullName} onChange={(e) => handleSetFullName(e.target.value, index)} />
                                    </Col>

                                    <Col span={12}>
                                        <p style={{ fontWeight: '500' }}>Số điện thoại: <span style={{ color: 'red' }}>(*)</span> </p>
                                        <Input placeholder="" type="text" value={tab.userModel && tab.userModel.phoneNumber} onChange={(e) => handleSetPhone(e.target.value, index)} />
                                    </Col>
                                    <Col span={24}>
                                        <p style={{ fontWeight: '500' }}>Email: <span style={{ color: 'red' }}>(*)</span> </p>
                                        <Input placeholder="" type="text" value={tab.userModel && tab.userModel.email} onChange={(e) => handleSetEmail(e.target.value, index)} />
                                    </Col>
                                    {tab.delevryId > 0 && tab.delevryId !== 1 && <>
                                        {
                                            tab.userModel === null && <>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Tỉnh/Thành phố: <span style={{ color: 'red' }}>(*)</span> </p>
                                                    <Select
                                                        value={tab.provinceId}
                                                        placeholder="Please select"
                                                        onChange={(e) => handleSelectProvince(e, index)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >   <Option value={0}>Chọn Tỉnh/Thành phố</Option>
                                                        {province && province.map((e) => {
                                                            return <Option value={e.code}>{e.name}</Option>
                                                        })
                                                        }
                                                    </Select>
                                                </Col>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Quận/Huyện: <span style={{ color: 'red' }}>(*)</span> </p>
                                                    <Select
                                                        value={tab.districtId}
                                                        placeholder="Please select"
                                                        onChange={(e) => handleSelectDistrict(e, index)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >   <Option value={0}>Chọn Quận/Huyện</Option>
                                                        {district && district.map((e) => {
                                                            return <Option value={e.code}>{e.name}</Option>
                                                        })
                                                        }
                                                    </Select>
                                                </Col>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Xã/Phường: <span style={{ color: 'red' }}>(*)</span> </p>
                                                    <Select
                                                        value={tab.wardId}
                                                        placeholder="Please select"
                                                        onChange={(e) => handleSelectWard(e, index)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >   <Option value={0}>Chọn Xã/Phường</Option>
                                                        {Array.isArray(ward) && ward.map((e) => {
                                                            return <Option value={e.code}>{e.name}</Option>
                                                        })
                                                        }
                                                    </Select>
                                                </Col>
                                            </>
                                        }

                                        <Col span={24}>
                                            <p style={{ fontWeight: '500' }}>Địa chỉ chi tiết: <span style={{ color: 'red' }}>(*)</span> </p>
                                            <Input placeholder="" type="text" value={tab.addressDetail} onChange={(e) => handleChangeAddress(e, index)} />
                                        </Col></>}
                                </Row></Card>
                            </Col>
                            <Col span={11}>
                                <Card>
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
                                                    <Input placeholder="" value={tab.couponModel && tab.couponModel.code} type="text" readOnly={true} /></Col>
                                                <Col span={8} style={{ textAlign: 'right' }}>
                                                    <VoucherPopup handlePopupSelected={(e) => handleSelectCounpon(e, index)} model={couponModel} />
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
                                                        onChange={(e) => handlePaymentId(e, index)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        options={payments}
                                                    /></Col>
                                            </Row>
                                        </Col>
                                        <br />
                                        {tab.paymentId === 3 && <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Giao hàng: </p>
                                                </Col>
                                                <Col span={18}>
                                                    <Select
                                                        placeholder="Please select"
                                                        onChange={(e) => handleSelectDelivery(e, index)}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        options={optionDelivery}
                                                    /></Col>
                                            </Row>

                                        </Col>}
                                        <br />
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Tiền hàng: </p>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{formatCurrencyVND(tab.totalPrice)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={6}>
                                                    <p style={{ fontWeight: '500' }}>Phí vận chuyển: </p>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{tab.feeDelivery && formatCurrencyVND(tab.feeDelivery ?? 0)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Tiền giảm giá voucher: </p>
                                                </Col>
                                                <Col span={16} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{tab.discount && formatCurrencyVND(tab.discount ?? 0)}</p></Col>
                                            </Row>

                                        </Col>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={8}>
                                                    <p style={{ fontWeight: '500' }}>Tổng thanh toán: </p>
                                                </Col>
                                                <Col span={16} style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500' }}>{discount && formatCurrencyVND(tab.totalPrice + tab.feeDelivery - tab.discount)}</p></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <br />
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <PaymentType callback={onCreateOrder} amount={tab.totalPrice + tab.feeDelivery - tab.discount} paymentId={tab.paymentId} deliveryId={tab.delevryId} products={tab.products} tabIds={tab.id} />
                        </Col>
                    </>
                ))
            }
            )}
        </div>
    );
};
export default OrderCounter;
