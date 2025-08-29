// import { base44 } from './base44Client';

// Mock base44 object
const base44 = {
  entities: {
    Item: { findMany: () => Promise.resolve([]) },
    MiniReflection: { findMany: () => Promise.resolve([]) }
  },
  auth: { user: null }
};

// Rest of the file stays the same
export const Item = base44.entities.Item;
export const MiniReflection = base44.entities.MiniReflection;
export const User = base44.auth;
