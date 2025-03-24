import { Client, Databases, ID,Storage,Account  } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT) // Change to your Appwrite endpoint
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // Replace with your project ID

const databases = new Databases(client);
export const storage = new Storage(client);
export const account=new Account(client)
export { databases, ID };