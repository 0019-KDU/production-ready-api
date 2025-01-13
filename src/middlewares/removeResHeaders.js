export const removeResHeaders = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
};
