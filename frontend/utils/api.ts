import type { Quote, QuoteInput } from "../types"

const API_URL = "http://localhost:3001"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || "API request failed")
  }
  return response.json()
}

// Fetch all quotes
export async function fetchQuotes(): Promise<Quote[]> {
  const response = await fetch(`${API_URL}/quotes`, {
    headers: {
      Authorization: "Bearer stub-token", // JWT auth stub
    },
  })
  return handleResponse(response)
}

// Fetch a single quote by ID
export async function fetchQuote(id: string): Promise<Quote> {
  const response = await fetch(`${API_URL}/quotes/${id}`, {
    headers: {
      Authorization: "Bearer stub-token", // JWT auth stub
    },
  })
  return handleResponse(response)
}

// Create a new quote
export async function createQuote(quoteData: QuoteInput): Promise<Quote> {
  const response = await fetch(`${API_URL}/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer stub-token", // JWT auth stub
    },
    body: JSON.stringify(quoteData),
  })
  return handleResponse(response)
}

// Update an existing quote
export async function updateQuote(id: string, quoteData: QuoteInput): Promise<Quote> {
  const response = await fetch(`${API_URL}/quotes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer stub-token", // JWT auth stub
    },
    body: JSON.stringify(quoteData),
  })
  return handleResponse(response)
}

// Delete a quote
export async function deleteQuote(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/quotes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer stub-token", // JWT auth stub
    },
  })
  return handleResponse(response)
}
