"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  idKaryawan: string;
  name: string;
  jabatan: string;
  departemen: string;
  role: string;
  approved: boolean;
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ 
    idKaryawan: "", 
    nama: "", 
    jabatan: "",
    departemen: "",
    password: "", 
    role: "user" 
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/dashboard");
    }
    if (isAuthenticated && user?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setNewUser({ 
          idKaryawan: "", 
          nama: "", 
          jabatan: "",
          departemen: "",
          password: "", 
          role: "user" 
        });
        setShowAddForm(false);
        fetchUsers();
        alert("User created successfully!");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: "approve" }),
      });

      if (res.ok) {
        fetchUsers();
        alert("User approved successfully!");
      } else {
        alert("Failed to approve user");
      }
    } catch (error) {
      console.error("Failed to approve user:", error);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject and remove this user?")) {
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: "reject" }),
      });

      if (res.ok) {
        fetchUsers();
        alert("User rejected successfully!");
      } else {
        alert("Failed to reject user");
      }
    } catch (error) {
      console.error("Failed to reject user:", error);
      alert("Failed to reject user");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
        alert("User role updated successfully!");
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[#e5e0db] rounded" />
          <div className="h-4 w-72 bg-[#e5e0db] rounded" />
          <div className="h-64 bg-[#e5e0db] rounded-lg mt-6" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const pendingUsers = users.filter((u) => !u.approved);
  const approvedUsers = users.filter((u) => u.approved);

  return (
    <div className="min-h-screen bg-[#f1f0ee]">
      {/* Page Header — disesuaikan untuk layout dengan sidebar (tanpa padding navbar) */}
      <div className="bg-[#231f20] px-6 md:px-10 py-8 border-b-[3px] border-b-[#f15a22]">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb navigasi */}
          <div className="flex items-center gap-2 text-[11px] text-[#6b6560] mb-4 flex-wrap">
            <Link href="/" className="hover:text-[#f15a22] transition-colors flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[#f15a22] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-[#f15a22]">Admin Panel</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-2">
                Admin Panel
              </div>
              <h1 className="font-bold text-white text-[clamp(28px,5vw,48px)] leading-tight">
                User Management
              </h1>
              <p className="text-[#8a8580] text-[13px] mt-1">
                Kelola pengguna dan persetujuan akun sistem SMK3
              </p>
            </div>

            {/* Quick navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3a3535] text-[#c5c0bb] text-[12px] font-medium rounded-lg hover:bg-[#f15a22] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3a3535] text-[#c5c0bb] text-[12px] font-medium rounded-lg hover:bg-[#f15a22] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3a3535] text-[#c5c0bb] text-[12px] font-medium rounded-lg hover:bg-[#f15a22] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Safety Complaint
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e0db]">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e0db] flex-wrap gap-3">
              <div>
                <h2 className="font-bold text-[18px] text-[#231f20]">Daftar Pengguna</h2>
                <p className="text-[13px] text-[#6b6560] mt-0.5">
                  {pendingUsers.length} menunggu persetujuan · {approvedUsers.length} disetujui
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setError("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f15a22] text-white font-bold text-[13px] rounded-lg hover:bg-[#d44d1a] transition-colors"
              >
                {showAddForm ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Batal
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambah User
                  </>
                )}
              </button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
              <div className="px-6 py-6 bg-[#faf9f7] border-b border-[#e5e0db]">
                <h3 className="font-bold text-[15px] text-[#231f20] mb-4">Tambah Pengguna Baru</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">ID Karyawan *</label>
                      <input
                        type="text"
                        required
                        value={newUser.idKaryawan}
                        onChange={(e) => setNewUser({ ...newUser, idKaryawan: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Contoh: 82400469"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={newUser.nama}
                        onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">Jabatan *</label>
                      <input
                        type="text"
                        required
                        value={newUser.jabatan}
                        onChange={(e) => setNewUser({ ...newUser, jabatan: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Jabatan / posisi"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">Departemen *</label>
                      <input
                        type="text"
                        required
                        value={newUser.departemen}
                        onChange={(e) => setNewUser({ ...newUser, departemen: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Nama departemen"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">Password *</label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">Role *</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#c5c0bb] text-[14px] text-[#231f20] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                      >
                        <option value="user">User</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[13px]">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#f15a22] text-white font-bold text-[13px] rounded-lg hover:bg-[#d44d1a] transition-colors"
                    >
                      Buat Pengguna
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setError(""); }}
                      className="px-6 py-2.5 bg-[#e5e0db] text-[#231f20] font-bold text-[13px] rounded-lg hover:bg-[#d0cbc6] transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="p-6 space-y-8">
              {/* Pending Users */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#f15a22]" />
                  <h3 className="font-bold text-[15px] text-[#231f20]">
                    Menunggu Persetujuan
                    {pendingUsers.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#f15a22] text-white text-[11px] rounded-full">{pendingUsers.length}</span>
                    )}
                  </h3>
                </div>

                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 bg-[#faf9f7] rounded-lg border border-[#e5e0db]">
                    <svg className="w-10 h-10 text-[#c5c0bb] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[#6b6560] text-[13px]">Tidak ada pengguna yang menunggu persetujuan</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 flex-wrap gap-3">
                        <div>
                          <div className="font-semibold text-[#231f20] text-[14px]">{u.name}</div>
                          <div className="text-[12px] text-[#6b6560] mt-0.5">
                            ID: {u.idKaryawan} · {u.jabatan} · {u.departemen}
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#f15a22]/10 text-[#f15a22] text-[11px] font-bold rounded uppercase">{u.role}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="px-4 py-2 bg-green-500 text-white font-bold text-[12px] rounded-lg hover:bg-green-600 transition-colors"
                          >
                            ✓ Setujui
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            className="px-4 py-2 bg-red-500 text-white font-bold text-[12px] rounded-lg hover:bg-red-600 transition-colors"
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Users */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="font-bold text-[15px] text-[#231f20]">
                    Pengguna Aktif
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[11px] rounded-full">{approvedUsers.length}</span>
                  </h3>
                </div>

                {approvedUsers.length === 0 ? (
                  <div className="text-center py-8 bg-[#faf9f7] rounded-lg border border-[#e5e0db]">
                    <p className="text-[#6b6560] text-[13px]">Belum ada pengguna aktif</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-[#e5e0db]">
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">Nama</th>
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">ID Karyawan</th>
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">Jabatan</th>
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">Departemen</th>
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">Role</th>
                          <th className="text-left py-2 px-3 font-semibold text-[#6b6560] text-[11px] uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f0ee]">
                        {approvedUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-[#faf9f7] transition-colors">
                            <td className="py-3 px-3 font-medium text-[#231f20]">{u.name}</td>
                            <td className="py-3 px-3 text-[#6b6560] font-mono text-[12px]">{u.idKaryawan}</td>
                            <td className="py-3 px-3 text-[#6b6560]">{u.jabatan}</td>
                            <td className="py-3 px-3 text-[#6b6560]">{u.departemen}</td>
                            <td className="py-3 px-3">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="px-2.5 py-1.5 bg-white border border-[#c5c0bb] text-[12px] text-[#231f20] rounded focus:outline-none focus:border-[#f15a22]"
                              >
                                <option value="user">User</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-bold rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Aktif
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c5c0bb] text-[13px] text-[#231f20] font-medium rounded-lg hover:border-[#f15a22] hover:text-[#f15a22] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
                Kembali ke Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c5c0bb] text-[13px] text-[#231f20] font-medium rounded-lg hover:border-[#f15a22] hover:text-[#f15a22] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Halaman Home
              </Link>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f15a22]/10 border border-[#f15a22]/30 text-[13px] text-[#f15a22] font-medium rounded-lg hover:bg-[#f15a22] hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Safety Complaint
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
