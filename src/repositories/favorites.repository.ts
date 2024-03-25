import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresPokemonDataSource} from '../datasources';
import {Favorites, FavoritesRelations} from '../models';

export class FavoritesRepository extends DefaultCrudRepository<
  Favorites,
  typeof Favorites.prototype.id,
  FavoritesRelations
> {
  constructor(
    @inject('datasources.postgresPokemon') dataSource: PostgresPokemonDataSource,
  ) {
    super(Favorites, dataSource);
  }
}
