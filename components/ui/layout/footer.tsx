import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Discord, Telegram, X } from '@/components/ui/icons/social-media-icons';
import { SubscriptionForm } from './subscription-form';

export function Footer() {
  const socialLinks = [
    { href: 'https://x.com/bark_protocol', icon: X, label: 'Twitter (X)' },
    { href: 'https://github.com/bark-protocol', icon: Github, label: 'GitHub' },
    { href: 'https://discord.gg/bark-protocol', icon: Discord, label: 'Discord' },
    { href: 'https://t.me/bark_protocol', icon: Telegram, label: 'Telegram' },
  ];

  const footerLinks = [
    {
      heading: 'BARK',
      links: [
        { href: '/pages/about', label: 'About' },
        { href: 'https://barkprotocol.net', label: 'Official Website', external: true },
        { href: '/pages/rewards', label: 'Rewards' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { href: '/faq', label: 'FAQ' },
        { href: 'https://docs.barkprotocol.com', label: 'Documentation', external: true },
        { href: '/disclaimer', label: 'Legal Disclaimer' },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <Image
                src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                alt="BARK Protocol Logo"
                width={40}
                height={40}
              />
              <span className="text-white font-semibold text-xl">BARK</span>
            </div>
            <p className="text-gray-400 text-sm">
              Stake your BARK tokens to unlock the power of rewards. Earn BARK reward tokens (TOKEN) effortlessly while
              supporting the ecosystem.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-gray-400 hover:text-gray-300"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            {footerLinks.map(({ heading, links }) => (
              <div key={heading}>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">{heading}</h3>
                <ul className="mt-4 space-y-4">
                  {links.map(({ href, label, external }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        passHref={external}
                        className="text-base text-gray-400 hover:text-gray-300"
                        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                      >
                        {label}
                        {external && <ExternalLink className="inline-block ml-1 h-4 w-4" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscription Form */}
          <div className="mt-12 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-400">
              Stay updated with the latest news and announcements from BARK Protocol.
            </p>
            <SubscriptionForm />
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} BARK Protocol. All rights reserved.
          </p>
          <div className="mt-4 text-sm text-gray-400 xl:text-center">
            Contract Address:{' '}
            <a
              href="https://solscan.io/token/2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-gray-300 hover:text-gray-100"
            >
              2NTv....AkVrg
              <ExternalLink className="inline-block ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

