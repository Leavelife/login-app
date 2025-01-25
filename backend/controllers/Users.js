import Users from "../models/users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'username', 'email']
        })
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}
 export const Register = async (req, res) => {
    const {username, email, password, confirmPassword} = req.body
    if (password != confirmPassword) return res.status(400).json({msg: 'password tidak sama'})
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword
        })  
        res.json({message: 'register berhasil'})
    } catch (error) {
        console.log(error)
    }
}
export async function Login(req, res) {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(400).json({msg: 'password salah'})
        
            const userId = user[0].id
            const username = user[0].username
            const email = user[0].email
            const accesToken = jwt.sign({userId, username, email}, process.env.ACCES_TOKEN, {
                expiresIn: '30s'
            })
            const refreshToken = jwt.sign({userId, username, email}, process.env.REFRESH_TOKEN, {
                expiresIn: '1d'
            })
            await Users.update({refreshToken, refreshToken}, {
                where: {
                    id: userId
                }
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({accesToken})
        } catch (error) {
        res.status(404).json({msg: 'email tidak ada'})
        console.log(error)
    }
}
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204)   //no-content
    const user = await Users.findAll({
        where: {
            refreshToken: refreshToken
        }
    })
    if (!user[0]) return res.sendStatus(204)    //no-content
    const userId = user[0].id
    await Users.update({refreshToken: null}, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({message: 'logout berhasil'})
}