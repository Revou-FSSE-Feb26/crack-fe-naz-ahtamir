"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
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
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [status, session, router]);

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

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f15a22]">
        <div className="max-w-7xl mx-auto">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-4">
            Admin Panel
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(48px,7vw,88px)]">
            User Management
          </h1>
        </div>
      </div>

      {/* User Management */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#ffffff] p-8 md:p-10 rounded shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="font-barlow-condensed text-[24px] font-bold uppercase text-[#231f20] mb-2">
                  User Management
                </div>
                <p className="text-[14px] text-[#6b6560]">
                  Add new users and approve pending registrations
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setError("");
                }}
                className="px-6 py-3 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[12px] tracking-[0.12em] uppercase rounded hover:bg-[#231f20] transition-colors"
              >
                {showAddForm ? "Cancel" : "Add User"}
              </button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
              <div className="mb-8 p-6 bg-[#f8f7f5] rounded border border-[#c5c0bb]">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        ID Karyawan *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.idKaryawan}
                        onChange={(e) => setNewUser({ ...newUser, idKaryawan: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Enter ID Karyawan"
                      />
                    </div>
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        Nama *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.nama}
                        onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Enter nama"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        Jabatan *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.jabatan}
                        onChange={(e) => setNewUser({ ...newUser, jabatan: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Enter jabatan"
                      />
                    </div>
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        Departemen *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.departemen}
                        onChange={(e) => setNewUser({ ...newUser, departemen: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Enter departemen"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <label className="font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase text-[#231f20] mb-2 block">
                        Role *
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-4 py-3 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[14px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22]"
                      >
                        <option value="user">User</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-[14px]">
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[12px] tracking-[0.12em] uppercase rounded hover:bg-[#231f20] transition-colors"
                  >
                    Create User
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {/* Pending Users */}
              <div>
                <div className="font-barlow-condensed text-[16px] font-bold uppercase text-[#231f20] mb-3">
                  Pending Users (Need Approval)
                </div>
                <div className="space-y-2">
                  {users.filter((user) => !user.approved).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-[#fff8e1] rounded border border-[#f15a22]"
                    >
                      <div>
                        <div className="font-barlow-condensed font-bold text-[#231f20]">
                          {user.name}
                        </div>
                        <div className="text-[14px] text-[#6b6560]">
                          ID: {user.idKaryawan} | {user.jabatan} - {user.departemen}
                        </div>
                        <div className="font-barlow-condensed text-[12px] text-[#f15a22] mt-1">
                          Role: {user.role}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="px-4 py-2 bg-[#7CFC00] text-[#231f20] font-barlow-condensed font-bold text-[12px] tracking-[0.08em] uppercase rounded hover:bg-[#60c200] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="px-4 py-2 bg-[#ff4444] text-white font-barlow-condensed font-bold text-[12px] tracking-[0.08em] uppercase rounded hover:bg-[#cc0000] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {users.filter((user) => !user.approved).length === 0 && (
                    <div className="text-center py-4 text-[#6b6560]">
                      No pending users
                    </div>
                  )}
                </div>
              </div>

              {/* Approved Users */}
              <div className="pt-6 border-t border-[#c5c0bb]">
                <div className="font-barlow-condensed text-[16px] font-bold uppercase text-[#231f20] mb-3">
                  Approved Users
                </div>
                <div className="space-y-2">
                  {users.filter((user) => user.approved).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-[#f8f7f5] rounded border border-[#c5c0bb]"
                    >
                      <div className="flex-1">
                        <div className="font-barlow-condensed font-bold text-[#231f20]">
                          {user.name}
                        </div>
                        <div className="text-[13px] text-[#6b6560]">
                          ID: {user.idKaryawan} | {user.jabatan} - {user.departemen}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-3 py-2 bg-[#ffffff] border border-[#c5c0bb] font-barlow text-[13px] text-[#231f20] focus:outline-none focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22] rounded"
                        >
                          <option value="user">User</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span className="font-barlow-condensed text-[12px] text-[#7CFC00]">
                          ✓ Approved
                        </span>
                      </div>
                    </div>
                  ))}
                  {users.filter((user) => user.approved).length === 0 && (
                    <div className="text-center py-4 text-[#6b6560]">
                      No approved users yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/dashboard"
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
              Back to Dashboard
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
