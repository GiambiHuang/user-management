const jwt = require('jsonwebtoken');
let jwtSecretKey;

class JwtService {
  constructor() {
    this.jwtSecretKey = jwtSecretKey;
  }

  setConfig(secretKey) {
    jwtSecretKey = secretKey;
  }

  async generateToken(content) {
    return await jwt.sign(content, this.jwtSecretKey);
  }

  async verifyToken(token) {
    try {
      return await jwt.verify(token, this.jwtSecretKey);
    } catch(err) {
      return false;
    }
  }
}

module.exports = JwtService;
