// src/api/base44Client.js
// Standalone mock for Vercel/local deploy (replaces proprietary Base44 SDK)
export default {
auth: {
me: async () => {
try {
return {
email: "mock@shawn.reddeer",
full_name: "Shawn Robertson",
role: "user", // change to "admin" for testing admin features
};
} catch (error) {
console.error("Mock auth failed:", error);
throw error;
}
},
},
entities: {
Profile: {
filter: async (query) => {
console.log("Mock Profile filter called with:", query);
return []; // No profiles in mock mode
},
},
Thread: {
filter: async (query) => {
console.log("Mock Thread filter called with:", query);
return []; // No threads in mock mode
},
},
},
};
