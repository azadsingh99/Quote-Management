"use client"

import React, { useState } from 'react';
import { useToast } from '../hooks/use-toast';

import type { Product } from "../types"

interface QuoteFormProps {
  onSubmit: (products: Product[], notes: string) => void
  isSubmitting: boolean
  initialProducts?: Product[]
  initialNotes?: string
}

export default function QuoteForm({ onSubmit, isSubmitting, initialProducts = [], initialNotes = "" }: QuoteFormProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(
    initialProducts.length > 0 ? initialProducts : [{ 
      productId: `prod_${Date.now()}`, 
      name: "", 
      quantity: 1,
      price: 0
    }],
  )
  const [notes, setNotes] = useState(initialNotes)

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    }
    setProducts(updatedProducts)
  }

  const addProduct = () => {
    setProducts([...products, { 
      productId: `prod_${Date.now()}${Math.floor(Math.random() * 1000)}`, 
      name: "", 
      quantity: 1,
      price: 0
    }])
  }

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const updatedProducts = [...products]
      updatedProducts.splice(index, 1)
      setProducts(updatedProducts)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const validProducts = products.filter((p) => p.name.trim() !== "")
    if (validProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one product with a name"
      });
      return;
    }

    onSubmit(validProducts, notes)
  }

  return (
    <form className="quoteform-form" onSubmit={handleSubmit}>
      <h2 className="quoteform-label" style={{fontSize:'2rem',fontWeight:800,marginBottom:'1.5rem'}}>Products</h2>
      {products.map((product, index) => (
        <div key={index} className="quoteform-row">
          <div className="quoteform-field">
            <label className="quoteform-label" htmlFor={`product-name-${index}`}>Product Name</label>
            <input
              id={`product-name-${index}`}
              type="text"
              value={product.name}
              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              placeholder="Enter product name"
              className="quoteform-input"
              required
            />
          </div>
          <div className="quoteform-field">
            <label className="quoteform-label" htmlFor={`product-qty-${index}`}>Quantity</label>
            <input
              id={`product-qty-${index}`}
              type="number"
              min={1}
              value={product.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
              className="quoteform-input"
              required
            />
          </div>
          <div className="quoteform-field">
            <label className="quoteform-label" htmlFor={`product-price-${index}`}>Price</label>
            <input
              id={`product-price-${index}`}
              type="number"
              min={0}
              step="0.01"
              value={product.price}
              onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
              className="quoteform-input"
              required
            />
          </div>
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="quoteform-btn danger"
            disabled={products.length === 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addProduct} className="quoteform-btn add">Add Another Product</button>
      <div>
        <label className="quoteform-label" htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="quoteform-textarea"
          placeholder="Add any additional notes here..."
        />
      </div>
      <div className="quoteform-actions">
        <button type="submit" className="quoteform-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Quote"}
        </button>
        <button type="button" onClick={() => window.history.back()} className="quoteform-btn secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
