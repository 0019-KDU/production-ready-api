import {
  getUserById,
  createUserById,
  validateUserPassword,
  generateAuthToken,
} from "../repositories/userRepository.js";

export const register = async (req, res) => {
  const { name, userId, password } = req?.body;
  const checkExistingUser = await getUserById(userId);
  if (checkExistingUser) {
    res.status(409).send("User already exists");
    return;
  }
  const newUser = await createUserById(name, userId, password);

  if (!newUser) {
    res.status(500).send("Failed to create user");
    return;
  }

  res.status(200).json(newUser);
};

export const login = async (req, res) => {
  const { userId, password } = req?.body;
  const checkExistingUser = await getUserById(userId);
  if (!checkExistingUser) {
    res.status(404).send("user id or password did not match");
    return;
  }

  const isValidPassword = await validateUserPassword(userId, password);

  if (!isValidPassword) {
    res.status(404).send("user id or password did not match");
    return;
  }

  const token = await generateAuthToken(userId);
  if (!token) {
    res.status(500).json({ message: "could not login in user" });
    return;
  }

  res.status(200).json({ token });
};
