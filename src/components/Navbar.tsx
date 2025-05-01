"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, MenuIcon, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            nxtgn<span className="text-primary">fitness</span>
          </span>
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle - Always Visible */}
          <ThemeToggle />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/generate-program"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <DumbbellIcon size={16} />
                  <span>Generate</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  <Link href="/generate-program">Get Started</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant={"outline"}
                    className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="outline"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          {/* User Button - Only show on mobile when signed in */}
          {isSignedIn && (
            <div className="lg:hidden">
              <UserButton />
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border py-4">
            <nav className="container mx-auto px-4 flex flex-col gap-4">
              {isSignedIn ? (
                <>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <HomeIcon size={16} />
                    <span>Home</span>
                  </Link>

                  <Link
                    href="/generate-program"
                    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <DumbbellIcon size={16} />
                    <span>Generate</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </Link>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    <Link href="/generate-program">Get Started</Link>
                  </Button>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                    >
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;