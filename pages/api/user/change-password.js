import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import {
  connectToDatabase,
  disconnectDatabase,
  getCollection,
  getExistingUser
} from "../../../lib/db";
async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    await connectToDatabase();
    console.log("Connected to Database Successfully");
  } catch (error) {
    res.status(500).json({ message: "Connection to Database Failed" });
    console.log(error);
    return;
  }

  const user = await getExistingUser("users", { email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    disconnectDatabase();
    return;
  }

  const currentPassword = user.password;

  const doPasswordsMatch = await verifyPassword(oldPassword, currentPassword);

  if (!doPasswordsMatch) {
    res.status(403).json({ message: "Invalid Input" });
    disconnectDatabase();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const collection = await getCollection("users");

  const result = await collection.updateOne(
    { email: userEmail },
    {
      $set: { password: hashedPassword },
    }
  );

  disconnectDatabase();
  res.status(200).json({ message: "Password updated" });
}

export default handler;
