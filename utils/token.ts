
import 'dotenv/config'

import jwt from "jsonwebtoken";


class authToken {
  createToken = async function ({email,userId, status}:{email: string,userId: string, status: string}) {
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    let expiredAt = new Date().getSeconds() + maxAge;

    let token = jwt.sign(
      { email, userId , status},
      process.env.JWT_SIGN!,
      { expiresIn: expiredAt }
    );

    return { token, expiredAt };
  };

}

export default new authToken();
