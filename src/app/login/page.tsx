"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [idKaryawan, setIdKaryawan] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "authenticated") {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      idKaryawan,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === "Account not approved yet") {
        setError("Akun belum disetujui. Silakan hubungi administrator.");
      } else {
        setError("ID Karyawan atau password salah");
      }
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f15a22]">
        <div className="max-w-7xl mx-auto">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-4">
            Login
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(48px,7vw,88px)]">
            OHS Portal
          </h1>
        </div>
      </div>

      {/* Login Form */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-md mx-auto">
          <div className="bg-[#ffffff] p-8 md:p-10 rounded shadow-sm">
            <div className="text-center mb-8">
              <div className="font-barlow-condensed text-[24px] font-bold uppercase text-[#231f20] mb-2">
                Welcome Back
              </div>
              <p className="text-[14px] text-[#6b6560]">
                Please enter your credentials to access the OHS portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="idKaryawan"
                  className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block"
                >
                  ID Karyawan
                </label>
                <input
                  id="idKaryawan"
                  type="text"
                  value={idKaryawan}
                  onChange={(e) => setIdKaryawan(e.target.value)}
                  className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22] transition-colors"
                  placeholder="Enter your ID Karyawan"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22] transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="w-4 h-4 border-[#c5c0bb] accent-[#f15a22]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-[14px] text-[#6b6560]"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-[14px] text-[#f15a22] hover:text-[#f7941d] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="block w-full px-6 py-3.5 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[12px] tracking-[0.12em] uppercase border-2 border-[#f15a22] hover:bg-[#231f20] hover:border-[#231f20] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-[14px] text-center">
                {error}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-[14px] text-[#6b6560]">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-[#f15a22] hover:text-[#f7941d] transition-colors"
                >
                  Contact administrator
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[14px] text-[#6b6560] hover:text-[#231f20] transition-colors"
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
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
