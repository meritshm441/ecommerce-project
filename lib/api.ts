const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Session Manager for handling authentication sessions
export const sessionManager = {
  // Set session data
  setSession: (userData: any, token: string) => {
    try {
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
      localStorage.setItem("userToken", token)
      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("sessionExpiry", expiryTime.toString())
      localStorage.setItem("isAdmin", userData.isAdmin ? "true" : "false")
      console.log("✅ Session set successfully for:", userData.email)
    } catch (error) {
      console.error("❌ Failed to set session:", error)
    }
  },

  // Get session data
  getSession: () => {
    try {
      const token = localStorage.getItem("userToken")
      const userData = localStorage.getItem("userData")
      const sessionExpiry = localStorage.getItem("sessionExpiry")

      if (!token || !userData || !sessionExpiry) {
        return null
      }

      // Check if session has expired
      const currentTime = new Date().getTime()
      const expiryTime = Number.parseInt(sessionExpiry)

      if (currentTime > expiryTime) {
        console.log("⏰ Session expired, clearing...")
        sessionManager.clearSession()
        return null
      }

      return {
        token,
        userData: JSON.parse(userData),
        expiryTime,
      }
    } catch (error) {
      console.error("❌ Failed to get session:", error)
      return null
    }
  },

  // Clear session data
  clearSession: () => {
    try {
      localStorage.removeItem("userToken")
      localStorage.removeItem("userData")
      localStorage.removeItem("sessionExpiry")
      localStorage.removeItem("isAdmin")
      console.log("🧹 Session cleared successfully")
    } catch (error) {
      console.error("❌ Failed to clear session:", error)
    }
  },

  // Check if session is valid
  isSessionValid: () => {
    const session = sessionManager.getSession()
    return session !== null
  },

  // Extend session (refresh expiry time)
  extendSession: () => {
    try {
      const session = sessionManager.getSession()
      if (session) {
        const newExpiryTime = new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
        localStorage.setItem("sessionExpiry", newExpiryTime.toString())
        console.log("🔄 Session extended successfully")
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Failed to extend session:", error)
      return false
    }
  },
}

// API request helper with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const session = sessionManager.getSession()
  const token = session?.token

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Handle authentication errors
    if (response.status === 401) {
      console.log("🔒 Authentication failed, clearing session")
      sessionManager.clearSession()
      window.dispatchEvent(new CustomEvent("authError"))
      throw new Error("Authentication failed")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error)
    throw error
  }
}

