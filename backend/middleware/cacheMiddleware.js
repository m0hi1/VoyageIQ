export const cacheControl = duration => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      res.set('Cache-Control', `public, max-age=${duration}`);
    } else {
      res.set('Cache-Control', 'no-store');
    }
    next();
  };
};
