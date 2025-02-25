import { PlusSquareOutlined } from "@ant-design/icons";
import useBranch from "@api/useBranch";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
function ProductTypeAdd() {

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
          <PlusSquareOutlined /> Thêm mới
        </Button>
  
        <Modal
          width={'50%'}
          title="Thêm mới kiểu sản phẩm"
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
              <Col span={16}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[{ required: true, message: "Please input category code!" }]}
                >
                  <Input placeholder="Type code auto generate" readOnly="true" />
                </Form.Item>
              </Col>      
            </Row>

            <Row gutter={[16, 16]}>
            <Col span={16}>
                <Form.Item
                  label="Tên thể loại"
                  name="name"
                  rules={[{ required: true, message: "Please input type name!" }]}
                >
                  <Input placeholder="Please input type name" />
                </Form.Item>
              </Col>      
            </Row>

            <Row gutter={[16, 16]}>
            <Col span={16}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Please input type description!" }]}
                >
                  <Input placeholder="Please input type description" />
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

export default ProductTypeAdd;
