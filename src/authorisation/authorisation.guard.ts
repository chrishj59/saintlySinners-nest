import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { auth, InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  ISSUER_BASE_URL = this.configService.get('ISSUER_BASE_URL');
  AUDIENCE = this.configService.get('AUDIENCE');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    ///console.log(request);
    const validateAccessToken = promisify(auth());

    try {
      console.log('AuthorizationGuard canActivate request');
      //console.log(request);
      await validateAccessToken(request, response);
      console.log('after validateAccessToken');
      return true;
    } catch (error) {
      console.log(`Auth error: ${error}`);
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication');
      }

      throw new InternalServerErrorException();
    }
  }
}
