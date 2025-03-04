import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

// Define the schema for the User collection in MongoDB
const userSchema = new Schema(
  {
    image: String,
    mail: {
      type: String,
      required: true,
      unique: true // Enforce uniqueness to avoid duplicate emails
    },
    name: String,
    title: String,
    educations: [String]
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps to each document
);

// Infer TypeScript type for the schema
// `InferSchemaType<typeof userSchema>` generates the type based on the schema definition
export type UserType = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

// Create a Mongoose model for the User schema
// This model provides an interface to interact with the "User" collection in MongoDB
const User = model<UserType>("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
