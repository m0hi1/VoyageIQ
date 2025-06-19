// Check if authentication service is available
const checkStatus = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Authentication service is available',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication service error',
      error: error.message
    });
  }
};

export { checkStatus };
