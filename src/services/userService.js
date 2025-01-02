import {
  getUserById,
  createUserById,
  validateUserPassword,
  generateAuthToken,
} from "../repositories/userRepository.js";

export const register = async (req, res) => {
  const { name, userId, password } = req?.body;

  try {
    // Check if the user already exists by userId
    const checkExistingUser = await getUserById(userId);
    if (checkExistingUser) {
      return res.status(409).send("User already exists");
    }

    // Create the new user
    const newUser = await createUserById(name, userId, password);
    if (!newUser) {
      return res.status(500).send("Failed to create user");
    }

    // Send back the new user information
    return res.status(200).json(newUser);
  } catch (error) {
    // Catch unexpected errors and send a 500 status code
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const login = async (req, res) => {
  const { userId, password } = req?.body;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send("User ID or password did not match");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(404).send("User ID or password did not match");
    }

    const token = user.generateAuthToken();
    if (!token) {
      return res.status(500).json({ message: "Could not log in user" });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};
