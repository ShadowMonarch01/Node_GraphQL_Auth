import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
export const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};
export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: "1d",
    });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    }
    catch (error) {
        return null;
    }
};
