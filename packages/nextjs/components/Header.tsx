"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon, //BugAntIcon
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import fc from "~~/public/social-icons/farcaster.png";
import ig from "~~/public/social-icons/instagram.png";
import twitter from "~~/public/social-icons/x.png";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  // {
  //   label: "Home",
  //   href: "/",
  // },
  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/favicon.png" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Pizza People</span>
            <span className="text-xs">The cheesiest ones in town!</span>
          </div>
        </Link>

        <div className="flex space-x-1 ml-5">
          <Link href="https://twitter.com/Nounies1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={twitter.src} alt="x" className="w-7 lg:w-10" />
          </Link>

          <Link href="https://warpcast.com/~/channel/weedies">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fc.src} alt="fc" className="w-7 lg:w-10" />
          </Link>
          <Link href="https://www.instagram.com/bigshottoyworks/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ig.src} alt="ig" className="w-7 lg:w-10" />
          </Link>
        </div>

        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
