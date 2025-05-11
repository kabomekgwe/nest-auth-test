import { Redis } from 'ioredis';

async function testRedisConnection() {
  console.log('Testing Redis connection...');

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  });

  try {
    // Test connection
    await redis.ping();
    console.log('Redis connection successful!');

    // Test set and get
    await redis.set('test_key', 'test_value');
    const value = await redis.get('test_key');
    console.log('Test key value:', value);

    // Clean up
    await redis.del('test_key');

    // Close connection
    await redis.quit();
    console.log('Redis connection closed.');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
}

// Run the test
testRedisConnection();
