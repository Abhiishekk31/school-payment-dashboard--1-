"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { transactionService } from "@/lib/services/transaction-service"

// School data mapping
const SCHOOLS = {
  "65b0e6293e9f76a9694d84b4": "Delhi Public School",
  "65b0e6293e9f76a9694d84b5": "St. Mary's School",
  "65b0e6293e9f76a9694d84b6": "Kendriya Vidyalaya",
  "65b0e6293e9f76a9694d84b7": "Ryan International School",
  "65b0e6293e9f76a9694d84b8": "DAV Public School",
}

export default function SchoolTransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const sort = searchParams.get("sort") || "payment_time"
  const order = searchParams.get("order") || "desc"
  const schoolId = searchParams.get("schoolId") || ""
  const searchQuery = searchParams.get("search") || ""

  const [transactions, setTransactions] = useState([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  // Table columns
  const columns = [
    { id: "collect_id", label: "Collect ID", sortable: true },
    { id: "gateway", label: "Gateway", sortable: true },
    { id: "order_amount", label: "Order Amount", sortable: true },
    { id: "transaction_amount", label: "Transaction Amount", sortable: true },
    { id: "status", label: "Status", sortable: true },
    { id: "custom_order_id", label: "Custom Order ID", sortable: true },
  ]

  useEffect(() => {
    if (schoolId) {
      fetchTransactions()
    }
  }, [page, limit, sort, order, schoolId, searchQuery])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await transactionService.getSchoolTransactions(
        schoolId,
        page,
        limit,
        sort,
        order,
        "",
        "",
        "",
        searchQuery
      )
      setTransactions(response.data || [])
      setTotalTransactions(response.total || 0)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setTransactions([])
      setTotalTransactions(0)
    } finally {
      setLoading(false)
    }
  }

  const updateQueryParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    router.replace(`/dashboard/school-transactions?${newParams.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQueryParams({ page: newPage.toString() })
    }
  }

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams({ page: "1", limit: newLimit.toString() })
  }

  const handleSortChange = (column: string) => {
    if (sort === column) {
      updateQueryParams({ order: order === "asc" ? "desc" : "asc" })
    } else {
      updateQueryParams({ sort: column, order: "asc" })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams({ page: "1", search: searchTerm })
  }

  const handleSchoolChange = (newSchoolId: string) => {
    updateQueryParams({ page: "1", schoolId: newSchoolId })
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

  const totalPages = Math.ceil(totalTransactions / limit)

  return (
    <div className="space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>School Transactions</CardTitle>
              <CardDescription>View transactions for a specific school</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={schoolId} onValueChange={handleSchoolChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SCHOOLS).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!schoolId ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a school to view transactions
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={column.id}
                          className="cursor-pointer"
                          onClick={() => handleSortChange(column.id)}
                        >
                          <div className="flex items-center gap-1">
                            {column.label}
                            {sort === column.id && (
                              order === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: limit }).map((_, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column.id}>
                              <Skeleton className="h-4 w-[100px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center py-8">
                          No transactions found for this school
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.collect_id}>
                          <TableCell>{transaction.collect_id}</TableCell>
                          <TableCell>{transaction.gateway}</TableCell>
                          <TableCell>₹{transaction.order_amount}</TableCell>
                          <TableCell>₹{transaction.transaction_amount}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.custom_order_id}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => handleLimitChange(Number(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                      <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    Showing {transactions.length} of {totalTransactions} transactions
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 