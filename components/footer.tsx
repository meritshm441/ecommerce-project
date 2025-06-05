import { mastercard, paypal, visa } from "@/lib/constants/image";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Payment Methods */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Image src={visa} alt="Payment Methods" width={50} height={30} className="h-8" />
            <Image src={paypal} alt="Payment Methods" width={50} height={30} className="h-8" />
            <Image src={mastercard} alt="Payment Methods" width={50} height={30} className="h-8" />
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-sm">2022 Evershop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
