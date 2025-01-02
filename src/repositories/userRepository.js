import User from "./schemas/userSchema.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    console.log("User not found", userId);
  }
  return user;
};

export const createUserById = async (name, userId, password) => {
  const user = new User({ name, userId, password });
  await user.save();
  return user;
};

export const validateUserPassword = async (userId, password) => {
  const user = await getUserById(userId);
  return user.comparePassword(password);
};

export const generateAuthToken = async (userId) => {
  const user = await getUserById(userId);
  return user.generateAuthToken();
};
