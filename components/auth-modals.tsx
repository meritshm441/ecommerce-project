"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AuthModalsProps {
  isLoginOpen: boolean
  isRegisterOpen: boolean
  onLoginClose: () => void
  onRegisterClose: () => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
}

export function AuthModals({
  isLoginOpen,
  isRegisterOpen,
  onLoginClose,
  onRegisterClose,
  onSwitchToRegister,
  onSwitchToLogin,
}: AuthModalsProps) {
  const { toast } = useToast()

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register state
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")

    try {
      console.log("🔐 Attempting login for:", loginData.email)

      if (!loginData.email || !loginData.password) {
        throw new Error("Please fill in all fields")
      }

      const response = await userAPI.login({
        email: loginData.email.trim(),
        password: loginData.password,
      })

      console.log("✅ Login successful:", response)

      // Show success message
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user?.username || response.user?.name || "User"}!`,
      })

      // Reset form
      setLoginData({ email: "", password: "" })
      onLoginClose()

      // Redirect based on user role
      if (response.user?.isAdmin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }
    } catch (error: any) {
      console.error("❌ Login failed:", error)
      setLoginError(error.message || "Login failed. Please try again.")

      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError("")

    try {
      console.log("📝 Attempting registration for:", registerData.email)

      // Validation
      if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (registerData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const response = await userAPI.register({
        username: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      })

      console.log("✅ Registration successful:", response)

      // Show success message
      toast({
        title: "Registration Successful",
        description: `Welcome to Azushop, ${response.user?.username || registerData.username}!`,
      })

      // Reset form
      setRegisterData({ username: "", email: "", password: "", confirmPassword: "" })
      onRegisterClose()

      // Redirect to home page (user is automatically logged in)
      window.location.href = "/"
    } catch (error: any) {
      console.error("❌ Registration failed:", error)
      setRegisterError(error.message || "Registration failed. Please try again.")

      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  // Reset forms when modals close
  const handleLoginClose = () => {
    setLoginData({ email: "", password: "" })
    setLoginError("")
    setShowLoginPassword(false)
    onLoginClose()
  }

  const handleRegisterClose = () => {
    setRegisterData({ username: "", email: "", password: "", confirmPassword: "" })
    setRegisterError("")
    setShowRegisterPassword(false)
    setShowConfirmPassword(false)
    onRegisterClose()
  }

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={handleLoginClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">Sign in to your Azushop account</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="pl-10"
                  required
                  disabled={loginLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                  disabled={loginLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  disabled={loginLoading}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{"Don't have an account? "}</span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-700"
                onClick={onSwitchToRegister}
                disabled={loginLoading}
              >
                Sign up
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={handleRegisterClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Create Account</DialogTitle>
            <DialogDescription className="text-center">Join Azushop and start shopping</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegister} className="space-y-4">
            {registerError && (
              <Alert variant="destructive">
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-username"
                  type="text"
                  placeholder="Enter your username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="pl-10"
                  required
                  disabled={registerLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="pl-10"
                  required
                  disabled={registerLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                  disabled={registerLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  disabled={registerLoading}
                >
                  {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  required
                  disabled={registerLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={registerLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={registerLoading}>
              {registerLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-700"
                onClick={onSwitchToLogin}
                disabled={registerLoading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
