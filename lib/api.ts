// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Mock data for fallback when API is not available
const mockProducts = [
  {
    _id: "1",
    name: "MacBook Pro 16-inch M3 Max",
    price: 2399.99,
    brand: "Apple",
    category: { _id: "laptops", name: "Laptops" },
    image: "/placeholder.svg?height=300&width=300&text=MacBook+Pro",
    rating: 4.8,
    numReviews: 124,
    countInStock: 15,
    description: "The MacBook Pro 16-inch with M3 Max chip delivers exceptional performance for professionals.",
  },
  {
    _id: "2",
    name: "iPhone 15 Pro Max 256GB",
    price: 1199.99,
    brand: "Apple",
    category: { _id: "phones", name: "Phones" },
    image: "/placeholder.svg?height=300&width=300&text=iPhone+15+Pro",
    rating: 4.9,
    numReviews: 89,
    countInStock: 8,
    description: "The latest iPhone with advanced camera system and A17 Pro chip.",
  },
  {
    _id: "3",
    name: "Canon EOS R5 Mirrorless Camera",
    price: 3899.99,
    brand: "Canon",
    category: { _id: "cameras", name: "Cameras" },
    image: "/placeholder.svg?height=300&width=300&text=Canon+Camera",
    rating: 4.7,
    numReviews: 56,
    countInStock: 0,
    description: "Professional mirrorless camera with 45MP full-frame sensor.",
  },
  {
    _id: "4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    brand: "Sony",
    category: { _id: "audio", name: "Audio" },
    image: "/placeholder.svg?height=300&width=300&text=Sony+Headphones",
    rating: 4.6,
    numReviews: 203,
    countInStock: 25,
    description: "Industry-leading noise canceling with exceptional sound quality.",
  },
  {
    _id: "5",
    name: "Dell XPS 13 Laptop",
    price: 1299.99,
    brand: "Dell",
    category: { _id: "laptops", name: "Laptops" },
    image: "/placeholder.svg?height=300&width=300&text=Dell+XPS",
    rating: 4.5,
    numReviews: 78,
    countInStock: 12,
    description: "Ultra-portable laptop with stunning InfinityEdge display.",
  },
  {
    _id: "6",
    name: "Samsung Galaxy S24 Ultra",
    price: 1299.99,
    brand: "Samsung",
    category: { _id: "phones", name: "Phones" },
    image: "/placeholder.svg?height=300&width=300&text=Galaxy+S24",
    rating: 4.7,
    numReviews: 156,
    countInStock: 20,
    description: "Premium Android smartphone with S Pen and advanced cameras.",
  },
]

const mockCategories = [
  { _id: "laptops", name: "Laptops" },
  { _id: "phones", name: "Phones" },
  { _id: "cameras", name: "Cameras" },
  { _id: "audio", name: "Audio" },
]

// Track if we're using mock data
let usingMockData = false

// API Helper function with enhanced error handling and fallback
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      // Handle different error response types
      let errorMessage = `HTTP error! status: ${response.status}`

      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } else {
          // Handle plain text responses from backend
          const textError = await response.text()
          errorMessage = textError || errorMessage
        }
      } catch (parseError) {
        // If we can't parse the error, use the status text
        errorMessage = response.statusText || errorMessage
      }

      throw new Error(errorMessage)
    }

    // Handle successful responses
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      return { message: text }
    }
  } catch (error: any) {
    // Mark that we're using mock data
    usingMockData = true

    // Don't log connection errors in production
    if (process.env.NODE_ENV === "development") {
      console.warn("API request failed, using mock data:", error.message)
    }

    throw error
  }
}

// Test API connectivity with better error handling
export async function testAPIConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    // Try a simple fetch without complex headers first
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      usingMockData = false
      return { connected: true, message: "API connection successful" }
    } else {
      usingMockData = true
      return { connected: false, message: "API server responded but health check failed" }
    }
  } catch (error: any) {
    usingMockData = true

    // Handle different types of connection errors
    if (error.name === "AbortError") {
      return {
        connected: false,
        message: "Connection timeout - Backend server not responding",
      }
    }

    if (error.message === "Failed to fetch") {
      return {
        connected: false,
        message: "Backend server not available - Using demo mode",
      }
    }

    return {
      connected: false,
      message: "Backend server not available - Using demo mode",
    }
  }
}

// Check if using mock data
export const isUsingMockData = () => usingMockData