// User API functions
export const userAPI = {
  // Register new user
  register: async (userData: { username: string; email: string; password: string }) => {
    console.log("📝 Registering user:", userData.email)

    const endpoints = ["/users/register", "/auth/register", "/register"]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })

        if (response.ok) {
          const data = await response.json()
          console.log("✅ Registration successful:", data)

          // Auto-login after successful registration
          if (data.token && data.user) {
            sessionManager.setSession(data.user, data.token)
            window.dispatchEvent(new CustomEvent("loginSuccess", { detail: data.user }))
          }

          return data
        }
      } catch (error) {
        console.warn(`⚠️ Registration failed on ${endpoint}:`, error)
        continue
      }
    }

    throw new Error("Registration failed on all endpoints")
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    console.log("🔐 Logging in user:", credentials.email)

    const endpoints = ["/users/login", "/auth/login", "/login"]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })

        if (response.ok) {
          const data = await response.json()
          console.log("✅ Login successful:", data)

          // Store session data
          if (data.token && data.user) {
            sessionManager.setSession(data.user, data.token)
            window.dispatchEvent(new CustomEvent("loginSuccess", { detail: data.user }))
          }

          return data
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Login failed")
        }
      } catch (error) {
        console.warn(`⚠️ Login failed on ${endpoint}:`, error)
        if (endpoints.indexOf(endpoint) === endpoints.length - 1) {
          throw error
        }
        continue
      }
    }

    throw new Error("Login failed on all endpoints")
  },

  // Logout user
  logout: async () => {
    console.log("🚪 Logging out user...")

    try {
      const endpoints = ["/users/logout", "/auth/logout", "/logout"]

      for (const endpoint of endpoints) {
        try {
          await apiRequest(endpoint, { method: "POST" })
          break
        } catch (error) {
          console.warn(`⚠️ Logout API call failed on ${endpoint}:`, error)
          continue
        }
      }
    } catch (error) {
      console.warn("⚠️ Logout API call failed, clearing session anyway:", error)
    } finally {
      // Always clear session regardless of API response
      sessionManager.clearSession()
      console.log("✅ Logout completed")
    }
  },

  // Get user profile
  getProfile: async () => {
    console.log("👤 Fetching user profile...")

    const endpoints = ["/users/profile", "/auth/profile", "/profile", "/users/me"]

    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest(endpoint)
        const data = await response.json()
        console.log("✅ Profile fetched successfully")

        // Extend session on successful API call
        sessionManager.extendSession()

        return data
      } catch (error) {
        console.warn(`⚠️ Profile fetch failed on ${endpoint}:`, error)
        continue
      }
    }

    throw new Error("Failed to fetch profile from all endpoints")
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    console.log("📝 Updating user profile...")

    const endpoints = ["/users/profile", "/auth/profile", "/profile"]

    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest(endpoint, {
          method: "PUT",
          body: JSON.stringify(profileData),
        })

        const data = await response.json()
        console.log("✅ Profile updated successfully")

        // Update session data with new profile info
        const session = sessionManager.getSession()
        if (session) {
          const updatedUser = { ...session.userData, ...data }
          sessionManager.setSession(updatedUser, session.token)
        }

        return data
      } catch (error) {
        console.warn(`⚠️ Profile update failed on ${endpoint}:`, error)
        continue
      }
    }

    throw new Error("Failed to update profile on all endpoints")
  },

  // Change password
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    console.log("🔒 Changing user password...")

    const endpoints = ["/users/change-password", "/auth/change-password", "/change-password"]

    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest(endpoint, {
          method: "PUT",
          body: JSON.stringify(passwordData),
        })

        const data = await response.json()
        console.log("✅ Password changed successfully")
        return data
      } catch (error) {
        console.warn(`⚠️ Password change failed on ${endpoint}:`, error)
        continue
      }
    }

    throw new Error("Failed to change password on all endpoints")
  },

  // Get user orders
  getOrders: async () => {
    console.log("📦 Fetching user orders...")

    const endpoints = ["/users/orders", "/orders", "/users/me/orders"]

    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest(endpoint)
        const data = await response.json()
        console.log("✅ Orders fetched successfully")
        return data
      } catch (error) {
        console.warn(`⚠️ Orders fetch failed on ${endpoint}:`, error)
        continue
      }
    }

    throw new Error("Failed to fetch orders from all endpoints")
  },
}

// Product API functions
export const productAPI = {
  // Get all products
  getProducts: async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append("search", params.search)
    if (params?.category) queryParams.append("category", params.category)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const queryString = queryParams.toString()
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`

    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return response.json()
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch product")
    }
    return response.json()
  },

  // Create product (admin only)
  createProduct: async (productData: any) => {
    const response = await apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
    return response.json()
  },

  // Update product (admin only)
  updateProduct: async (id: string, productData: any) => {
    const response = await apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
    return response.json()
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await apiRequest(`/products/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

// Order API functions
export const orderAPI = {
  // Create order
  createOrder: async (orderData: any) => {
    const response = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
    return response.json()
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await apiRequest("/orders")
    return response.json()
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await apiRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
    return response.json()
  },
}

// Admin API functions
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await apiRequest("/admin/dashboard")
    return response.json()
  },

  // Get all users
  getUsers: async () => {
    const response = await apiRequest("/admin/users")
    return response.json()
  },

  // Update user role
  updateUserRole: async (userId: string, isAdmin: boolean) => {
    const response = await apiRequest(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ isAdmin }),
    })
    return response.json()
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await apiRequest(`/admin/users/${userId}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

export default {
  userAPI,
  productAPI,
  orderAPI,
  adminAPI,
  sessionManager,
}
