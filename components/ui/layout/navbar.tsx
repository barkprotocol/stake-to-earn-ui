import Link from 'next/link'
import { Button } from '@/components/ui/button'

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/stake", label: "Stake" },
  { href: "/pages/about", label: "About" },
  { href: "/pages/faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <nav className="bg-black/50 backdrop-blur-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              BARK Protocol
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/stake" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Stake
              </Link>
              <Link href="/earn" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Earn
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </div>
          </div>
          <div>
            <Button asChild className="bg-[#D0C8B9] text-gray-900 hover:bg-[#E5DFD3] px-3 py-1.5 rounded-md text-sm font-medium">
              <Link href="/stake">Stake</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

