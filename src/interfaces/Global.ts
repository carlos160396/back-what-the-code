import {Favorites} from '../models';

export interface MessageRes {
  message: string;
}
export interface MessageResData {
  data: Favorites;
  message: string;
}
