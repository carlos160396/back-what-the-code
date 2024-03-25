import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresPokemonDataSource} from '../datasources';
import {User, UserRelations, Favorites} from '../models';
import {FavoritesRepository} from './favorites.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly favorites: HasManyRepositoryFactory<Favorites, typeof User.prototype.id>;

  constructor(
    @inject('datasources.postgresPokemon')
    dataSource: PostgresPokemonDataSource, @repository.getter('FavoritesRepository') protected favoritesRepositoryGetter: Getter<FavoritesRepository>,
  ) {
    super(User, dataSource);
    this.favorites = this.createHasManyRepositoryFactoryFor('favorites', favoritesRepositoryGetter,);
    this.registerInclusionResolver('favorites', this.favorites.inclusionResolver);
  }
}
