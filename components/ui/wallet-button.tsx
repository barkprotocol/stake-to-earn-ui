'use client'

import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function WalletButton() {
  const { publicKey, wallet, disconnect, select, wallets, connecting } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const buttonClasses = cn(
    "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
    "border border-gray-700 dark:border-gray-200",
    "hover:bg-gray-800 dark:hover:bg-gray-100",
    "py-5 px-6",
    "text-sm font-semibold",
    "transition-colors duration-200"
  )

  const handleDisconnect = useCallback(() => {
    disconnect()
    setIsDropdownOpen(false)
  }, [disconnect])

  const renderConnectedState = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className={buttonClasses}>
          <Wallet className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold">
            {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-58 bg-background/80 backdrop-blur-sm">
        <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
        <DropdownMenuItem>
          {publicKey?.toBase58()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderConnectingState = () => (
    <Button variant="outline" size="lg" className={buttonClasses}>
      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      <span className="text-sm font-semibold">Connecting</span>
    </Button>
  )

  const renderDisconnectedState = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className={buttonClasses}>
          <Wallet className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold">Connect</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-58 bg-background/80 backdrop-blur-sm">
        {wallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.adapter.name}
            onClick={() => {
              select(wallet.adapter.name)
              setIsDropdownOpen(false)
            }}
          >
            {wallet.adapter.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (publicKey) return renderConnectedState()
  if (connecting) return renderConnectingState()
  return renderDisconnectedState()
}
