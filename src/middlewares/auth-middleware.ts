import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';
import { UsersRepository } from '../users/user-db-repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export const authMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  const usersRepository = new UsersRepository();
  format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  if (!req.headers || !req.headers.authorization) {
    throw new UnauthorizedException();
  }
  const authorizationData = req.headers.authorization.split(' ');
  const token = authorizationData[1];
  const tokenName = authorizationData[0];
  if (tokenName != 'Bearer') {
    throw new UnauthorizedException();
  }
  try {
    debugger;
    const decoded: any = jwt.verify(token, 'topSecretKey');
    const user = await usersRepository.findUserById(decoded.userId);
    if (!user) {
      throw new NotFoundException('user from jwt data not found');
    }
    req.user = user;
    res.locals.userData = user;
  } catch (e) {
    console.log(e);
    throw new UnauthorizedException('some error');
  }
  next();
};
