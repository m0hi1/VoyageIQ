import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is required unless user is authenticated via Google
        return !this.googleId;
      },
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'guide'],
      default: "user",
    },
    googleId: {
      type: String,
      sparse: true, // Sparse index allows multiple null values
    },
    firebaseUid: {
      type: String,
      sparse: true, // Sparse index allows multiple null values
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Update lastLogin timestamp on every document retrieval for login
userSchema.pre('findOne', function(next) {
  // Check if this is for authentication
  if (this._conditions.email && (this._fields && this._fields.password)) {
    this._fields.lastLogin = 1; // Include lastLogin in fields to return
  }
  next();
});

export default mongoose.model("User", userSchema);
