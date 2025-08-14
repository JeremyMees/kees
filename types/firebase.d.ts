export interface Food {
  item: string
  quantity: number
  id: string
}

export interface Recipe {
  description: string
  link: string
  id: string
}

export interface Money {
  date: number
  quantity: number | string
  description: string
  id: string
}