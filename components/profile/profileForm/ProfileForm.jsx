import { useState } from "react";
import styles from "./profileForm.module.css";
import { message, Button, Form, Input, Col, Row, notification } from "antd";

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [form] = Form.useForm();

  const handleOnChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (formData.newPassword.length <= 6 || formData.oldPassword.length <= 6) {
      message.info("Password Cannot be less than 7 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok === true) {
        notification.open({
          type: "success",
          duration: 5,
          message: "Success",
          description: data.message,
        });
      }

      if (response.ok === false) {
        notification.open({
          type: "error",
          duration: 5,
          message: "Error",
          description: data.message,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

    setFormData({
      oldPassword: "",
      newPassword: "",
    });
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <>
      <Form form={form} onFinish={handleSubmit} {...formLayout}>
        <Row justify="center">
          <Col xs={12} sm={20} lg={16} className={styles.control}>
            <Form.Item
              label="New Password"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input.Password
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleOnChange(e)}
              />
            </Form.Item>

            <Form.Item
              label="Old Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                name="oldPassword"
                value={formData.oldPassword}
                onChange={(e) => handleOnChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col>
            <Form.Item>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ProfileForm;
