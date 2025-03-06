import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import useBranch from '@api/useBranch';
import RoleAdd from './RoleAdd';
import RoleDelete from './RoleDelete';
import RoleEdit from './RoleEdit';

function RoleManager() {
    const { getBranch } = useBranch()

    const [branch, setBranch] = useState([])

    const [loading, setLoading] = useState(false);

    const [searchName, setSearchName] = useState('')

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
        },
    });
    const fetchData = async () => {
        const { success, data } = await getBranch(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setBranch(data.data.items)
            setLoading(false);
            setTotal(data.data.totalCount)
        }
    }
    // useEffect(() => {
    //     fetchData()
    // }, [JSON.stringify(tableParams), loading, searchName])
    const handleChangeName = (e) => {
        setSearchName(e.target.value)
    }
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setBranch([]);
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
            render: (text) => <a style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{text}</a>,
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
            render: (_, record) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{record.countProduct}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <p style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>{new Date(text).toLocaleDateString('en-GB')}</p>
        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <RoleDelete id={record.id} state={loading} action={setLoading} />
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Branch'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                    <RoleEdit id={record.id} state={loading} action={setLoading} />
                </Space>
            ),
        },
    ];
    return (
        <>

            <RoleAdd />
            <Table
                dataSource={branch} columns={columns}
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