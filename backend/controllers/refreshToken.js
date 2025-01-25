import jwt from "jsonwebtoken"
import Users from "../models/users.js";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)   //unauthorized
        const user = await Users.findAll({
            where: {
                refreshToken: refreshToken
            }
        })
        if (!user[0]) return res.sendStatus(403)    //forbidden
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403)  //forbidden
            const userId = user[0].id
            const username = user[0].username
            const email = user[0].email
            const accesToken = jwt.sign({userId, username, email}, process.env.ACCES_TOKEN, {
                expiresIn: '15s'
            })
            res.json({accesToken})
        })
    } catch (error) {
        console.log(error)
    }
}