import {Entity, model, property} from '@loopback/repository';

@model()
export class Favorites extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  pokemon: number;

  @property({
    type: 'number',
    required: true,
  })
  id_user: number;

  constructor(data?: Partial<Favorites>) {
    super(data);
  }
}

export interface FavoritesRelations {
  // describe navigational properties here
}

export type FavoritesWithRelations = Favorites & FavoritesRelations;
