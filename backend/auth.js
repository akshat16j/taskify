const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

function auth(req,res,next){
    const token = req.headers.authorization

    const response = jwt.verify(token,JWT_SECRET)
    const decodedData = jwt.decode(token)

    if(response){
        req.userId = decodedData.userId
        next()
    }else{
        res.json({message:"incorrect-credentials"})
        return
    }

}


module.exports = {
    auth,
    JWT_SECRET
}