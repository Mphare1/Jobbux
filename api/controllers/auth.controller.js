import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password || !email === "" || !password === "") {
      return  next(errorHandler(400, "All fields are required"));
    }
    try {
        const validuser = await User.findOne({ email });
        if(!validuser) {
           return next(errorHandler(404, "User not found"));
        }
        const isMatch = bcryptjs.compareSync(password, validuser.password);
        if(!isMatch) {
           return next(errorHandler(400, "Invalid credentials"));
        }
        const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validuser._doc;
           res.status(200).cookie('access_token', token, {
            httpOnly: true})
            .json(validuser);
    } catch (error) {
        next(error);
    }

};