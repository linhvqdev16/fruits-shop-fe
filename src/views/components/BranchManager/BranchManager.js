import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table, Tag } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd'
import Delete from './DeleteBranch';
import Detail from './DetailBranch';
import Edit from './EditBranch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import useBranch from '@api/useBranch';
import AddBranch from './AddBranch';
import DeleteBranch from './DeleteBranch';
import EditBranch from './EditBranch';




  
function BranchManager() {  
    const { getBranch } = useBranch()

    const [branch, setBranch] = useState([])

    const [loading, setLoading] = useState(false);

    const [searchName,setSearchName] = useState('')

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
    });


    





    const fetchData = async () => {
        const {success,data} = await getBranch(tableParams.pagination);
        if(!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setBranch(data.data.items)
            setLoading(false);
            setTotal(data.data.totalCount)
        }
    }
    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading, searchName])

    const handleChangeName = (e)  => {
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
        setTableParams({pagination: {
            pageIndex: current,
            pageSize: pageSize
        }})
      };

    


      
    const columns = [
        {
            title: 'Name',
            dataIndex: 'branchName',
            key: 'branchName',
            render: (text) => <a style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{text}</a>,
        },
        
        {
            title: 'Quanlity Product',
            dataIndex: 'countProduct',
            key: 'countProduct',
            render: (_, record) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{record.countProduct}</p>
        },
    
        {
            title: 'Create Date',
            dataIndex: 'createDate',
            key: 'createDate',
            render:  (text) => <p style={{fontSize:"16px", color:"black", fontWeight:"500"}}>{new Date(text).toLocaleDateString('en-GB')}</p>
        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <DeleteBranch id={record.id} state={loading} action={setLoading} />
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Branch'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                    <EditBranch id={record.id} state={loading} action={setLoading} />
                </Space>
            ),
        },
        ];
    return ( 
        <>

            <AddBranch />
            <Table 
                dataSource={branch} columns={columns}     
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination  
                showSizeChanger
                onChange={onShowSizeChange} 
                style={{textAlign: 'center',marginTop: '1.5rem'}} 
                defaultCurrent={tableParams.pagination.pageIndex} 
                total={total} 
            />  
        </> 
    );
}

export default BranchManager;