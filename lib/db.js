import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://ilo:nextjs@cluster0.xpbxdar.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "auth";

export async function connectToDatabase() {
  await client.connect();
}

export async function getCollection(collectionName) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName)

  return collection
}

export async function getExistingUser(collectionName, searchVal) {
  const db = client.db(dbName);
  const existingUser = db.collection(collectionName).findOne(searchVal);

  return existingUser;
}

export async function insertDocument(collection, document) {
  const db = client.db(dbName);

  const newCollection = db.collection(collection);
  const result = await newCollection.insertOne(document);

  return result;
}

export function disconnectDatabase() {
  client.close();
}
