// import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
// export const base44 = createClient({
//   appId: "68a1408416ac386dce6778b4",
//   requiresAuth: true // Ensure authentication is required for all operations
// });

// Temporary mock to prevent errors
export const base44 = {
  entities: {
    Item: { findMany: () => Promise.resolve([]) },
    MiniReflection: { findMany: () => Promise.resolve([]) }
  },
  auth: { user: null },
  integrations: {
    Core: {
      InvokeLLM: () => Promise.resolve("Mock response"),
      SendEmail: () => Promise.resolve("Email sent"),
      UploadFile: () => Promise.resolve("File uploaded"),
      GenerateImage: () => Promise.resolve("Image generated"),
      ExtractDataFromUploadedFile: () => Promise.resolve({})
    }
  }
};
