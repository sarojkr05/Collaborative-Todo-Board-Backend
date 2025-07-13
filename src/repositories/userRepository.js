import User from "../models/userModel.js"

export const findUserByEmail = async (email)  => {
    try {
        const user = await User.findOne({ email: email});
        return user;
    } catch (error) {
        throw new Error(`Error finding user by email: ${error.message}`);
    }
}

export const createUser = async (userData) => {
    try {
        const user = User.create(userData);
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}