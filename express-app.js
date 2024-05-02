const express = require("express");
const tokens = require("./api/tokens");
const users = require("./api/users");
const user_errors = require('./api/middlewares/user-error')
const { CreateRedisClient } = require('./database/redis_connection')

module.exports = async (app) => {
    app.use(express.json());
    
    const redis = await CreateRedisClient()
    
    tokens(app)
    users(app, redis);

    // error handling
    app.use(user_errors)
};
