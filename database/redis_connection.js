const redis = require('redis')
const { REDIS_HOST, REDIS_PORT } = require('../config')

module.exports.CreateRedisClient = async () => {

    const client = await redis.createClient({
        host: REDIS_HOST,
        port: REDIS_PORT
    })
    .on('error', err => console.log('Redis Client Error', err))
    .on('connect', () => console.log('Redis Client Connected'))
    .connect()

    return client
}
