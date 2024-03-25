import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Favorites,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFavoritesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/favorites', {
    responses: {
      '200': {
        description: 'Array of User has many Favorites',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Favorites)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Favorites>,
  ): Promise<Favorites[]> {
    return this.userRepository.favorites(id).find(filter);
  }

  @post('/users/{id}/favorites', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Favorites)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorites, {
            title: 'NewFavoritesInUser',
            exclude: ['id'],
            optional: ['id_user']
          }),
        },
      },
    }) favorites: Omit<Favorites, 'id'>,
  ): Promise<Favorites> {
    return this.userRepository.favorites(id).create(favorites);
  }

  @patch('/users/{id}/favorites', {
    responses: {
      '200': {
        description: 'User.Favorites PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorites, {partial: true}),
        },
      },
    })
    favorites: Partial<Favorites>,
    @param.query.object('where', getWhereSchemaFor(Favorites)) where?: Where<Favorites>,
  ): Promise<Count> {
    return this.userRepository.favorites(id).patch(favorites, where);
  }

  @del('/users/{id}/favorites', {
    responses: {
      '200': {
        description: 'User.Favorites DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Favorites)) where?: Where<Favorites>,
  ): Promise<Count> {
    return this.userRepository.favorites(id).delete(where);
  }
}
