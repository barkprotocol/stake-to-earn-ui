"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/ui/wallet-button';

const LOGO_URL = "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/stake", label: "Stake" },
  { href: "/pages/about", label: "About" },
  { href: "/pages/faq", label: "FAQ" },
];

export function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const renderLinks = (isMobile = false) =>
    menuLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`${
          isMobile
            ? "block px-3 py-2 text-base"
            : "px-3 py-2 text-sm"
        } rounded-md font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800`}
      >
        {label}
      </Link>
    ));

  return (
    <div className="bg-black text-white">
      <nav className="shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src={LOGO_URL} alt="BARK Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-white">BARK</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">{renderLinks()}</div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                asChild
                className="bg-[#D0C8B9] text-gray-900 hover:bg-[#E5DFD3] px-3 py-1.5 rounded-md text-sm font-medium"
              >
                <Link href="/stake">Stake</Link>
              </Button>
              <WalletButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#D0C8B9] hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">{renderLinks(true)}</div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-4">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

