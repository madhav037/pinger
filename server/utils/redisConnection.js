import { client } from "../index.js";

export const checkRedisConnection = async () => {
    try {
        await client.ping(); // Sends a ping to Redis
        console.log("✅ Redis is connected.");
        return true;
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
        return false;
    }
};