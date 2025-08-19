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