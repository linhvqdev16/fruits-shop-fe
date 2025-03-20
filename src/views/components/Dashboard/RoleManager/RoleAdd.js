import { PlusSquareOutlined } from "@ant-design/icons";
import useRole from "@api/useRole";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToast } from "@utils/toastContext";

const  RoleAdd  = ({fetchData, modelItem, textButton, isStyle}) =>{

    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const { addOrChange} = useRole(); 

    const onFinish = async (values) => {
        try {
            const mode = {
              code: values.code, 
              name: values.name,
              id: modelItem != null ? modelItem.id : null, 
              status: 1, 
              isDeleted: 0
            }
           const {success,data}  = await addOrChange(mode)
            console.log(success,data);
           
            if (data.status != 'Error' && success) {
                setModal2Open(false);
                toast.success(data.message);
                fetchData();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
          toast.error(error)
        }
      };

      const onFinishFailed = () => {}

      const showModel = () => {
        if(modelItem){
          form.setFieldsValue({ code: modelItem.code, name: modelItem.name, description: modelItem.description });
        }
        setModal2Open(true); 
      }
    return ( <>  <div>
        <Button
                type= {isStyle ? "primary" : "button"}
                value="small"
                style={ isStyle ? {
                  alignItems: "center",
                  background: "#1fbf39",
                } : null}
                onClick={() => showModel()}
              >
                {textButton}
              </Button>
  
        <Modal
          width={'50%'}
          title="Create new role  "
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
                  label="Role code"
                  name="code"
                  rules={[{ required: true, message: "Please input category code!" }]}
                >
                  <Input placeholder="Type code auto generate" readOnly={modelItem ? true : false}/>
                </Form.Item>
              </Col>      
            </Row>

            <Row gutter={[16, 16]}>
            <Col span={16}>
                <Form.Item
                  label="Role name"
                  name="name"
                  rules={[{ required: true, message: "Please input role name!" }]}
                >
                  <Input placeholder="Please input role name" />
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

export default RoleAdd;
