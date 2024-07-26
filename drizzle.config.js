/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:gkn8KdDz6FbB@ep-quiet-sea-a1d5w2d4.ap-southeast-1.aws.neon.tech/interview?sslmode=require",
  },
};
