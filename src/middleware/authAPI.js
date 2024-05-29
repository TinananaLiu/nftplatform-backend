import pkg from "jsonwebtoken";
import dotenv from "dotenv";

const { verify } = pkg;
dotenv.config();

function authJWT(req, res, next) {
  const token = req.headers.authorization;
  console.log(token)
  const tmp = token.split(' ')[1]  // for postman API calls


  if (!token) {
    return res.status(401).json({ error: 'Unauthorization' });
  }
  verify(tmp, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = payload;
    next();
  });
}

export default authJWT

