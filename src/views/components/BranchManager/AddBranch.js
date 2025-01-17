import { PlusSquareOutlined } from "@ant-design/icons";
import useBranch from "@api/useBranch";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
function AddBranch() {

    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm()
    const {createBranch} = useBranch()

    const onFinish = async (values) => {
        try {
            const branch = {
              BranchName: values.BranchName
            }
           const {success,data}  = await createBranch(branch, { "Content-Type": "multipart/form-data"})
            console.log(success,data);
           
            if (data.status != 'Error' && success) {
                setModal2Open(false);
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
          toast.error(error)
        }
      };


      const onFinishFailed = () => {
        
      }
    return ( <>  <div>
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
          <PlusSquareOutlined /> Add
        </Button>
  
        <Modal
          width={'50%'}
          title="Create new branch"
          centered
          visible={modal2Open}
          onCancel={() => setModal2Open(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ layout: "horizontal" }}
            layout="vertical"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Branch Name"
                  name="BranchName"
                  rules={[{ required: true, message: "Please input branch name!" }]}
                >
                  <Input placeholder="Branch Name" />
                </Form.Item>
              </Col>      
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div></>  );
}

export default AddBranch;
