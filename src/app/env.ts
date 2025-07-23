export const env = {
  appwrite: {
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    endPoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    apiKey: String(process.env.APPWRITE_API_KEY),
  },
};