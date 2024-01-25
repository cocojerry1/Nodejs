

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (err.message.includes("Cast to ObjectId failed")) {
      res.status(500).json({ errorMessage: '서버 오류' });
    } else {
      res.status(500).json({ errorMessage: err.message || '서버 오류' });
    }
  });
};




export default asyncMiddleware;
