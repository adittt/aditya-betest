const UserService = require('../services/users-service')
const { CleanData } = require('../utils/helper')
const UserAuth = require('./middlewares/auth')

module.exports = (app, redis) => {

    const service = new UserService()

    app.post('/users', UserAuth, async (req, res, next) => {
        try {
            const { userName, accountNumber, emailAddress, identityNumber } = req.body
            
            const result = await service.createUser({ userName, accountNumber, emailAddress, identityNumber })
            return res.status(201).json({ message: 'New User Created' })
        } catch (err) {
            next(err)
        }
    })
    
    app.get('/users', UserAuth, async (req, res, next) => {
        try {
            const data = await service.getAllUser()
            return res.status(200).json(data);
        } catch(err) {
            next(err)
        }
    })
    
    app.get('/users/:id', UserAuth, async (req, res, next) => {
        try {
            const userId = req.params.id
            const data = await service.getUserById(userId, redis)
            await redis.hSet(`user_id:${userId}`, 'data', JSON.stringify(data.data))

            return res.status(200).json(data);
        } catch(err) {
            console.log(err)
            next(err)
        }
    })
    
    app.get('/users/accountNo/:accNo', UserAuth, async (req, res, next) => {
        try {
            const accNo = req.params.accNo
            const data = await service.getUserByAccNo(accNo, redis)
            await redis.hSet(`acc_no:${accNo}`, 'data', JSON.stringify(data.data))

            return res.status(200).json(data);
        } catch(err) {
            next(err)
        }
    })
    
    app.get('/users/identityNo/:idNo', UserAuth, async (req, res, next) => {
        try {
            const idNo = req.params.idNo
            const data = await service.getUserByIdNo(idNo, redis)
            await redis.hSet(`id_no:${idNo}`, 'data', JSON.stringify(data.data))

            return res.status(200).json(data);
        } catch(err) {
            console.log(err)
            next(err)
        }
    })
    
    app.patch('/users/:id', UserAuth, async (req, res, next) => {
        try {
            const userId = req.params.id
            const { userName, accountNumber, emailAddress, identityNumber } = req.body

            const cleanedObj = CleanData({ userName, accountNumber, emailAddress, identityNumber })
            
            if (Object.keys(cleanedObj).length < 1) {
                return res.status(400).json({ message: 'At least 1 field is required!' })
            }
            
            const result = await service.updateUser(userId, cleanedObj, redis)

            if (!result) {
                return res.status(404).json({ message: 'Not Found!' });
            }
            
            return res.status(200).json({ message: 'Data Updated!' });
        } catch (err) {
            console.log(err)
            next(err)
        }
    })

    app.delete('/users/:id', UserAuth, async (req, res, next) => {
        try {
            const userId = req.params.id
            const data = await service.deleteUser(userId, redis)
            return res.status(200).json({ message: 'Data Deleted!' });
        } catch(err) {
            console.log(err)
            next(err)
        }
    })
    
}
