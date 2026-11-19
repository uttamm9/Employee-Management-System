const mongoose = require('mongoose');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');


const createEmployee = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      designation,
      joiningDate,
      address,
      status,
    } = req.body;

    // Check duplicate email
    const existingEmployee = await User.findOne({ email });
    if (existingEmployee) {
      return sendError(res, 400, 'An employee with this email already exists');
    }

    const employee = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      department: department || 'General',
      designation: designation || 'Employee',
      joiningDate: joiningDate || Date.now(),
      address: address || '',
      role: 'employee',
      status: status || 'active',
    });

    return sendSuccess(res, 201, 'Employee created successfully', {
      employee,
    });
  } catch (error) {
    next(error);
  }
};


const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, department, status, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter query
    const query = {};

    // Filter by department (case-insensitive)
    if (department && department !== 'All') {
      query.department = { $regex: new RegExp(`^${department}$`, 'i') };
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { designation: searchRegex },
      ];
    }


    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['name', 'email', 'department', 'designation', 'joiningDate', 'status', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = { [sortField]: sortOrder };


    const [totalRecords, employees] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return sendSuccess(res, 200, 'Employees fetched successfully', {
      employees,
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid employee ID format');
    }


    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return sendError(res, 403, 'Access denied. You can only view your own profile');
    }

    const employee = await User.findById(id).select('-password');
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    return sendSuccess(res, 200, 'Employee details retrieved successfully', {
      employee,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid employee ID format');
    }


    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === id;

    if (!isAdmin && !isSelf) {
      return sendError(res, 403, 'Access denied. You can only update your own profile');
    }

    const employee = await User.findById(id);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }


    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        return sendError(res, 400, 'An employee with this email already exists');
      }
    }

    if (isAdmin) {
      const {
        name,
        email,
        phone,
        department,
        designation,
        joiningDate,
        address,
        status,
        role,
        password,
      } = req.body;

      if (name !== undefined) employee.name = name;
      if (email !== undefined) employee.email = email;
      if (phone !== undefined) employee.phone = phone;
      if (department !== undefined) employee.department = department;
      if (designation !== undefined) employee.designation = designation;
      if (joiningDate !== undefined) employee.joiningDate = joiningDate;
      if (address !== undefined) employee.address = address;
      if (status !== undefined) employee.status = status;
      if (role !== undefined) employee.role = role;
      if (password && password.trim() !== '') employee.password = password;
    } else {
      // Non-admin employee can ONLY update permitted personal info
      const { name, phone, address, profileImage } = req.body;
      if (name !== undefined) employee.name = name;
      if (phone !== undefined) employee.phone = phone;
      if (address !== undefined) employee.address = address;
      if (profileImage !== undefined) employee.profileImage = profileImage;
    }

    const updatedEmployee = await employee.save();

    return sendSuccess(res, 200, 'Employee updated successfully', {
      employee: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};


const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid employee ID format');
    }

    // Prevent accidental deletion of currently logged-in admin account
    if (req.user._id.toString() === id) {
      return sendError(res, 400, 'Cannot delete your own logged-in admin account');
    }

    const employee = await User.findById(id);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    await User.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Employee deleted successfully', {
      id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
