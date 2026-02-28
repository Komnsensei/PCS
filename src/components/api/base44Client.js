
// import { base44 } from "/src/api/base44Client";  // Removed for standalone deploy

// Mock base44 for local/Vercel use
const base44 = {
  auth: { me: async () => ({ email: "mock@user.com" }) },
  entities: {
    Profile: { filter: async () => [] },
    Thread: { filter: async () => [] },
  },
};
