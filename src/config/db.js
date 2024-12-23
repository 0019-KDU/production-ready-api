import mongoose from "mongoose";

const connect = async (dbName) => {
  try {
    let connectionString = process.env.MONGO_URI || "";
    if (connectionString === "") {
      throw new Error(
        "No MongoDB connection string found. Please set MONGO_URI environment variable."
      );
    }

    // Replace {1} with the database name in the connection string
    connectionString = connectionString.replace("{1}", dbName);

    // Connect to MongoDB
    await mongoose.connect(connectionString);

    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connect;
