const mongoose = require('mongoose');
const UserModel = require('../models/Users');
const { CleanData } = require('../../utils/helper')

class UserRepository {
    
    async createNewUser({ userName, accountNumber, emailAddress,identityNumber }) {
        const newUserData = {
            Id: new mongoose.Types.ObjectId(),
            userName, 
            accountNumber, 
            emailAddress,
            identityNumber
        }
        const user = new UserModel(newUserData)
        const result = await user.save()

        return result
    }
    
    async getAllUser() {
        return await UserModel.find().select('-_id -__v')
    }

    async getUserById(id) {
        return await UserModel.findOne({
            Id: id
        }).select('-_id')
    }
    
    async getByAccountNumber(accNo) {
        return await UserModel.findOne({
            accountNumber: accNo
        }).select('-_id -__v')
    }
    
    async getByIdentityNumber(idNumber) {
        return await UserModel.findOne({
            identityNumber: idNumber
        }).select('-_id -__v')
    }
    
    async updateUser(id, { userName, accountNumber, emailAddress,identityNumber }) {
        
        const updatedData = CleanData({userName, accountNumber, emailAddress,identityNumber})
        
        const result = await UserModel.findOneAndUpdate({ Id: id }, updatedData, {
            new: true
        }).select('-_id')
        
        return result
    }

    async deleteUserById(userId) {
        return await UserModel.deleteOne({
            Id: userId
        })
    }
}

module.exports = UserRepository
