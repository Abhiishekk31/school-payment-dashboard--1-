import axios from "axios"

// Set base URL from environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://jrhjg91r-3333.inc1.devtunnels.ms"

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const transactionService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    const response = await api.post("/create-payment", paymentData)
    return response.data
  },

  // Get payment status
  getPaymentStatus: async (collect_request_id, school_id) => {
    const response = await api.get(`/payment-status/${collect_request_id}?school_id=${school_id}`)
    return response.data
  },

  // Get all transactions with pagination, sorting, and filtering
  getAllTransactions: async (
    page = 1,
    limit = 10,
    sort = "payment_time",
    order = "desc",
    status = "",
    fromDate = "",
    toDate = "",
    search = "",
  ) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    params.append("sort", sort)
    params.append("order", order)

    if (status) params.append("status", status)
    if (fromDate) params.append("fromDate", fromDate)
    if (toDate) params.append("toDate", toDate)
    if (search) params.append("search", search)

    try {
      const response = await api.get(`/transactions?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  },

  // Get transactions for a specific school
  getSchoolTransactions: async (
    schoolId,
    page = 1,
    limit = 10,
    sort = "payment_time",
    order = "desc",
    status = "",
    fromDate = "",
    toDate = "",
    search = "",
  ) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    params.append("sort", sort)
    params.append("order", order)

    if (status) params.append("status", status)
    if (fromDate) params.append("fromDate", fromDate)
    if (toDate) params.append("toDate", toDate)
    if (search) params.append("search", search)

    try {
      const response = await api.get(`/transactions/school/${schoolId}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error fetching school transactions:", error)
      throw error
    }
  },

  // Check transaction status by custom order ID
  getTransactionStatus: async (customOrderId) => {
    try {
      const response = await api.get(`/transaction-status/${customOrderId}`)
      return response.data
    } catch (error) {
      console.error("Error checking transaction status:", error)
      throw error
    }
  },

  // Get total count from order statuses table
  getOrderStatusesCount: async () => {
    try {
      const response = await api.get('/order-statuses/count')
      return response.data
    } catch (error) {
      console.error("Error getting order statuses count:", error)
      throw error
    }
  },
}
