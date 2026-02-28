import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    console.log('RefreshTokenStrategy.validate called');
    console.log('Payload:', { sub: payload.sub, email: payload.email });

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('No authorization header found in request');
      throw new UnauthorizedException('No authorization header found');
    }

    const refreshToken = authHeader.substring(7);
    if (!refreshToken) {
      console.error('No refresh token found in authorization header');
      throw new UnauthorizedException('No refresh token found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid, refresh token does not match');
    }

    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
