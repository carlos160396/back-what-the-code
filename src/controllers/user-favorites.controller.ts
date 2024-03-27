import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {CountSchema, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {MessageRes, MessageResData} from '../interfaces/Global';
import {Favorites, User} from '../models';
import {UserRepository} from '../repositories';
import {FavoritesService} from '../services';

export class UserFavoritesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @service(FavoritesService)
    public favoritesService: FavoritesService,
  ) {}

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
  async find(@param.path.number('id') id: number): Promise<Favorites[]> {
    return this.favoritesService.find(id);
  }

  @authenticate('jwt')
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
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorites, {
            title: 'NewFavoritesInUser',
            exclude: ['id'],
          }),
        },
      },
    })
    favorites: Omit<Favorites, 'id'>,
  ): Promise<MessageResData> {
    return this.favoritesService.create(favorites);
  }

  @del('/users/{id}/favorites', {
    responses: {
      '200': {
        description: 'User.Favorites DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(@param.path.number('id') id: number): Promise<MessageRes> {
    return this.favoritesService.delete(id);
  }
}
