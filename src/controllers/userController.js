import { userLogin, userRegister } from "../services/userService.js";

export const register = async (req, res) => {
    const userData = req.body;

    try {
        const user = await userRegister(userData);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: user
        })
    } catch (error) {
        // throw new Error(`Registration failed: ${error.message}`);
        // console.log(error);
        res.status(500).json({
            success: false,
            message: `Registration failed: ${error.message}`
        })
    }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const { user, token } = await userLogin({ email, password });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // send over HTTPS only in prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        user,
        token
      });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiry to past date
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logout successful" });
};

export const getCurrentUser = async (req, res) => {
  // req.user is set by the protect middleware
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { _id, name, email} = req.user;

  res.status(200).json({
    id: _id,
    name,
    email,
  });
};
