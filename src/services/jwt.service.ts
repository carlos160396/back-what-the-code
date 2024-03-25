import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {
  /* inject, */ BindingScope,
  inject,
  injectable,
  service,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {AuthToken} from '../interfaces/User';
import {User} from '../models';
import {EncryptService} from './encrypt.service';
import {UserService} from './user.service';

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  constructor(
    @service(UserService)
    public userService: UserService,
    @service(EncryptService)
    public encryptService: EncryptService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}

  async auth(authToken: AuthToken) {
    const user = await this.validateToken(authToken);
    const userProfile = await this.securituUserProfile(user!);
    const token = await this.tokenService.generateToken(userProfile);
    return {
      token,
      id: user!.id,
      name: user!.name,
    };
  }

  securituUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async validateToken({email, password}: AuthToken): Promise<User | null> {
    const isFind = await this.userService.findUserEmail(email);
    const isPasswordSame = await this.encryptService.comparePassword(
      password,
      isFind?.password ?? '',
    );
    if (!isPasswordSame)
      throw new HttpErrors.NotFound('Incorrect user or password');
    return isFind;
  }
}
