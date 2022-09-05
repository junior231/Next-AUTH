import { useEffect } from "react";
import AuthForm from "../components/auth/AuthForm";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Spin, Col, Row } from "antd";

function AuthPage() {
  const { status } = useSession();

  const router = useRouter();
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      }
    });
  }, [router]);

  if (status === "loading") {
    return (
      <Row justify="center" align="middle">
        <Col style={{ marginTop: "50vh" }}>
          <Spin size="large" />
        </Col>
      </Row>
    );
  }
  return (
    <>
      {status !== "unauthenticated" || (status !== "loading" && <AuthForm />)}
    </>
  );
}

export default AuthPage;
