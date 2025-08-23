export type Collection = 'food' | 'recipes' | 'money' | 'vinyls' | 'vinylFolders'

export type FoodType = 'Other' | 'Fridge' | 'Freezer' | 'Cans' | 'Dry Goods' | 'Bread'

export interface Food {
  item: string
  quantity: number
  type: FoodType
  id: string
}

export interface Recipe {
  description: string
  link: string
  id: string
}

export interface Money {
  date: number
  quantity: number
  description: string
  id: string
}

export interface Vinyl {
  title: string
  coverImage: string
  artists: string[]
  year: string
  id: string
  discogsId: number
  folderId: number
}

export interface VinylFolder {
  name: string
  count: number
  id: string
  discogsId: number
}