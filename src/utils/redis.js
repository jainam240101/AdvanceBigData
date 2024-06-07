const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379", // Default URL for local Redis server
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

client.on("connect", () => {
  console.log("Connected to Redis!");
});

async function testRedis() {
  try {
    // Connect to Redis
    await client.connect();

    // Set a value
    await client.set("key", "value");

    // Get the value
    const value = await client.get("key");
    console.log("Value from Redis:", value);
  } catch (err) {
    console.error("Redis error:", err);
  }
}

const addDataToRedis = async (key, value) => {
  try {
    const result = await client.set(key, JSON.stringify(value), { NX: true });
    if (result === null) {
      throw new Error(`Key ${key} already exists.`);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getDataFromRedis = async (key) => {
  try {
    const result = await client.get(key);
    if (result === null) {
      throw new Error(`Key ${key} does not exist.`);
    }
    return JSON.parse(result);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteDataFromRedis = async (key) => {
  try {
    const result = await client.del(key);
    if (result === 0) {
      throw new Error(`Key ${key} does not exist.`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  testRedis,
  addDataToRedis,
  getDataFromRedis,
  deleteDataFromRedis,
};
