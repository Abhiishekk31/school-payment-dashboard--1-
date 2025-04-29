"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { transactionService } from "@/lib/services/transaction-service"

export default function TransactionStatusPage() {
  const [orderId, setOrderId] = useState("")
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) {
      setError("Please enter a Custom Order ID")
      return
    }

    setLoading(true)
    setError("")
    setTransaction(null)

    try {
      const response = await transactionService.checkTransactionStatus(orderId)
      setTransaction(response)
    } catch (error) {
      setError("Failed to fetch transaction status. Please try again.")
      console.error("Error checking transaction status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transaction Status Check</CardTitle>
              <CardDescription>Check the status of a specific transaction</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter Custom Order ID"
                  className="pl-8"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Checking..." : "Check Status"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>

          {transaction && (
            <div className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Collect ID</p>
                  <p className="text-sm text-muted-foreground">{transaction.collect_id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Custom Order ID</p>
                  <p className="text-sm text-muted-foreground">{transaction.custom_order_id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">School</p>
                  <p className="text-sm text-muted-foreground">{transaction.school_id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gateway</p>
                  <p className="text-sm text-muted-foreground">{transaction.gateway}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Order Amount</p>
                  <p className="text-sm text-muted-foreground">₹{transaction.order_amount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Transaction Amount</p>
                  <p className="text-sm text-muted-foreground">₹{transaction.transaction_amount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusBadgeColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.payment_time).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
