import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-gray-900">Thank You for Your Order!</CardTitle>
            <p className="text-gray-600 mt-2">Your order has been successfully placed and is being processed.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Order Processing</h4>
                  <p className="text-sm text-gray-600">We'll prepare your items for shipment</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Shipping</h4>
                  <p className="text-sm text-gray-600">Your order will be shipped within 1-2 business days</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Updates</h4>
                  <p className="text-sm text-gray-600">You'll receive email updates on your order status</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Order confirmation and tracking information has been sent to your email address.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View Order History
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
