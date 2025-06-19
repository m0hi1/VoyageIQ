import User from '../models/User.js';
import { isValidObjectId } from '../utils/validators.js';
import bcryptjs from 'bcryptjs'; // For password updates

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    // Add pagination later if needed
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('Get Single User Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID format' });
    }

    const { username, email, photo, role, password } = req.body;

    // Fields to update
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (photo) updateFields.photo = photo;

    // Only admin can change role
    if (role && req.user.role === 'admin') {
      updateFields.role = role;
    } else if (role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Forbidden: You cannot change user roles.',
        });
    }

    // Handle password update
    if (password) {
      if (password.length < 6) {
        // Example: Minimum password length
        return res
          .status(400)
          .json({
            success: false,
            message: 'Password must be at least 6 characters long.',
          });
      }
      const salt = await bcryptjs.genSalt(10);
      updateFields.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true, // Return the modified document
        runValidators: true, // Run schema validators
      }
    ).select('-password');

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    if (error.code === 11000) {
      // Handle duplicate key errors (e.g., username or email already exists)
      return res
        .status(400)
        .json({ success: false, message: 'Username or email already taken.' });
    }
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID format' });
    }

    // Prevent users from deleting themselves if they are the last admin (optional, complex logic)
    // For simplicity, this is not implemented here.

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null, // Or return the deleted user's ID
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Create a new user (Admin only)
const adminCreateUser = async (req, res) => {
  try {
    const { username, email, password, photo, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: 'Username, email, password, and role are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists with this email or username.' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo,
      role, // Admin sets the role
    });

    await newUser.save();

    // Don't send password back
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully by admin.',
      data: userResponse,
    });
  } catch (error) {
    console.error('Admin Create User Error:', error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Username or email already taken.' });
    }
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Update user's own profile
const updateProfile = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Extract update fields from request body
    const { username, email, currentPassword, newPassword } = req.body;
    
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Prepare update object
    const updateData = {};
    
    // Check if username is being updated
    if (username && username !== user.username) {
      // Check if username is already taken
      const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      updateData.username = username;
    }
    
    // Check if email is being updated
    if (email && email !== user.email) {
      // Only allow email updates for non-Google users
      if (user.authProvider === 'google') {
        return res.status(400).json({
          success: false,
          message: 'Email cannot be changed for Google-authenticated accounts',
        });
      }
      
      // Check if email is already taken
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use',
        });
      }
      updateData.email = email;
    }
    
    // Handle password update if provided
    if (newPassword) {
      // Password updates are not allowed for Google users
      if (user.authProvider === 'google') {
        return res.status(400).json({
          success: false,
          message: 'Password cannot be changed for Google-authenticated accounts',
        });
      }
      
      // Verify current password
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to update password',
        });
      }
      
      const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
      
      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(newPassword, salt);
    }
    
    // If no updates were provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update information provided',
      });
    }
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // Return the updated document
    ).select('-password'); // Don't return password
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export { getAllUsers, getSingleUser, updateUser, deleteUser, adminCreateUser, updateProfile };
