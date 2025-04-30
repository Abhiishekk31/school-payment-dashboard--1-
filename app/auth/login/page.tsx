"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { authService } from "@/lib/services/auth-service"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })
      localStorage.setItem("token", response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      router.push("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/20 animate-gradient-slow" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-64 h-64 bg-primary/5 rounded-full
              animate-float-${(i % 3) + 1} blur-xl`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Card with glass effect */}
      <Card className="relative w-full max-w-md mx-4 backdrop-blur-sm bg-background/80 border-primary/20 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2 animate-fade-up">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <CardTitle className="text-2xl font-bold text-center">School Payment Dashboard</CardTitle>
          </div>
          <CardDescription className="text-center animate-fade-up delay-100">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-2 animate-fade-up delay-200">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-primary/20 focus:border-primary transition-all duration-300"
              />
            </div>
            <div className="space-y-2 animate-fade-up delay-300">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="animate-fade-up delay-400">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-solid rounded-full border-t-transparent animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 text-center text-sm animate-fade-up delay-500">
          Don't have an account?{" "}
          <Link 
            href="/auth/register" 
            className="text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            Register
          </Link>
        </div>
      </Card>
    </div>
  )
}
