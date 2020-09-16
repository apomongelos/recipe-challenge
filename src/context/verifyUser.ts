import * as jwt from 'jsonwebtoken';

import { User } from '../entity/User';

interface PayloadInterface {
  email: string;
  iat: number;
  exp: number;
}
export const verifyUser = async (req: any) => {
  try {
    req.email = null;
    req.loggedInUserId = null;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.APIKEY || 'mysecretkey');
      req.email = (payload as PayloadInterface).email;
      const user = await User.findOneOrFail({ email: req.email });
      req.loggedInUserId = user.id;
    }
  } catch (error) {
    return error;
  }
};
