import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/qmb-ohs';

async function setupLocalDB() {
  try {
    console.log('Connecting to MongoDB Local...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Local!');

    // Define User schema (same as in models/User.ts)
    const userSchema = new mongoose.Schema({
      idKaryawan: { type: String, required: true, unique: true },
      nama: { type: String, required: true },
      jabatan: { type: String, required: true },
      departemen: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'supervisor', 'admin'], default: 'user' },
      approved: { type: Boolean, default: true },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ idKaryawan: 'admin' });

    if (existingAdmin) {
      console.log('✅ User admin already exists!');
      console.log('Current data:');
      console.log(`  ID: ${existingAdmin.idKaryawan}`);
      console.log(`  Name: ${existingAdmin.nama}`);
      console.log(`  Role: ${existingAdmin.role}`);
      console.log(`  Approved: ${existingAdmin.approved}`);

      // Reset password to admin123
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await User.updateOne(
        { idKaryawan: 'admin' },
        { $set: { password: hashedPassword, approved: true } }
      );

      console.log('\n✅ Password reset to: admin123');
    } else {
      // Create admin user
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = new User({
        idKaryawan: 'admin',
        nama: 'Administrator',
        jabatan: 'System Administrator',
        departemen: 'IT',
        password: hashedPassword,
        role: 'admin',
        approved: true,
      });

      await admin.save();
      console.log('\n✅ Admin user created!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Setup complete!');
    console.log('\nLogin with:');
    console.log('  ID Karyawan: admin');
    console.log('  Password: admin123');
    console.log('\nStart dev server with: npm run dev');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupLocalDB();
