import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({}).select("-password").lean();

    return NextResponse.json(
      users.map((user) => ({
        id: user._id.toString(),
        idKaryawan: user.idKaryawan,
        name: user.nama,
        jabatan: user.jabatan,
        departemen: user.departemen,
        role: user.role,
        approved: user.approved,
        createdAt: user.createdAt,
      }))
    );
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { idKaryawan, nama, jabatan, departemen, password, role } = body;

    // Validation
    if (!idKaryawan || !nama || !jabatan || !departemen || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ idKaryawan: idKaryawan.trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "ID Karyawan already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      idKaryawan: idKaryawan.trim(),
      nama: nama.trim(),
      jabatan: jabatan.trim(),
      departemen: departemen.trim(),
      password: hashedPassword,
      role: ["admin", "supervisor", "user"].includes(role) ? role : "user",
      approved: false, // New users need approval
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id.toString(),
          idKaryawan: newUser.idKaryawan,
          nama: newUser.nama,
          jabatan: newUser.jabatan,
          departemen: newUser.departemen,
          role: newUser.role,
          approved: newUser.approved,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT approve/reject user or update role (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, role } = body;

    await connectDB();

    // Handle approve/reject actions
    if (action) {
      if (!["approve", "reject"].includes(action)) {
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
      }

      if (action === "approve") {
        const user = await User.findByIdAndUpdate(
          userId,
          { approved: true },
          { new: true }
        );

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
          message: "User approved successfully",
          user: {
            id: user._id.toString(),
            idKaryawan: user.idKaryawan,
            approved: user.approved,
          }
        });
      } else {
        // Reject = delete user
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User rejected and removed successfully" });
      }
    }

    // Handle role update
    if (role) {
      if (!["admin", "supervisor", "user"].includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ 
        message: "User role updated successfully",
        user: {
          id: user._id.toString(),
          idKaryawan: user.idKaryawan,
          role: user.role,
        }
      });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