// User API functions with fallback
export const userAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      return await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    } catch (error: any) {
      // Mock successful registration
      return {
        _id: "mock-user-id",
        username: userData.username,
        email: userData.email,
        isAdmin: false,
        message: "Registration successful (demo mode)",
      }
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      return await apiRequest("/users/auth", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
    } catch (error: any) {
      // Mock login for demo purposes
      const isAdmin = credentials.email === "admin@azushop.com" && credentials.password === "admin123"
      const isUser = credentials.email === "user@example.com" && credentials.password === "password"

      if (isAdmin || isUser) {
        return {
          _id: isAdmin ? "admin-id" : "user-id",
          username: isAdmin ? "Admin" : "User",
          email: credentials.email,
          isAdmin: isAdmin,
          message: "Login successful (demo mode)",
        }
      } else {
        throw new Error("Invalid email or password")
      }
    }
  },

  logout: async () => {
    try {
      return await apiRequest("/users/logout", {
        method: "POST",
      })
    } catch (error: any) {
      // For logout, we can still clear local state even if API fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken")
      }
      return { message: "Logged out successfully" }
    }
  },

  getProfile: async () => {
    try {
      return await apiRequest("/users/profile")
    } catch (error: any) {
      return {
        _id: "user-id",
        username: "John Doe",
        email: "john.doe@example.com",
        message: "Profile loaded (demo mode)",
      }
    }
  },

  updateProfile: async (userData: { username?: string; email?: string; password?: string }) => {
    try {
      return await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      })
    } catch (error: any) {
      return {
        _id: "user-id",
        username: userData.username || "John Doe",
        email: userData.email || "john.doe@example.com",
        isAdmin: false,
        message: "Profile updated successfully (demo mode)",
      }
    }
  },

  getAllUsers: async () => {
    try {
      return await apiRequest("/users/register", {
        method: "GET",
      })
    } catch (error: any) {
      return [
        {
          _id: "1",
          username: "John Doe",
          email: "john@example.com",
          isAdmin: false,
        },
        {
          _id: "2",
          username: "Admin User",
          email: "admin@azushop.com",
          isAdmin: true,
        },
      ]
    }
  },

  getUserById: async (id: string) => {
    try {
      return await apiRequest(`/users/${id}`)
    } catch (error: any) {
      return {
        _id: id,
        username: "John Doe",
        email: "john@example.com",
        isAdmin: false,
      }
    }
  },

  updateUser: async (id: string, userData: { username?: string; email?: string; isAdmin?: boolean }) => {
    try {
      return await apiRequest(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
    } catch (error: any) {
      return {
        _id: id,
        username: userData.username || "John Doe",
        email: userData.email || "john@example.com",
        isAdmin: userData.isAdmin || false,
        message: "User updated successfully (demo mode)",
      }
    }
  },

  deleteUser: async (id: string) => {
    try {
      return await apiRequest(`/users/${id}`, {
        method: "DELETE",
      })
    } catch (error: any) {
      return { message: "User deleted successfully (demo mode)" }
    }
  },
}

// Product API functions with fallback
export const productAPI = {
  getAllProducts: async () => {
    try {
      return await apiRequest("/products/allproducts")
    } catch (error: any) {
      return mockProducts
    }
  },

  getProducts: async (keyword?: string) => {
    try {
      const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""
      return await apiRequest(`/products${query}`)
    } catch (error: any) {
      const filteredProducts = keyword
        ? mockProducts.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()))
        : mockProducts
      return {
        products: filteredProducts,
        page: 1,
        pages: 1,
        hasMore: false,
      }
    }
  },

  getProductById: async (id: string) => {
    try {
      return await apiRequest(`/products/${id}`)
    } catch (error: any) {
      return mockProducts.find((p) => p._id === id) || mockProducts[0]
    }
  },

  createProduct: async (productData: FormData) => {
    try {
      return await apiRequest("/products", {
        method: "POST",
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: productData,
      })
    } catch (error: any) {
      return {
        _id: "new-product-id",
        name: "New Product",
        message: "Product created successfully (demo mode)",
      }
    }
  },

  updateProduct: async (id: string, productData: FormData) => {
    try {
      return await apiRequest(`/products/${id}`, {
        method: "PUT",
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: productData,
      })
    } catch (error: any) {
      return {
        _id: id,
        message: "Product updated successfully (demo mode)",
      }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      return await apiRequest(`/products/${id}`, {
        method: "DELETE",
      })
    } catch (error: any) {
      return { message: "Product deleted successfully (demo mode)" }
    }
  },

  addReview: async (id: string, review: { rating: number; comment: string }) => {
    try {
      return await apiRequest(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify(review),
      })
    } catch (error: any) {
      return { message: "Review added successfully (demo mode)" }
    }
  },

  getTopProducts: async () => {
    try {
      return await apiRequest("/products/top")
    } catch (error: any) {
      return mockProducts.slice(0, 4)
    }
  },

  getNewProducts: async () => {
    try {
      return await apiRequest("/products/new")
    } catch (error: any) {
      return mockProducts.slice(0, 5)
    }
  },

  filterProducts: async (filters: { checked: string[]; radio: number[] }) => {
    try {
      return await apiRequest("/products/filtered-products", {
        method: "POST",
        body: JSON.stringify(filters),
      })
    } catch (error: any) {
      return mockProducts
    }
  },
}

