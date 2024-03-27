import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {MessageResData} from '../interfaces/Global';
import {Favorites} from '../models';
import {FavoritesRepository} from '../repositories';
import {FavoritesService} from '../services';

export class FavoritesController {
  constructor(
    @repository(FavoritesRepository)
    public favoritesRepository: FavoritesRepository,
    @service(FavoritesService)
    public favoriteService: FavoritesService,
  ) {}

  @post('/favorites')
  @response(200, {
    description: 'Favorites model instance',
    content: {'application/json': {schema: getModelSchemaRef(Favorites)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorites, {
            title: 'NewFavorites',
            exclude: ['id'],
          }),
        },
      },
    })
    favorites: Omit<Favorites, 'id'>,
  ): Promise<MessageResData> {
    return this.favoriteService.create(favorites);
  }

  @get('/favorites')
  @response(200, {
    description: 'Array of Favorites model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Favorites, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Favorites) filter?: Filter<Favorites>,
  ): Promise<Favorites[]> {
    return this.favoritesRepository.find(filter);
  }

  @authenticate('jwt')
  @get('/favorites/{id}/user/{id_user}')
  @response(200, {
    security: OPERATION_SECURITY_SPEC,

    description: 'Favorites model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Favorites, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.path.number('id_user') id_user: number,
  ): Promise<Favorites[]> {
    console.log('PARAMS', {id, id_user});

    return this.favoriteService.findFavorite(id, id_user);
  }
}
