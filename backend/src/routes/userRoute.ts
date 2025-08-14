import { Elysia } from "elysia";
import { registerController, loginController, getUserProfileController } from "../controllers/userController";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import { generateAccessToken } from "../utils/jwtPassword";
import { refreshTokens } from "../store/tokenStore";
import jwt from "jsonwebtoken";

export function userRoute(app: Elysia) {

    //Refresh route
    app.post("/refresh", ({ cookie, set }) => {
        const refreshToken = cookie?.refreshToken?.value;

        if (!refreshToken) {
            set.status = 401;   
            return { error: "Refresh token missing" };
        }

        if (!refreshTokens.has(refreshToken)) {
            set.status = 403;
            return { error: "Invalid refresh token" };
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
            const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

            return { accessToken: newAccessToken };
        } catch {
            set.status = 403;
            return { error: "Invalid or expired refresh token" };
        }
    })

    // Register route
    app.post("/register", async ({body, set}) => {
        const result = await registerController(body);
        set.status = result.status;
        return result.error || result.data;
    });

    // Login route
    app.post("/login", async ({body, set}) => {
        const result = await loginController(body);
        set.status = result.status;
        return result.error || result.data;
    });

    // Get user profile route (with auth middleware)
    app.get("/users/me", async ({request, set}) => {
        const authResult = await verifyAccessToken({ request, set });
        
        if (authResult.error) {
            return { error: authResult.error };
        }
        
        const result = await getUserProfileController(authResult.user);
        set.status = result.status;
        return result.data;
    });
}