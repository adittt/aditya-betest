const jwt = require('jsonwebtoken')
const { APP_SECRET } = require("../config");

module.exports = (app) => {

    app.get('/getToken', async (req, res, next) => {
        try {
            const token = jwt.sign(
                { name:'BETEST' }, 
                APP_SECRET,
                { expiresIn: '1d' }
            )

            return res.status(200).json({ token: token });
        } catch(err) {
            next(err)
        }
    })
    
}
