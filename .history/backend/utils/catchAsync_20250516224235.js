/**
 * Catch async errors in controller functions and pass to error handler
 * Eliminates need for try/catch blocks in controllers
 * 
 * @param {Function} fn - Controller function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
