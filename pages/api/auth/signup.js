import {
  connectToDatabase,
  disconnectDatabase,
  insertDocument,
  getExistingUser,
} from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;

  const { email, password } = data;

  try {
    await connectToDatabase();
    console.log("Connected to Database Successfully");
  } catch (error) {
    res.status(500).json({ message: "Connection to Database Failed" });
    console.log(error);
    return;
  }

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        "Invalid input - password should also be at least 7 characters long",
    });
    disconnectDatabase();
    return;
  }

  const existingUser = await getExistingUser("users", { email: email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already" });
    disconnectDatabase();
    return;
  }

  const hashedPasssword = await hashPassword(password);

  try {
    const result = await insertDocument("users", {
      email: email,
      password: hashedPasssword,
    });
    res.status(201).json({ message: "Created User!", status: "success" });
    disconnectDatabase();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Inserting Data Failed", status: "success" });
    console.log(error);
  }

  disconnectDatabase();
}

export default handler;
