const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'employee',
      status: 'active',
    });

    return sendSuccess(res, 201, 'Registration successful. You can now log in.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check account status
    if (user.status === 'inactive') {
      return sendError(
        res,
        403,
        'Your account has been deactivated. Please contact your administrator.'
      );
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getMe = async (req, res, next) => {
  try {

    return sendSuccess(res, 200, 'User details retrieved', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Update only permitted fields - explicitly prevent role and status changes
    const allowedFields = ['name', 'phone', 'address', 'profileImage'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    return sendSuccess(res, 200, 'Profile updated successfully', {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
