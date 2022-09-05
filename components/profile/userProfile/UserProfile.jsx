import ProfileForm from "../profileForm/ProfileForm";
import styles from "./userProfile.module.css";
import { Typography, Grid } from "antd";
import { useSession } from "next-auth/react";

const { useBreakpoint } = Grid;
const { Title } = Typography;

const UserProfile = () => {
  const screens = useBreakpoint();
  const { status } = useSession();

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
      <section className={styles.profile}>
        <Title
          style={{ marginBottom: 30 }}
          level={screens.xs ? 4 : screens.md ? 3 : 1}
        >
          User Profile
        </Title>

        <ProfileForm />
      </section>
    </>
  );
};

export default UserProfile;
