import {service} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
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
  ): Promise<Favorites> {
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

  @get('/favorites/{id}')
  @response(200, {
    description: 'Favorites model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Favorites, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Favorites, {exclude: 'where'})
    filter?: FilterExcludingWhere<Favorites>,
  ): Promise<Favorites> {
    return this.favoritesRepository.findById(id, filter);
  }
}
