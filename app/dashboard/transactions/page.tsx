"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { transactionService } from "@/lib/services/transaction-service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Dummy school data mapping
const SCHOOLS = {
  "65b0e6293e9f76a9694d84b4": "Edviron School",
}

export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const sort = searchParams.get("sort") || "payment_time"
  const order = searchParams.get("order") || "desc"
  const status = searchParams.get("status") || ""
  const schoolId = searchParams.get("schoolId") || ""
  const searchQuery = searchParams.get("search") || ""

  const [transactions, setTransactions] = useState([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedStatuses, setSelectedStatuses] = useState(status ? status.split(",") : [])
  const [selectedSchools, setSelectedSchools] = useState(schoolId ? [schoolId] : [])
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  // Hover effect state
  const [hoveredRow, setHoveredRow] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [page, limit, sort, order, status, schoolId, searchQuery])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      let response
      if (schoolId) {
        response = await transactionService.getSchoolTransactions(
          schoolId,
          page,
          limit,
          sort,
          order,
          status,
          searchQuery,
        )
      } else {
        response = await transactionService.getAllTransactions(
          page,
          limit,
          sort,
          order,
          status,
          searchQuery,
        )
      }
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

    router.replace(`/dashboard/transactions?${newParams.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQueryParams({ page: newPage.toString() })
    }
  }

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams({ 
      limit: newLimit.toString(),
      page: "1" // Reset to first page when changing limit
    })
  }

  const handleSort = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc"
    updateQueryParams({ 
      sort: column,
      order: newOrder
    })
  }

  const handleStatusFilterChange = (status: string) => {
    updateQueryParams({ 
      status,
      page: "1" // Reset to first page when changing status
    })
  }

  const handleSchoolFilterChange = (schoolId: string) => {
    updateQueryParams({ 
      schoolId,
      page: "1" // Reset to first page when changing school
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    updateQueryParams({ 
      search: query,
      page: "1" // Reset to first page when searching
    })
  }

  const handleClearFilters = () => {
    updateQueryParams({ 
      status: "",
      schoolId: "",
      page: "1"
    })
  }

  const handleApplyFilters = () => {
    const params: Record<string, string> = {
      page: "1", // Reset to first page when applying filters
      status: selectedStatuses.length > 0 ? selectedStatuses.join(",") : "",
      schoolId: selectedSchools.length > 0 ? selectedSchools[0] : ""
    }
    updateQueryParams(params)
  }

  const getStatusBadgeColor = (status) => {
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

  // Get school name from school ID
  const getSchoolName = (schoolId) => {
    return SCHOOLS[schoolId] || schoolId
  }

  // Update the table columns to match requirements
  const columns = [
    { id: "collect_id", label: "Collect ID", sortable: true },
    { id: "school_id", label: "School", sortable: true },
    { id: "gateway", label: "Gateway", sortable: true },
    { id: "order_amount", label: "Order Amount", sortable: true },
    { id: "transaction_amount", label: "Transaction Amount", sortable: true },
    { id: "status", label: "Status", sortable: true },
    { id: "custom_order_id", label: "Custom Order ID", sortable: true },
  ]

  return (
    <div className="space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transactions Overview</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by Collect ID or Custom Order ID..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Transactions</h4>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Status</h5>
                        <div className="flex flex-wrap gap-2">
                          {["success", "pending", "failed"].map((statusOption) => (
                            <div key={statusOption} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${statusOption}`}
                                checked={selectedStatuses.includes(statusOption)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedStatuses([...selectedStatuses, statusOption])
                                  } else {
                                    setSelectedStatuses(selectedStatuses.filter(s => s !== statusOption))
                                  }
                                }}
                              />
                              <Label htmlFor={`status-${statusOption}`} className="capitalize">
                                {statusOption}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Schools</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(SCHOOLS).map(([id, name]) => (
                            <div key={id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`school-${id}`}
                                checked={selectedSchools.includes(id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSchools([...selectedSchools, id])
                                  } else {
                                    setSelectedSchools(selectedSchools.filter(s => s !== id))
                                  }
                                }}
                              />
                              <Label htmlFor={`school-${id}`}>{name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                        <Button onClick={handleApplyFilters}>Apply Filters</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className="cursor-pointer"
                      onClick={() => handleSort(column.id)}
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
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.collect_id}
                      className="table-row-hover-effect"
                      onMouseEnter={() => setHoveredRow(transaction.collect_id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell>{transaction.collect_id}</TableCell>
                      <TableCell>{getSchoolName(transaction.school_id)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
