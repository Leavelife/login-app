import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtPassword";
import { z } from "zod";
import { refreshTokens } from "../store/tokenStore";



const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

// Register Controller
export const registerController = async (body: any) => {
    const parsed = registerSchema.safeParse(body);
    if(!parsed.success) {
        return { status: 400, error: parsed.error };
    }

    const {name, email, password} = parsed.data;
    const existUser = await prisma.user.findUnique({where: {email}});
    if(existUser) {
        return { status: 400, error: "email already exist!" };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
        data: {name, email, password: hashedPassword}
    });

    return { 
        status: 201, 
        data: {message: "user registered", user: {id: newUser.id, email: newUser.email}}
    };
};

// Login Controller
export const loginController = async (body: any) => {
    const parsed = loginSchema.safeParse(body);
    if(!parsed.success) {
        return { status: 400, error: parsed.error };
    }
    
    const {email, password} = parsed.data;
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        return { status: 400, error: "User not found!" };
    }
    
    const match = await comparePassword(password, user.password);
    if(!match) {
        return { status: 400, error: "Invalid credentials" };
    }
    
    const accessToken = generateAccessToken({id: user.id, email: user.email});
    const refreshToken = generateRefreshToken({id: user.id, email: user.email});
    
    refreshTokens.add(refreshToken);


    return {
        status: 200,
        data: {
            message: "Login successful",
            accessToken,
            refreshToken
        }
    };
};

// Get User Profile Controller
export const getUserProfileController = async (user: any) => {
    return {
        status: 200,
        data: {
            message: "user data fetched successfully", 
            data: user
        }
    };
};