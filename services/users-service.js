const UserRepository = require('../database/repository/user.repository')
const { CheckRedis, FormatData, FormatDataDeleteAction } = require('../utils/helper')

class UserService {

    constructor() {
        this.repository = new UserRepository()
    }

    async createUser({ userName, accountNumber, emailAddress, identityNumber }) {

        const result = await this.repository.createNewUser({
            userName: userName,
            accountNumber: accountNumber,
            emailAddress: emailAddress,
            identityNumber: identityNumber
        })
        
        return result
        
    }
    
    async getAllUser() {
        const userList = await this.repository.getAllUser()
        return userList
    }

    async getUserById(userId, redis) {
        let userData;
        const cacheData = await CheckRedis(`user_id:${userId}`, redis)

        if (cacheData) {
            userData = cacheData
        } else {
            userData = await this.repository.getUserById(userId)
        }
        
        return FormatData(userData)
    }

    async getUserByAccNo(accNo, redis) {
        let userData;
        const cacheData = await CheckRedis(`acc_no:${accNo}`, redis)

        if (cacheData) {
            userData = cacheData
        } else {
            userData = await this.repository.getByAccountNumber(accNo)
        }

        return FormatData(userData)
    }

    async getUserByIdNo(idNo, redis) {
        let userData;
        const cacheData = await CheckRedis(`id_no:${idNo}`, redis)

        if (cacheData) {
            userData = cacheData
        } else {
            userData = await this.repository.getByIdentityNumber(idNo)
        }

        return FormatData(userData)
    }
    
    async updateUser(userId, newData, redis) {
        const result = await this.repository.updateUser(userId, newData)
        const redisKeys = [
            `user_id:${result.Id}`, 
            `acc_no:${result.accountNumber}`, 
            `id_no:${result.identityNumber}`
        ]

        const cacheDataId = await CheckRedis(redisKeys[0], redis)
        const cacheDataAccNo = await CheckRedis(redisKeys[1], redis)
        const cacheDataIdNo = await CheckRedis(redisKeys[2], redis)

        // update all cache if exist
        if (cacheDataId) {
            await redis.hSet(redisKeys[0], 'data', JSON.stringify(result))
        }
        if (cacheDataAccNo) {
            await redis.hSet(redisKeys[1], 'data', JSON.stringify(result))
        }
        if (cacheDataIdNo) {
            await redis.hSet(redisKeys[2], 'data', JSON.stringify(result))
        }

        return result
    }

    async deleteUser(userId, redis) {
        const userData = await this.repository.getUserById(userId)

        if (!userData) return FormatData(userData)

        const result = await this.repository.deleteUserById(userId)

        // delete all user cache
        await redis.del(`user_id:${userId}`)
        await redis.del(`acc_no:${userData.accountNumber}`)
        await redis.del(`id_no:${userData.identityNumber}`)
        
        return FormatDataDeleteAction(result)
    }
}

module.exports = UserService
