import { Link } from "react-router-dom"
import DetailOrder from "./DetailOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import useOrder from '@api/useOrder';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Table, Space, Button } from 'antd';

import OrderAddOrChange from './OrderAddOrChange';

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  } 

function EmployeeManager() {
    const {getAll} = useOrder()
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(false)
    const [total,setTotal] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10
        }
    })
    const fetchData = async () => {
        const {success,data} = await getAll(tableParams.pagination);
        console.log(data);
        if(success && data.status != 'Error') {
            setOrder(data.data.items)
            setLoading(false)
            setTotal(data.data.totalCount)
        }else {
            toast.error(data.message)
        }
    }
    // useEffect(() => {
    //     fetchData()    
    // }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
          });
          if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setOrder([]);
          }
    }

    const onShowSizeChange  = (current,pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    }
    const columns = [
        {
            title: 'STT',
            render: (data) => {
                return (<p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{`${data.orderNumber}`}</p>)
            }
        },
        {
            title: 'Order code',
            render: (data) => {
                return (<p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{`${data.orderCode}`}</p>)
            }
        },
        {
            title: 'Customer name',
            render: (data) => {
                return (<p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{`${data.customerName}`}</p>)
            }
        },
        {
            title: 'Phone number',
            render: (data) => {
                return (<p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{`${data.phoneNumber}`}</p>)
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'addressDetail',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.addressDetail}</p>
        },
        {
            title: 'Employee name',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.employeeName}</p>
        },
        {
            title: 'Order status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.orderStatus}</p>
        },
        // {
        //     title: 'Order stage',
        //     dataIndex: 'orderStage',
        //     key: 'orderStage',
        //     render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.orderStage}</p>
        // },
        // {
        //     title: 'Order type',
        //     dataIndex: 'orderTypeName',
        //     key: 'orderTypeName',
        //     render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.orderTypeName}</p>
        // },
        // {
        //     title: 'Delivery type',
        //     dataIndex: 'deliveryName',
        //     key: 'deliveryName',
        //     render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.deliveryName}</p>
        // },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_,data) => {
                return (<p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{formatCurrencyVND(data.totalPrice)}</p>)
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Order'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                     
                </Space>
            ),
        },
        
    ]
    return (
        <>
        <OrderAddOrChange/>
         <Table 
                dataSource={orders}   
                columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
        />
        <Pagination showSizeChanger
                onChange={onShowSizeChange} 
                style={{textAlign: 'center',marginTop: '1.5rem'}} 
                defaultCurrent={tableParams.pagination.pageIndex} 
                total={total}  />
        </>
    )
} 

export default EmployeeManager