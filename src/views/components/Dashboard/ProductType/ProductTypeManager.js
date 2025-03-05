import React, { useEffect, useState } from 'react';
import { Button, Select, Dropdown, Table, Menu } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import useType from '@api/useType';
import ProductTypeAdd from './ProductTypeAdd';
import { Col, Form, Input, Row } from "antd";
import { DownOutlined } from '@ant-design/icons';

function ProductTypeManager() {
    const { getList } = useType()
    const { Option } = Select;

    const [types, setType] = useState([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const [selectedItem, setSelectedItem] = useState();

    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            status: null
        },
    });

    const fetchData = async () => {
        const { success, data } = await getList(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setType(data.data)
            setLoading(false);
            setTotal(data.data.totalCount)
        }
    }

    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading])

    const handleChangeName = (e) => {
        setTableParams((prevParms) => ({
            ...prevParms,
            pagination: {
                ...prevParms.pagination,
                keySearch: e.target.value
            }
        }));
    }

    const handleChangeSelect = (value) => {
        setTableParams((prevParms) => ({
            ...prevParms,
            pagination: {
                ...prevParms.pagination,
                status: value
            }
        }));
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setType([]);
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
            <Menu.Item onClick={() => handleMenuClick('Edit', record)}>Edit</Menu.Item>
            <Menu.Item onClick={() => handleMenuClick('Delete', record)}>Delete</Menu.Item>
        </Menu>
    );

    const handleMenuClick = (action, record) => {
         if(action === 'Edit'){
            debugger;
            setSelectedItem(record);
         }
    };
    

    const columns = [
        {
            title: 'STT',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (_, __, index) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500", textAlign: 'center' }}>{index + 1}</a>,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</a>,
        },

        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</p>
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value == 1) {
                    return <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>Hoạt động</p>
                } else {
                    return <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>Không hoạt động</p>
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
                <Col span={8}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <Input placeholder="Enter code, name category" onChange={(e) => handleChangeName(e)} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                    >
                        <Select
                            value={tableParams.pagination.status}
                            placeholder="Please select"
                            onChange={handleChangeSelect}
                            style={{
                                width: '100%',
                            }}
                        >
                            <Option value="-1">Tất cả</Option>
                            <Option value="1">Hoạt động</Option>
                            <Option value="2">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <ProductTypeAdd fetchData={fetchData} modelItem={null}/>
                </Col>
            </Row>
            <Table
                dataSource={types}
                columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            {(<ProductTypeAdd fetchData={fetchData} modelItem={selectedItem} />)}
            <Pagination
                showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total}
            />
        </>
    );
}

export default ProductTypeManager;