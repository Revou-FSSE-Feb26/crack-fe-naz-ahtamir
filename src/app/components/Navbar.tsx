"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

const moreLinks = [
  { name: "Programs", href: "/programs" },
  { name: "Gallery", href: "/gallery" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Report", href: "/contact" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Tutup semua saat route berubah
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setAvatarOpen(false);
  }, [pathname]);

  // Lock scroll saat mobile menu buka
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  const linkClass = (href: string) =>
    `font-barlow-condensed text-[12px] tracking-[0.1em] uppercase px-3 py-2 transition-colors ${
      isActive(href)
        ? "text-[#f15a22]"
        : "text-[#c5c0bb] hover:text-white"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#231f20] border-b-[3px] border-b-[#f15a22]">
        <div className="h-[72px] flex items-center justify-between px-5 md:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-[#f15a22] flex items-center justify-center
                            text-white font-barlow-condensed font-extrabold text-base">
              
            </div>
            <div className="hidden sm:block">
              <div className="font-barlow-condensed font-bold text-sm text-white
                              uppercase tracking-wider leading-tight">
                ERM Department
              </div>
              <div className="font-barlow-condensed text-[10px] text-[#c5c0bb]
                              tracking-[0.12em] uppercase">
                PT. QMB New Energy Materials
              </div>
            </div>
            {/* Mobile fallback */}
            <div className="sm:hidden font-barlow-condensed font-bold text-xs
                            text-white uppercase tracking-wider">
              ERM Department
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Public links */}
            {publicLinks.map(link => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(prev => !prev)}
                className={`flex items-center gap-1 font-barlow-condensed text-[12px]
                            tracking-[0.1em] uppercase px-3 py-2 transition-colors
                            ${moreLinks.some(l => isActive(l.href))
                              ? "text-[#f15a22]"
                              : "text-[#c5c0bb] hover:text-white"
                            }`}
              >
                More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12" height="12"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-48
                                bg-[#231f20] border border-[#3a3535]
                                shadow-lg py-1 z-50">
                  {moreLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 font-barlow-condensed text-[12px]
                                  tracking-[0.08em] uppercase transition-colors
                                  ${isActive(link.href)
                                    ? "text-[#f15a22] bg-white/5"
                                    : "text-[#c5c0bb] hover:text-white hover:bg-white/5"
                                  }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-[#3a3535] mx-2" />

            {/* SMK3 — hanya jika login */}
            {isAuthenticated && (
              <Link
                href="/smk3"
                className={`font-barlow-condensed text-[12px] tracking-[0.1em]
                            uppercase px-3 py-1.5 border transition-colors
                            ${isActive("/smk3")
                              ? "border-[#f15a22] text-[#f15a22] bg-[#f15a22]/10"
                              : "border-[#f15a22] text-[#f15a22] hover:bg-[#f15a22] hover:text-white"
                            }`}
              >
                SMK3
              </Link>
            )}

            {/* Auth area */}
            {isAuthenticated ? (
              <div className="relative ml-2" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen(prev => !prev)}
                  className="w-8 h-8 rounded-full bg-[#f15a22] flex items-center
                             justify-center text-white font-barlow-condensed
                             font-bold text-sm hover:bg-[#f7941d] transition-colors"
                >
                  {userInitial}
                </button>

                {avatarOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48
                                  bg-[#231f20] border border-[#3a3535]
                                  shadow-lg py-1 z-50">
                    {/* User info */}
                    <div className="px-4 py-2.5 border-b border-[#3a3535]">
                      <div className="font-barlow-condensed font-bold text-[12px]
                                      text-white uppercase tracking-wide truncate">
                        {session?.user?.name}
                      </div>
                      <div className="text-[11px] text-[#6b6560] truncate">
                        {session?.user?.email}
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5
                                   font-barlow-condensed text-[12px] tracking-[0.08em]
                                   uppercase text-[#f15a22] hover:bg-white/5
                                   transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5
                                 font-barlow-condensed text-[12px] tracking-[0.08em]
                                 uppercase text-[#c5c0bb] hover:text-white
                                 hover:bg-white/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="font-barlow-condensed text-[12px] tracking-[0.1em]
                           uppercase text-[#f15a22] px-3 py-2
                           hover:text-white transition-colors ml-1"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 z-50"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300
                              ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300
                              ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300
                              ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300
                    ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-[72px] right-0 bottom-0 w-[280px] bg-[#231f20] z-40
                    lg:hidden transform transition-transform duration-300 overflow-y-auto
                    ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="py-4">

          {/* User info jika login */}
          {isAuthenticated && (
            <div className="px-5 pb-4 mb-2 border-b border-[#3a3535]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f15a22] rounded-full flex items-center
                                justify-content text-white font-barlow-condensed
                                font-bold text-sm flex-shrink-0 justify-center">
                  {userInitial}
                </div>
                <div className="overflow-hidden">
                  <div className="font-barlow-condensed font-bold text-sm text-white truncate">
                    {session?.user?.name}
                  </div>
                  <div className="text-[11px] text-[#6b6560] truncate">
                    {session?.user?.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="px-3 space-y-0.5">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-barlow-condensed font-semibold text-sm
                            tracking-wider uppercase py-2.5 px-4 transition-all
                            ${isActive(link.href)
                              ? "bg-[#f15a22] text-white"
                              : "text-[#c5c0bb] hover:bg-white/5 hover:text-white"
                            }`}
              >
                {link.name}
              </Link>
            ))}

            {/* More section */}
            <div className="pt-2 pb-1 px-4">
              <div className="font-barlow-condensed text-[10px] tracking-[0.2em]
                              uppercase text-[#6b6560]">
                More
              </div>
            </div>
            {moreLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-barlow-condensed font-semibold text-sm
                            tracking-wider uppercase py-2.5 px-4 transition-all
                            ${isActive(link.href)
                              ? "bg-[#f15a22] text-white"
                              : "text-[#c5c0bb] hover:bg-white/5 hover:text-white"
                            }`}
              >
                {link.name}
              </Link>
            ))}

            {/* SMK3 - hanya jika login */}
            {isAuthenticated && (
              <>
                <div className="pt-2 pb-1 px-4">
                  <div className="font-barlow-condensed text-[10px] tracking-[0.2em]
                                  uppercase text-[#6b6560]">
                    Internal
                  </div>
                </div>
                <Link
                  href="/smk3"
                  className={`block font-barlow-condensed font-semibold text-sm
                              tracking-wider uppercase py-2.5 px-4 transition-all
                              ${isActive("/smk3")
                                ? "bg-[#f15a22] text-white"
                                : "text-[#f15a22] hover:bg-[#f15a22]/10"
                              }`}
                >
                  SMK3
                </Link>
              </>
            )}
          </div>

          {/* Auth */}
          <div className="mt-4 pt-4 border-t border-[#3a3535] px-3 space-y-0.5">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block font-barlow-condensed font-semibold text-sm
                               tracking-wider uppercase py-2.5 px-4 text-[#f15a22]
                               hover:bg-white/5 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left font-barlow-condensed font-semibold
                             text-sm tracking-wider uppercase py-2.5 px-4 text-[#c5c0bb]
                             hover:bg-white/5 hover:text-white transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block font-barlow-condensed font-semibold text-sm
                           tracking-wider uppercase py-2.5 px-4 text-[#f15a22]
                           hover:bg-white/5 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}