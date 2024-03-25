import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Favorites} from '../models';
import {FavoritesRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class FavoritesService {
  constructor(
    @repository(FavoritesRepository)
    public favoritesRepository: FavoritesRepository,
  ) {}

  async create(favorites: Omit<Favorites, 'id'>) {
    return this.favoritesRepository.create(favorites);
  }

  /*
   * Add service methods here
   */
}
