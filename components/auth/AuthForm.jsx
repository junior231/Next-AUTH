import { useState } from "react";
import styles from "./authForm.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { message, Button, Form, Input, Col, Row, notification } from "antd";

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

const AuthForm = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState();
  const [form] = Form.useForm();
  const [values, setValues] = useState({
    password: "",
    email: "",
  });

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!values.email || !values.email.includes("@")) {
      message.info("Please Enter a valid Email");
      return;
    }
    if (!values.password || values.password.trim().length < 7) {
      message.info("Password Cannot be less than 7 characters");
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result.ok === true) {
        notification.open({
          type: "success",
          duration: 5,
          message: "Success",
          description: "Login Sucessful",
        });
        router.replace("/profile");
      }

      if (result.ok === false) {
        notification.open({
          type: "error",
          duration: 5,
          message: "Error",
          description: "Could not log in",
        });
      }

      setIsLoading(false);
    } else {
      const response = await createUser(values.email, values.password);

      const data = await response.json;

      if (response.ok) {
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
    }

    setValues({
      password: "",
      email: "",
    });
    setIsLoading(false);
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 },
  };

  return (
    <Form onFinish={handleSubmit} form={form} {...formLayout}>
      <Row justify="center">
        <Col
          style={{
            marginTop: "3rem",
            borderRadius: "6px",
            backgroundColor: "#38015c",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
            padding: "1rem",
            textAlign: "center",
          }}
          xs={16}
          lg={12}
          className={styles.control}
        >
          <h1 style={{ textAlign: "center", color: "white" }}>
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          <Form.Item label="Your Email">
            <Input onChange={handleChange} name="email" value={values.email} />
          </Form.Item>
          <Form.Item label="Your Password">
            <Input.Password
              onChange={handleChange}
              value={values.password}
              name="password"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={12} sm={16} lg={8} className={styles.actions}>
          <Button htmlType="submit" size="large" loading={isLoading}>
            {isLogin ? "Login" : "Create Account"}
          </Button>

          <Button
            type="text"
            size="large"
            className={styles.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AuthForm;
