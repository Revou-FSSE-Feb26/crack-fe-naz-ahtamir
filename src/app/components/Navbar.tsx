"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About & Policy", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Gallery", href: "/gallery" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "SMK3", href: "/smk3", requireAuth: true },
  { name: "Report", href: "/contact" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#231f20] border-b-[3px] border-b-[#f15a22]">
        <div className="h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] bg-[#f15a22] flex items-center justify-center text-white font-barlow-condensed font-extrabold text-base sm:text-lg tracking-wide">
              
            </div>
            <div className="hidden sm:block font-barlow-condensed font-bold text-sm sm:text-base text-white uppercase leading-tight tracking-wider">
              Safety and Emergency Management Department
              <span className="block font-normal text-[10px] sm:text-[11px] text-[#c5c0bb] tracking-[0.12em]">
                PT. QMB New Energy Materials
              </span>
            </div>
            {/* Mobile logo text */}
            <div className="sm:hidden font-barlow-condensed font-bold text-xs text-white uppercase leading-tight">
              OHS Portal
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              // Skip SMK3 link if not authenticated
              if (link.requireAuth && status !== "authenticated") {
                return null;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-underline font-barlow-condensed text-[11px] xl:text-xs tracking-wider uppercase px-2.5 xl:px-3.5 py-2 transition-colors ${
                    pathname === link.href || (link.href === "/smk3" && pathname.startsWith("/smk3"))
                      ? "text-[#f15a22]"
                      : "text-[#c5c0bb] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Auth buttons - Desktop */}
            {status === "authenticated" ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="nav-underline font-barlow-condensed text-[11px] xl:text-xs tracking-wider uppercase text-[#f15a22] px-2.5 xl:px-3.5 py-2 hover:text-white transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="font-barlow-condensed text-[11px] xl:text-xs tracking-wider uppercase text-[#c5c0bb] px-2.5 xl:px-3.5 py-2 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-barlow-condensed text-[11px] xl:text-xs tracking-wider uppercase text-[#f15a22] px-2.5 xl:px-3.5 py-2 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-0 cursor-pointer z-50"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-[72px] right-0 bottom-0 w-[280px] sm:w-[320px] bg-[#231f20] z-40 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="py-6">
          {/* User Info - if logged in */}
          {status === "authenticated" && session?.user && (
            <div className="px-6 pb-6 mb-6 border-b border-[#3a3535]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f15a22] rounded-full flex items-center justify-center text-white font-barlow-condensed font-bold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-barlow-condensed font-bold text-sm text-white">
                    {session.user.name}
                  </div>
                  <div className="text-xs text-[#c5c0bb]">{session.user.email}</div>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f15a22]/20 rounded text-[#f15a22] text-xs font-barlow-condensed font-bold uppercase tracking-wider">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Admin
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 px-3">
            {navLinks.map((link) => {
              // Skip SMK3 link if not authenticated
              if (link.requireAuth && status !== "authenticated") {
                return null;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block font-barlow-condensed font-semibold text-sm tracking-wider uppercase py-3 px-4 rounded transition-all ${
                    pathname === link.href || (link.href === "/smk3" && pathname.startsWith("/smk3"))
                      ? "bg-[#f15a22] text-white"
                      : "text-[#c5c0bb] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="mt-6 pt-6 border-t border-[#3a3535] px-3 space-y-1">
            {status === "authenticated" ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 font-barlow-condensed font-semibold text-sm tracking-wider uppercase text-[#f15a22] py-3 px-4 rounded hover:bg-white/5 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full font-barlow-condensed font-semibold text-sm tracking-wider uppercase text-[#c5c0bb] py-3 px-4 rounded hover:bg-white/5 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 font-barlow-condensed font-semibold text-sm tracking-wider uppercase text-[#f15a22] py-3 px-4 rounded hover:bg-white/5 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Login
              </Link>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 px-6 pt-6 border-t border-[#3a3535]">
            <div className="text-[10px] text-[#6b6560] uppercase tracking-wider mb-2">
              Safety And Emergency Management Department
            </div>
            <div className="text-xs text-[#c5c0bb] leading-relaxed">
              PT. QMB New Energy Materials
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
