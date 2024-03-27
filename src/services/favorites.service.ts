import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MessageRes, MessageResData} from '../interfaces/Global';
import {Favorites} from '../models';
import {FavoritesRepository, UserRepository} from '../repositories';
import {UserService} from './user.service';

@injectable({scope: BindingScope.TRANSIENT})
export class FavoritesService {
  constructor(
    @repository(FavoritesRepository)
    public favoritesRepository: FavoritesRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(UserService)
    public userService: UserService,
  ) {}

  async create(favorites: Omit<Favorites, 'id'>): Promise<MessageResData> {
    const {id_user, pokemon} = favorites;
    const isFind = await this.userService.findUserId(id_user);
    if (!isFind) throw new HttpErrors.Conflict('User not found');
    await this.findOneFavorite(pokemon, id_user);

    await this.favoritesRepository.create(favorites);
    return {
      data: favorites,
      message: 'This pokemon added to your favorites',
    };
  }

  async find(id: number): Promise<Favorites[]> {
    const res = await this.userRepository.favorites(id).find();
    return res;
  }

  async findFavorite(id: number, id_user: number): Promise<Favorites[]> {
    return this.favoritesRepository.find({where: {pokemon: id, id_user}});
  }

  async delete(id: number): Promise<MessageRes> {
    await this.favoritesRepository.deleteById(id);
    return {
      message: 'This pokemon is not your favorite',
    };
  }

  async findOneFavorite(pokemon: number, id_user: number) {
    const findPokemon = await this.favoritesRepository.findOne({
      where: {pokemon, id_user},
    });
    if (findPokemon)
      throw new HttpErrors.BadRequest('This pokemon is your favorite');
    return findPokemon;
  }
}
