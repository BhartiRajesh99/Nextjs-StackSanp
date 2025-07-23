import {Avatars, Client, Databases, Storage, Users} from "node-appwrite";
import { env } from "@/app/env";

let client = new Client();

client
  .setEndpoint(env.appwrite.endPoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apiKey) // Your secret API key


const databases = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)
const users = new Users(client)

export { client, databases, avatars, storage, users }