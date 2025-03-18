import React, { useEffect, useState } from 'react';
import { Button, Input, Menu, Table, Dropdown, Row, Col, Form } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import useRole from '@api/useRole';
import RoleAdd from './RoleAdd';
import { DownOutlined } from '@ant-design/icons';
import CommonPopup from './../Common/CommonPopup';

function RoleManager() {
    const { getListRole, changeStatus } = useRole()

    const [roles, setRole] = useState([])

    const [loading, setLoading] = useState(false);

    const [searchName, setSearchName] = useState('')

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: ''
        },
    });
    const fetchData = async () => {
        const { success, data } = await getListRole(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setRole(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    }
    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading, searchName])

    const handleChangeName = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e.target.value
            }
        }))
    }
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setRole([]);
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
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (_, __, index) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</a>,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },

        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.name}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value == 1) {
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
    const menu = (record) => (
        <Menu>
            <Menu.Item>

                <RoleAdd fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
            </Menu.Item>
            <Menu.Item>
                <Button
                    type="button"
                    value="small"
                    onClick={(e) => showModal(record.id)}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu >
    );

    const [idChangeStatus, setIdChangeStatus] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChangeStatus = async (id) => {
        const { success, data } = await changeStatus(id);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            fetchData();
        }
    }
    const handleOk = () => {
        handleChangeStatus(idChangeStatus);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal = (id) => {
        setIdChangeStatus(id);
        setIsModalVisible(true);
    };

    return (
        <>
            <CommonPopup
                visible={isModalVisible}
                title="Xác nhận"
                content={<p>Bạn chắc chắn cập nhật trạng thái bản ghi này?</p>}  // You can replace this with any content
                onClose={handleCancel}
                onOk={handleOk}
            />
            <Row gutter={[12, 12]}>
                <Col span={16}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <Input placeholder="Enter code, name category" onChange={(e) => handleChangeName(e)} />
                    </Form.Item>

                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <RoleAdd fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} /></Col>
            </Row>

            <Table
                dataSource={roles} columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
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

export default RoleManager;