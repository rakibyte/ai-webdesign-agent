"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Logo } from "./logo"
import { DarkModeToggle } from "./dark-mode-toggle"
import { SignedIn, SignedOut, useAuth, UserButton } from "@insforge/nextjs"
import { Spinner } from "./ui/spinner"
import { AuthModal } from "./auth-modal"

const Header = () => {
  const pathname = usePathname()
  const { isLoaded } = useAuth();
  const [isProject, setIsProject] = useState(() => pathname.startsWith('/project/'));

  useEffect(() => {
    const update = () => {
      const onProject =
        pathname.startsWith('/project/') ||
        (typeof window !== 'undefined' && window.location.pathname.startsWith('/project/'));
      setIsProject(onProject);
    };
    update();
    window.addEventListener('popstate', update);
    window.addEventListener('pushstate', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('pushstate', update);
    };
  }, [pathname]);

  return (
    <header className="w-full">
      <div className={cn(
        "w-full flex py-3.5 px-8 items-center justify-between",
        isProject && "absolute top-0 z-50 px-3 py-2 right-0 w-auto"
      )}>

        <div>
          {!isProject && <Logo />}
        </div>

        <div className="flex items-center justify-end gap-3">
          <DarkModeToggle />

          {!isLoaded ? <Spinner className="w-8 h-8" /> : (
            <>
              <SignedOut>
                <AuthModal mode="sign-in" triggerText="Login" triggerVariant="outline" />
                <AuthModal mode="sign-up" triggerText="Sign up" triggerVariant="default" />
              </SignedOut>

              <SignedIn>
                <UserButton
                  mode="simple"
                  afterSignOutUrl="/"
                  showProfile
                />
              </SignedIn>

            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header