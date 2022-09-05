import UserProfile from "../components/profile/userProfile/UserProfile";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import { GetServerSideProps } from "next";

function ProfilePage({ session }) {
  return <UserProfile />;
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};

export default ProfilePage;
