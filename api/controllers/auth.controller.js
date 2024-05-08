import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    // Check if no field is empty
    if(!username || !email || !password || !password === "" ||
    !email === "" || !username === "") {
    next(errorHandler(400, "All fields are required"));
    }
    const hashedpass = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedpass, });
    try
{
    await newUser.save();
    res.json("Signup successful");
}
catch(error) {
    next(error);

}
};