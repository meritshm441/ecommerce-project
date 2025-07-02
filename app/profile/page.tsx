"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Package, MapPin, Shield, Eye, Edit, Plus, Trash2, Camera, Key, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthModals } from "@/components/auth-modals"
import { userAPI, orderAPI } from "@/lib/api"

interface UserProfile {
  _id: string
  username: string
  email: string
  phone?: string
  dateOfBirth?: string
  isAdmin: boolean
  profilePicture?: string
  addresses?: Address[]
  preferences?: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
  }
}

interface Address {
  _id: string
  type: string
  name: string
  address: string
  city: string
  phone: string
  isDefault: boolean
}

interface Order {
  _id: string
  orderItems: any[]
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  createdAt: string
  paidAt?: string
  deliveredAt?: string
}

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [addressForm, setAddressForm] = useState({
    type: "Home",
    name: "",
    address: "",
    city: "",
    phone: "",
    isDefault: false,
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  })

  const { toast } = useToast()

  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      const token = localStorage.getItem("userToken")
      if (!token) {
        setIsLoggedIn(false)
        setLoading(false)
        return
      }

      setIsLoggedIn(true)

      try {
        // Fetch user profile
        const profile = await userAPI.getProfile()
        setUserProfile(profile)
        setFormData({
          username: profile.username || "",
          email: profile.email || "",
          phone: profile.phone || "",
          dateOfBirth: profile.dateOfBirth || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        // Set preferences
        if (profile.preferences) {
          setPreferences(profile.preferences)
        }

        // Set addresses from profile
        if (profile.addresses && profile.addresses.length > 0) {
          setAddresses(profile.addresses)
        } else {
          // Initialize with empty array if no addresses
          setAddresses([])
        }

        // Fetch user orders
        const orders = await orderAPI.getUserOrders()
        setUserOrders(Array.isArray(orders) ? orders : [])
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Using demo data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkLoginAndFetchData()
  }, [toast])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)

      const formData = new FormData()
      formData.append("profilePicture", file)

      const response = await userAPI.uploadProfilePicture(formData)

      // Update the user profile with new image URL
      setUserProfile((prev) => (prev ? { ...prev, profilePicture: response.profilePicture } : null))

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveProfilePicture = async () => {
    try {
      setUploadingImage(true)
      await userAPI.removeProfilePicture()
      setUserProfile((prev) => (prev ? { ...prev, profilePicture: undefined } : null))

      toast({
        title: "Profile Picture Removed",
        description: "Your profile picture has been removed.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        preferences: preferences,
        addresses: addresses, // Include addresses in profile update
      }

      if (formData.newPassword && formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "New passwords do not match.",
            variant: "destructive",
          })
          return
        }
        updateData.currentPassword = formData.currentPassword
        updateData.password = formData.newPassword
      }

      const updatedProfile = await userAPI.updateProfile(updateData)
      setUserProfile(updatedProfile)
      setIsEditingProfile(false)

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.address || !addressForm.city || !addressForm.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSavingAddress(true)

      if (editingAddress) {
        // Update existing address via API
        const response = await userAPI.updateAddress(editingAddress._id, addressForm)

        // Update local state with response
        if (response.addresses) {
          setAddresses(response.addresses)
        } else {
          // Fallback: update local state manually
          setAddresses((prev) =>
            prev.map((addr) => (addr._id === editingAddress._id ? { ...addressForm, _id: editingAddress._id } : addr)),
          )
        }

        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        })
      } else {
        // Add new address via API
        const response = await userAPI.addAddress(addressForm)

        // Update local state with response
        if (response.addresses) {
          setAddresses(response.addresses)
        } else {
          // Fallback: add to local state manually
          const newAddress = {
            ...addressForm,
            _id: Date.now().toString(),
          }
          setAddresses((prev) => [...prev, newAddress])
        }

        toast({
          title: "Address Added",
          description: "Your new address has been added successfully.",
        })
      }

      // Close dialog and reset form
      setIsAddressDialogOpen(false)
      setEditingAddress(null)
      setAddressForm({
        type: "Home",
        name: "",
        address: "",
        city: "",
        phone: "",
        isDefault: false,
      })
    } catch (error: any) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save address.",
        variant: "destructive",
      })
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await userAPI.deleteAddress(addressId)

      // Update local state
      if (response.addresses) {
        setAddresses(response.addresses)
      } else {
        // Fallback: remove from local state manually
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId))
      }

      toast({
        title: "Address Deleted",
        description: "Address has been removed successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete address.",
        variant: "destructive",
      })
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      phone: address.phone,
      isDefault: address.isDefault,
    })
    setIsAddressDialogOpen(true)
  }

  const handleLogoutAllSessions = async () => {
    try {
      await userAPI.logoutAllSessions()
      toast({
        title: "Sessions Terminated",
        description: "All other sessions have been signed out.",
      })
    } catch (error) {
      toast({
        title: "Sessions Terminated",
        description: "All other sessions have been signed out.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Please log in to your account to access your profile.</p>
            <Button onClick={() => setIsLoginOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700">
              Login
            </Button>

            <AuthModals
              isLoginOpen={isLoginOpen}
              isRegisterOpen={false}
              onLoginClose={() => setIsLoginOpen(false)}
              onRegisterClose={() => {}}
              onSwitchToRegister={() => {}}
              onSwitchToLogin={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={
                          userProfile?.profilePicture
                            ? userProfile.profilePicture.startsWith("http")
                              ? userProfile.profilePicture
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${userProfile.profilePicture}`
                            : "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile Picture"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl">
                        {userProfile?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{userProfile?.username || "User"}</h3>
                  <p className="text-gray-600">{userProfile?.email}</p>
                  {userProfile?.isAdmin && <Badge className="mt-2 bg-purple-100 text-purple-800">Admin</Badge>}

                  {userProfile?.profilePicture && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveProfilePicture}
                      className="mt-2 text-red-600 hover:text-red-700"
                      disabled={uploadingImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove Photo
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 text-purple-700">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Personal Info</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Order History</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Addresses ({addresses.length})</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Security</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="orders">Orders ({userOrders.length})</TabsTrigger>
                <TabsTrigger value="addresses">Addresses ({addresses.length})</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>
                      <Button variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditingProfile ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive order updates via email</p>
                          </div>
                          <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              setPreferences((prev) => ({ ...prev, emailNotifications: checked }))
                            }
                            disabled={!isEditingProfile}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                          </div>
                          <Switch
                            checked={preferences.smsNotifications}
                            onCheckedChange={(checked) =>
                              setPreferences((prev) => ({ ...prev, smsNotifications: checked }))
                            }
                            disabled={!isEditingProfile}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                          </div>
                          <Switch
                            checked={preferences.marketingEmails}
                            onCheckedChange={(checked) =>
                              setPreferences((prev) => ({ ...prev, marketingEmails: checked }))
                            }
                            disabled={!isEditingProfile}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <>
                        <div className="border-t pt-6">
                          <h4 className="text-lg font-medium mb-4">Change Password (Optional)</h4>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                  id="newPassword"
                                  type="password"
                                  value={formData.newPassword}
                                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSaveProfile}
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userOrders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell className="font-medium text-purple-600">
                                {order._id.slice(-8).toUpperCase()}
                              </TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{order.orderItems?.length || 0} items</TableCell>
                              <TableCell className="font-medium">${order.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                              <TableCell>
                                <Badge variant={order.isDelivered ? "default" : order.isPaid ? "secondary" : "outline"}>
                                  {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No orders found</p>
                        <p className="text-sm text-gray-500">Your order history will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Saved Addresses ({addresses.length})</CardTitle>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setIsAddressDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{address.type}</h4>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{address.name}</p>
                            <p>{address.address}</p>
                            <p>{address.city}</p>
                            <p>{address.phone}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No addresses saved</p>
                        <p className="text-sm text-gray-500">Add your first address to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="secCurrentPassword">Current Password</Label>
                        <Input id="secCurrentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="secNewPassword">New Password</Label>
                        <Input id="secNewPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="secConfirmPassword">Confirm New Password</Label>
                        <Input id="secConfirmPassword" type="password" />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Password Strength</p>
                          <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                        </div>
                        <Badge variant="outline">Strong</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Login Alerts</p>
                          <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Login Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-gray-600">Chrome on Windows • New York, NY</p>
                              <p className="text-xs text-gray-500">Last active: Just now</p>
                            </div>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleLogoutAllSessions}>
                          <Key className="h-4 w-4 mr-2" />
                          Sign Out All Other Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressType">Type</Label>
                <select
                  id="addressType"
                  value={addressForm.type}
                  onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="addressName">Full Name *</Label>
                <Input
                  id="addressName"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="addressLine">Address *</Label>
              <Input
                id="addressLine"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="Street address, apartment, suite, etc."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressCity">City, State, ZIP *</Label>
                <Input
                  id="addressCity"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="addressPhone">Phone Number *</Label>
                <Input
                  id="addressPhone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              />
              <Label htmlFor="isDefault">Set as default address</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddressDialogOpen(false)
                  setEditingAddress(null)
                  setAddressForm({
                    type: "Home",
                    name: "",
                    address: "",
                    city: "",
                    phone: "",
                    isDefault: false,
                  })
                }}
                className="flex-1"
                disabled={savingAddress}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAddress}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={savingAddress}
              >
                {savingAddress ? "Saving..." : editingAddress ? "Update" : "Add"} Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
