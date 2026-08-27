#!/usr/bin/env node

/**
 * Environment Check Script
 * Run: node check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking SMK3 Environment Setup...\n');

// Check .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local NOT FOUND!');
  console.log('   Create .env.local from .env.local.example\n');
  process.exit(1);
}

console.log('✅ .env.local exists');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check required variables
const required = [
  { key: 'MONGODB_URI', description: 'MongoDB connection string' },
  { key: 'NEXTAUTH_URL', description: 'NextAuth base URL' },
  { key: 'NEXTAUTH_SECRET', description: 'NextAuth secret key' },
];

let hasErrors = false;

required.forEach(({ key, description }) => {
  if (!envVars[key] || envVars[key].includes('your-') || envVars[key].includes('username:password')) {
    console.error(`❌ ${key} not configured properly`);
    console.log(`   Description: ${description}`);
    console.log(`   Current value: ${envVars[key] || '(empty)'}\n`);
    hasErrors = true;
  } else {
    console.log(`✅ ${key} configured`);
  }
});

// Check NEXTAUTH_SECRET length
if (envVars.NEXTAUTH_SECRET) {
  if (envVars.NEXTAUTH_SECRET.length < 32) {
    console.warn(`⚠️  NEXTAUTH_SECRET is too short (${envVars.NEXTAUTH_SECRET.length} chars)`);
    console.log('   Recommended: minimum 32 characters');
    console.log('   Generate with: openssl rand -base64 32\n');
  }
}

// Check NEXTAUTH_URL
if (envVars.NEXTAUTH_URL && !envVars.NEXTAUTH_URL.startsWith('http')) {
  console.error('❌ NEXTAUTH_URL must start with http:// or https://');
  hasErrors = true;
}

console.log('\n📦 Package Manager: Bun');

// Check if MongoDB is likely running (basic check)
console.log('\n🗄️  MongoDB Connection:');
if (envVars.MONGODB_URI) {
  if (envVars.MONGODB_URI.includes('localhost') || envVars.MONGODB_URI.includes('127.0.0.1')) {
    console.log('   Using local MongoDB');
    console.log('   ⚠️  Make sure MongoDB is running!');
    console.log('   Start with: docker-compose up -d (if using Docker)');
  } else if (envVars.MONGODB_URI.includes('mongodb.net') || envVars.MONGODB_URI.includes('mongodb+srv')) {
    console.log('   Using MongoDB Atlas (cloud)');
  }
}

console.log('\n🌐 NextAuth URLs:');
console.log(`   Base URL: ${envVars.NEXTAUTH_URL || 'Not set'}`);
console.log(`   Providers: ${envVars.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/providers`);
console.log(`   Session: ${envVars.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/session`);
console.log(`   Sign In: ${envVars.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/signin`);

if (hasErrors) {
  console.log('\n❌ Configuration has errors! Fix them before running the app.\n');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! You can run: bun run dev\n');
  console.log('💡 If you still get errors:');
  console.log('   1. Restart the dev server');
  console.log('   2. Clear browser cache (Ctrl+Shift+R)');
  console.log('   3. Check MongoDB is running');
  console.log('   4. Check terminal for error logs\n');
}
