const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');

const initialEmployees = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@ems.com',
    password: 'Password123',
    phone: '+91 98765 43210',
    department: 'Engineering',
    designation: 'Lead Software Architect',
    joiningDate: new Date('2024-02-15'),
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@ems.com',
    password: 'Password123',
    phone: '+91 98230 12345',
    department: 'Sales',
    designation: 'Regional Sales Manager',
    joiningDate: new Date('2024-03-01'),
    address: 'B-12, Sea Breeze Apartments, Bandra West, Mumbai, Maharashtra 400050',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@ems.com',
    password: 'Password123',
    phone: '+91 97401 23456',
    department: 'Human Resources',
    designation: 'HR Specialist',
    joiningDate: new Date('2024-04-10'),
    address: '24, TTK Road, Alwarpet, Chennai, Tamil Nadu 600018',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@ems.com',
    password: 'Password123',
    phone: '+91 98112 34567',
    department: 'Marketing',
    designation: 'Marketing Director',
    joiningDate: new Date('2024-05-20'),
    address: 'Plot 55, Sector 44, Gurugram, Haryana 122003',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@ems.com',
    password: 'Password123',
    phone: '+91 99280 12345',
    department: 'Operations',
    designation: 'Operations Coordinator',
    joiningDate: new Date('2024-06-05'),
    address: 'C-89, Malviya Nagar, Jaipur, Rajasthan 302017',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Sneha Rao',
    email: 'sneha.rao@ems.com',
    password: 'Password123',
    phone: '+91 98450 67890',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    joiningDate: new Date('2024-07-12'),
    address: 'Tower 3, Hitec City, Madhapur, Hyderabad, Telangana 500081',
    role: 'employee',
    status: 'active',
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@ems.com',
    password: 'Password123',
    phone: '+91 98300 54321',
    department: 'Marketing',
    designation: 'Junior Associate',
    joiningDate: new Date('2024-08-01'),
    address: 'Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091',
    role: 'employee',
    status: 'inactive',
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@ems.com',
    password: 'Password123',
    phone: '+91 98101 23456',
    department: 'Engineering',
    designation: 'Frontend Engineer',
    joiningDate: new Date('2024-09-18'),
    address: 'Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057',
    role: 'employee',
    status: 'active',
  },
];

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ems.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'Uttam Sharma';

    // 1. Seed Admin
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: '+91 98765 43210',
        department: 'Management',
        designation: 'System Administrator',
        joiningDate: new Date(),
        address: 'Corporate Headquarters, Bengaluru, Karnataka',
        role: 'admin',
        status: 'active',
      });
      console.log(`[Admin Created]: ${admin.email}`);
    } else {
      console.log(`[Admin Exists]: ${admin.email}`);
    }

    // 2. Seed Initial Employees if database has fewer than 5 employees
    const empCount = await User.countDocuments({ role: 'employee' });
    if (empCount < 5) {
      console.log('Seeding initial employees for realistic demonstration...');
      for (const empData of initialEmployees) {
        const exists = await User.findOne({ email: empData.email });
        if (!exists) {
          await User.create(empData);
          console.log(` -> Created Employee: ${empData.name} (${empData.department})`);
        }
      }
      console.log('Initial sample employees populated successfully.');
    } else {
      console.log(`Found ${empCount} existing employees in MongoDB.`);
    }

    console.log('----------------------------------------------------');
    console.log('Default Credentials for Evaluation:');
    console.log(`Admin Account:    ${adminEmail}  /  ${adminPassword}`);
    console.log(`Employee Account: aarav.sharma@ems.com  /  Password123`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed data: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
