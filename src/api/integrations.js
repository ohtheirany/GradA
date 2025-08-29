// import { base44 } from './base44Client';

// Mock integrations
const base44 = {
  integrations: {
    Core: {
      Core: () => Promise.resolve("Mock core"),
      InvokeLLM: () => Promise.resolve("Mock LLM response"),
      SendEmail: () => Promise.resolve("Email sent"),
      UploadFile: () => Promise.resolve("File uploaded"),
      GenerateImage: () => Promise.resolve("Image generated"),
      ExtractDataFromUploadedFile: () => Promise.resolve({})
    }
  }
};

// Rest stays the same but now uses mocked functions
export const Core = base44.integrations.Core;
export const InvokeLLM = base44.integrations.Core.InvokeLLM;
export const SendEmail = base44.integrations.Core.SendEmail;
export const UploadFile = base44.integrations.Core.UploadFile;
export const GenerateImage = base44.integrations.Core.GenerateImage;
export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;
