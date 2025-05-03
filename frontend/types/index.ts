export interface Product {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Quote {
  id: string
  createdAt: string
  expiresAt: string
  products: Product[]
  notes: string
}

export interface QuoteInput {
  products: Product[]
  notes: string
}
