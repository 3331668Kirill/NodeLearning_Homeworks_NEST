import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../users/user-db-repository';
import { format } from 'date-fns';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

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
      //const decoded: any = jwt.verify(token, 'topSecretKey');
      const decoded: any = this.jwtService.verify(token, {
        secret: 'topSecretKey',
      });
      const user = await this.usersRepository.findUserById(decoded.userId);
      if (!user) {
        throw new NotFoundException('user from jwt data not found');
      } else {
        req.user = user;
        //res.locals.userData = user;
        return true;
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('some error');
    }
  }
}
