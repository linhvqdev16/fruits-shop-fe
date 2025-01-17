import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import useOrder from '@api/useOrder';
import useAuth from '@api/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Table, Space, Button } from 'antd';

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  } 

function ManagerUser() {

    const [user, setUsers] = useState([]);
    const {getUser} = useAuth();

    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(true)
    const [total,setTotal] = useState(0)
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10
        }
    })
    

    const fetchData = async () => {
        const {success,data} = await getUser(tableParams.pagination);
        console.log(data);
        if(success && data.status != 'Error') {
            setUsers(data.data)
            setLoading(false)
            setTotal(data.data.length)
            toast.success(data.message)
        }else {
            toast.error(data.message)
        }
    }
    useEffect(() => {
        fetchData()    
    }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
          });
          if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setUsers([]);
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
            title: 'UserName',
            dataIndex: 'userName',
            key: 'userName',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.userName}</p>
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.phone}</p>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.email}</p>
        },
        {
            title: 'RoleName',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.roleName}</p>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={record.userId}>
                        <Button type='primary' title='Detail Account'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                     
                </Space>
            ),
        },
        
    ]
    return (

        <>
         <Table 
                dataSource={user}   
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

export default ManagerUser;