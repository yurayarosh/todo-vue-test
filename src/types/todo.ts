import { Id } from '.';

export interface ITodo {
  userId: Id;
  id: Id;
  title: string;
  completed: boolean;
}

export enum TodoFilters {
  ALL = 'All',
  COMPLETED = 'Completed',
  UNCOMPLETED = 'Uncompleted',
  FAVORITES = 'Favorites',
}
