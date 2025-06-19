// Update user profile
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
