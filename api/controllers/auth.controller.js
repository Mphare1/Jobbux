import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    // Check if no field is empty
    if(!username || !email || !password || !password === "" || !email === "" || !username === "") {
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashedpass = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedpass, });
    try
{
    await newUser.save();
    res.json("Signup successful");
}
catch(error) {
    res.status(500).json({ message: error.message });

}
};