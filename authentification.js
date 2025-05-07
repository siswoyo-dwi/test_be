async function authentification(req, res, next) {
    try {      
      const token = req.headers.authorization?.split(' ')[1];
      const decode = token === 'Fosan132@';
  
      if (decode) {
        next();
      } else {
        res.status(401).json({ status: 204, message: 'wrong token' });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ status: 204, message: 'wrong token' });
    }
  }
  
  module.exports = authentification;
  