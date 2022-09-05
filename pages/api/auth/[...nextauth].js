import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import {
  connectToDatabase,
  disconnectDatabase,
  getExistingUser,
} from "../../../lib/db";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        await connectToDatabase();

        const user = await getExistingUser("users", {
          email: credentials.email,
        });

        if (!user) {
          disconnectDatabase();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          disconnectDatabase();
          throw new Error("Could not log you in");
        }

        disconnectDatabase();
        return { email: user.email };
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    strategy: "jwt",
  },
});
