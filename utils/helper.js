const jwt = require('jsonwebtoken')
const AppError = require('./app-error');
const { APP_SECRET } = require("../config");

module.exports.CheckRedis = async (key, redis) => {
    const cacheData = await redis.hGet(key, 'data')
    
    if (cacheData) {
        return JSON.parse(cacheData)
    }

    return null
}

module.exports.FormatData = (data) => {
    if (data) {
        return { data };
    } else {
        throw new AppError("Data Not found!", 404);
    }
};

module.exports.FormatDataDeleteAction = (data) => {
    if (data.deletedCount == 1) {
        return { data };
    } else {
        throw new AppError("Data Not found!", 404);
    }
};

module.exports.CleanData = (data) => {
    return Object.entries(data)
        .filter(([key, value]) => value !== undefined)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
}

module.exports.ValidateSignature = async (req) => {
    try {
        const signature = req.get("Authorization");
        
        if (!signature) return false

        jwt.verify(signature.split(" ")[1], APP_SECRET);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
