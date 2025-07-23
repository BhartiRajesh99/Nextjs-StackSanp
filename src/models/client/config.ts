import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import { env } from "@/app/env";

const client = new Client()
  .setEndpoint(env.appwrite.endPoint) // Your API Endpoint
  .setProject(env.appwrite.projectId); // Your project ID

const account = new Account(client);
const databases = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export {account, client, databases, avatars, storage }