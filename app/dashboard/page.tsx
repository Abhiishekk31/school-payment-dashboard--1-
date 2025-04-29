"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, CreditCard, DollarSign, School, Shield, Zap, Lock, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    averageProcessingTime: 0,
    accuracyRate: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [transactionTimings, setTransactionTimings] = useState([])
  const [animatedText, setAnimatedText] = useState("")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
      setStats({
        averageProcessingTime: 2.5,
        accuracyRate: 99.8,
        totalTransactions: 1250,
        successfulTransactions: 1245,
      })
      
      // Set dummy transaction timing data
      setTransactionTimings([
        { time: "00:00", processingTime: 2.1, accuracy: 99.9 },
        { time: "00:05", processingTime: 2.3, accuracy: 99.8 },
        { time: "00:10", processingTime: 2.4, accuracy: 99.7 },
        { time: "00:15", processingTime: 2.2, accuracy: 99.9 },
        { time: "00:20", processingTime: 2.5, accuracy: 99.8 },
        { time: "00:25", processingTime: 2.3, accuracy: 99.8 },
        { time: "00:30", processingTime: 2.4, accuracy: 99.9 },
      ])
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  // Animated text effect
  useEffect(() => {
    const text = "Edviron Acadpay: The fastest and most seamless payment solution for schools across India. Our secure platform ensures instant transactions with bank-grade encryption, making fee collection effortless and reliable."
    let currentText = ""
    let index = 0
    
    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index]
        setAnimatedText(currentText)
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Welcome to Edviron Acadpay</h2>
              <p className="text-gray-600 min-h-[60px]">{animatedText}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">End-to-End Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{stats.averageProcessingTime}s</div>
                <p className="text-xs text-gray-500">Per transaction</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Transaction Accuracy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{stats.accuracyRate}%</div>
                <p className="text-xs text-gray-500">Success rate</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{stats.totalTransactions}</div>
                <p className="text-xs text-gray-500">Processed today</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Successful Transactions</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{stats.successfulTransactions}</div>
                <p className="text-xs text-gray-500">Completed successfully</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 border-red-100">
          <CardHeader>
            <CardTitle className="text-gray-700">Transaction Processing Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionTimings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
                  <XAxis dataKey="time" stroke="#4b5563" />
                  <YAxis stroke="#4b5563" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #fecaca' }} />
                  <Legend />
                  <Line type="monotone" dataKey="processingTime" stroke="#ef4444" name="Processing Time (s)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border-red-100">
          <CardHeader>
            <CardTitle className="text-gray-700">Transaction Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionTimings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
                  <XAxis dataKey="time" stroke="#4b5563" />
                  <YAxis domain={[99, 100]} stroke="#4b5563" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #fecaca' }} />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#ef4444" name="Accuracy (%)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
