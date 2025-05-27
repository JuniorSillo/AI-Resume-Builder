"use client";

import { useState } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userEmail = useAppStore((state) => state.userEmail);
  const userName = useAppStore((state) => state.userName);
  const userSubscription = useAppStore((state) => state.userSubscription);
  const setUserData = useAppStore((state) => state.setUserData);

  const isLoggedIn = !!userEmail;

  const navItems = [
    { label: "Resume Builder", href: "/resume-builder" },
    { label: "Cover Letters", href: "/cover-letters" },
    { label: "Job Matching", href: "/job-matching" },
    { label: "Interviews", href: "/interviews" },
    { label: "Video Resume", href: "/video-resume" },
    { label: "Applications", href: "/applications" },
  ];

  const handleLogin = () => {
    setUserData("demo@example.com", "Demo User", "Free");
  };

  const handleLogout = () => {
    setUserData("", "", "Free");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 dark:bg-background/90 backdrop-blur-sm border-b dark:border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-800 bg-clip-text text-transparent">
              AIResume
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-muted dark:hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${userEmail}`}
                      alt={userName || "User"}
                    />
                    <AvatarFallback className="bg-muted dark:bg-muted text-foreground dark:text-foreground">
                      {userName?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background dark:bg-card border dark:border-border" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground dark:text-foreground">
                      {userName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {userEmail || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border dark:bg-border" />
                <DropdownMenuItem asChild className="hover:bg-muted dark:hover:bg-muted">
                  <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-muted dark:hover:bg-muted">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                {userSubscription !== "Premium" && (
                  <DropdownMenuItem asChild className="text-primary dark:text-primary hover:bg-muted dark:hover:bg-muted">
                    <Link href="/upgrade">Upgrade to Premium</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border dark:bg-border" />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-muted dark:hover:bg-muted">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleLogin}
                className="border-border dark:border-border text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
              >
                Log in
              </Button>
              <Button
                onClick={handleLogin}
                className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t bg-background dark:bg-background border-border dark:border-border">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground dark:text-foreground hover:text-primary dark:hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
      )}
    </header>
  );
}
