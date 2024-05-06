import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKeyAdmin =  process.env.SKeyAdmin
const secretKeyUser = process.env.SKeyUser

// auth for Admin side
function authenticationJWTAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKeyAdmin, (err, originString) => {
            if (err) {
                res.status(403).json({ "message": "Admin authorization failed!!" })
            }
            req.user = originString;
            console.log(originString)
            next();
        })
    } else {
        res.status(401).json({ "message": "Admin authorization failed!!" })
    }
}

// auth for User side

function authenticationJWTUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKeyUser, (err, originString) => {
            if (err) {
                res.status(403).json({ "message": "Admin authorization failed!!" })
            }
            req.user = originString;
            // console.log(originString)
            next();
        })
    } else {
        res.status(401).json({ "message": "Admin authorization failed!!" })
    }
}


export {authenticationJWTAdmin,authenticationJWTAdmin}
