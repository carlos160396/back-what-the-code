import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {JwtService} from './jwt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(JwtService)
    public jwtService: JwtService,
  ) {}

  async create(user: Omit<User, 'id'>) {
    console.log('JWT', this.jwtService.generateToken());

    return this.userRepository.create(user);
  }

  /*
   * Add service methods here
   */
}
