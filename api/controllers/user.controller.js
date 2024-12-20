import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({ message: "API is working" });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "Forbidden"));
    }

    // Initialize updatedFields object
    const updatedFields = {};

    // Handle password update
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters long"));
        }
        updatedFields.password = await bcrypt.hash(req.body.password, 10);
    }

    // Handle username update
    if (req.body.username) {
        if (req.body.username.length < 6 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be between 6 and 20 characters long"));
        }
        if (req.body.username.includes(" ")) {
            return next(errorHandler(400, "Username must not contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase"));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username must contain only letters and numbers"));
        }
        updatedFields.username = req.body.username;
    }

    // Handle email update
    if (req.body.email) {
        updatedFields.email = req.body.email;
    }

    // Handle profile picture update
    if (req.body.profilePicture) {
        updatedFields.profilePicture = req.body.profilePicture;
    }

    // Perform the update
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: updatedFields }, { new: true });
        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }
        // Exclude the password from the response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (err) {
        return next(errorHandler(400, "Username or Email already exists"));
    }
};


export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, "Forbidden"));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
       next(error);
    }
};
export const signout = (req, res) => {
    try{
        res.clearCookie("access_token").status(200).json("Signout successful");
    }
    catch(error){
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "Forbidden"));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "asc"? 1 : -1;

        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const usersWithoutPassword = users.map(user => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    }
catch (error) {
    next(error);
}
}