import User from './schemas/userSchema.js';

export const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId }); // Use findOne with a query object
    return user; // Returns user object or null if not found
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Re-throw unexpected errors
  }
};

export const createUserById = async (name, userId, password) => {
  try {
    const user = new User({ name, userId, password });
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const validateUserPassword = async (userId, password) => {
  const user = await getUserById(userId);
  return user.comparePassword(password);
};

export const generateAuthToken = async (userId) => {
  const user = await getUserById(userId);
  return user.generateAuthToken();
};
