const mongoose = require('mongoose')
const { DB_URL } = require('../config')

module.exports = async () => {
    mongoose.connection.once('open', () => {
        console.log('MongoDB connection ready!')
    })
    
    mongoose.connection.on('error', (err) => {
        console.error(err)
    })
    
    await mongoose.connect(DB_URL)
}
