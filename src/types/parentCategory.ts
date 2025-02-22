import {Category} from './category';

export interface ParentCategory {
    id: number
    name: string
    imageUrl: string
    categories: Category[]
}