import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthToken} from '../interfaces/User';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {EncryptService} from './encrypt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(EncryptService)
    public encryptService: EncryptService,
  ) {}

  async create(user: Omit<User, 'id'>) {
    this.validateEmailPass({email: user.email, password: user.password});

    const isFind = await this.findUserEmail(user.email);
    if (isFind) throw new HttpErrors.Conflict('User already exists');

    const passEncrypt = await this.encryptService.hashPassword(user.password);

    user.password = passEncrypt;
    const insertUser: Partial<User> = await this.userRepository.create(user);
    const {password, ...data} = insertUser;
    return data;
  }

  validateEmailPass({email, password}: AuthToken) {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s\"]+(\.[^<>()[\]\.,;:\s\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s\"]+\.)+[^<>()[\]\.,;:\s\"]{2,})$/i;

    if (!email.match(emailRegex)) {
      throw new HttpErrors.BadRequest('Invalid email');
    }
    if (password.length <= 4) {
      throw new HttpErrors.BadRequest('Password must be at least 5 characters');
    }
  }

  async findUserEmail(email: string): Promise<User | null> {
    const isExist = await this.userRepository.findOne({where: {email}});
    return isExist;
  }
  async findUserId(id: number): Promise<User | null> {
    const isExist = await this.userRepository.findOne({where: {id}});
    console.log('ISEXISTID', isExist);

    return isExist;
  }

  /*
   * Add service methods here
   */
}