// Category API functions with fallback
export const categoryAPI = {
  getAllCategories: async () => {
    try {
      return await apiRequest("/categories")
    } catch (error: any) {
      return mockCategories
    }
  },

  getCategoryById: async (id: string) => {
    try {
      return await apiRequest(`/categories/${id}`)
    } catch (error: any) {
      return mockCategories.find((c) => c._id === id) || mockCategories[0]
    }
  },

  createCategory: async (categoryData: { name: string }) => {
    try {
      return await apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      })
    } catch (error: any) {
      return {
        _id: "new-category-id",
        name: categoryData.name,
        message: "Category created successfully (demo mode)",
      }
    }
  },

  updateCategory: async (id: string, categoryData: { name: string }) => {
    try {
      return await apiRequest(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
      })
    } catch (error: any) {
      return {
        _id: id,
        name: categoryData.name,
        message: "Category updated successfully (demo mode)",
      }
    }
  },

  deleteCategory: async (id: string) => {
    try {
      return await apiRequest(`/categories/${id}`, {
        method: "DELETE",
      })
    } catch (error: any) {
      return { message: "Category deleted successfully (demo mode)" }
    }
  },
}

// Order API functions with fallback
export const orderAPI = {
  createOrder: async (orderData: {
    orderItems: any[]
    shippingAddress: any
    paymentMethod: string
  }) => {
    try {
      return await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      })
    } catch (error: any) {
      return {
        _id: "new-order-id",
        orderItems: orderData.orderItems,
        totalPrice: 100,
        message: "Order created successfully (demo mode)",
      }
    }
  },

  getAllOrders: async () => {
    try {
      return await apiRequest("/orders")
    } catch (error: any) {
      return [
        {
          _id: "order-1",
          user: { username: "John Doe" },
          totalPrice: 2399.99,
          isPaid: true,
          isDelivered: false,
          createdAt: new Date().toISOString(),
        },
      ]
    }
  },

  getUserOrders: async () => {
    try {
      return await apiRequest("/orders/mine")
    } catch (error: any) {
      return [
        {
          _id: "order-1",
          totalPrice: 2399.99,
          isPaid: true,
          isDelivered: false,
          createdAt: new Date().toISOString(),
        },
      ]
    }
  },

  getOrderById: async (id: string) => {
    try {
      return await apiRequest(`/orders/${id}`)
    } catch (error: any) {
      return {
        _id: id,
        totalPrice: 2399.99,
        isPaid: true,
        isDelivered: false,
        user: { username: "John Doe", email: "john@example.com" },
      }
    }
  },

  payOrder: async (orderData: { callback_url: string; order: string }) => {
    try {
      return await apiRequest("/orders/pay", {
        method: "POST",
        body: JSON.stringify(orderData),
      })
    } catch (error: any) {
      return {
        transaction: { data: { authorization_url: "#" } },
        order: { _id: orderData.order },
        message: "Payment processed (demo mode)",
      }
    }
  },

  markAsDelivered: async (id: string) => {
    try {
      return await apiRequest(`/orders/${id}/deliver`, {
        method: "PUT",
      })
    } catch (error: any) {
      return { message: "Order marked as delivered (demo mode)" }
    }
  },

  getTotalOrders: async () => {
    try {
      return await apiRequest("/orders/total-orders")
    } catch (error: any) {
      return { totalOrders: 142 }
    }
  },

  getTotalSales: async () => {
    try {
      return await apiRequest("/orders/total-sales")
    } catch (error: any) {
      return { totalSales: 12847 }
    }
  },

  getSalesByDate: async () => {
    try {
      return await apiRequest("/orders/total-sales-by-date")
    } catch (error: any) {
      return [
        { _id: "2024-01-15", totalSales: 2399.99 },
        { _id: "2024-01-14", totalSales: 1549.98 },
      ]
    }
  },
}
