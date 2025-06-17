"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { userAPI } from "@/lib/api"

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
  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} onSwitchToRegister={onSwitchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} onSwitchToLogin={onSwitchToLogin} />
    </>
  )
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await userAPI.login({
        email: formData.email,
        password: formData.password,
      })

      // Store user data in localStorage
      localStorage.setItem("userToken", response._id)
      localStorage.setItem("isAdmin", response.isAdmin.toString())
      localStorage.setItem("userData", JSON.stringify(response))

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"))

      toast({
        title: "Login Successful",
        description: response.isAdmin ? "Welcome back, Admin!" : "Welcome back to Azushop!",
      })

      onClose()

      // Reset form
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      })

      // Redirect admin to admin portal
      if (response.isAdmin) {
        window.location.href = "/admin"
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToRegister = () => {
    onClose()
    onSwitchToRegister()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Login</DialogTitle>
          <DialogDescription className="text-center">Enter your credentials to access your account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <ForgotPasswordModal />
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full bg-[#009cde] hover:bg-[#01589a]" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-[#666666]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className="text-[#009cde] hover:text-[#01589a] hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await userAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully! You can now log in.",
      })

      onClose()
      onSwitchToLogin()

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToLogin = () => {
    onClose()
    onSwitchToLogin()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create an Account</DialogTitle>
          <DialogDescription className="text-center">Enter your information to create an account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-[#666666]">
            By registering, you agree to our{" "}
            <button type="button" className="text-[#009cde] hover:text-[#01589a] hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-[#009cde] hover:text-[#01589a] hover:underline">
              Privacy Policy
            </button>
            .
          </p>
          <Button type="submit" className="w-full bg-[#009cde] hover:bg-[#01589a]" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
          <p className="text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-[#009cde] hover:text-[#01589a] hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ForgotPasswordModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate password reset request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "Reset Link Sent",
        description: "If an account exists with this email, you'll receive a password reset link.",
      })
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setEmail("")
    setIsSubmitted(false)
    setIsLoading(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-[#009cde] hover:text-[#01589a] hover:underline"
      >
        Forgot password?
      </button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Forgot Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your email and we&apos;ll send you a link to reset your password
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#009cde] hover:bg-[#01589a]" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                <p className="text-center text-sm">
                  If an account exists with the email <strong>{email}</strong>, you&apos;ll receive a password reset
                  link shortly.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full bg-[#009cde] hover:bg-[#01589a]">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
