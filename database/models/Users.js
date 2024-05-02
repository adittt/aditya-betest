const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    Id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true,
        unique: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
})

module.exports = mongoose.model('User', usersSchema)
