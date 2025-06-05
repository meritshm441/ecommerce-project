import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#f9fbfc] flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#666666]">
            Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
          </p>
          <p className="text-sm text-[#666666]">Order #: EV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <div className="space-y-2">
            <Link href="/shop">
              <Button className="w-full bg-[#009cde] hover:bg-[#01589a]">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
