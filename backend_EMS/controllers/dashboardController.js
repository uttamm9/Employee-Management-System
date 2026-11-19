const User = require('../models/User');
const { sendSuccess } = require('../utils/apiResponse');


const getStats = async (req, res, next) => {
  try {
    // Run metrics calculations concurrently
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalAdmins,
      departmentStats,
      recentlyJoined,
    ] = await Promise.all([
      // Total count of employees (role: employee)
      User.countDocuments({ role: 'employee' }),

      // Active employees
      User.countDocuments({ role: 'employee', status: 'active' }),

      // Inactive employees
      User.countDocuments({ role: 'employee', status: 'inactive' }),

      // Total admins
      User.countDocuments({ role: 'admin' }),

      // Department-wise distribution using aggregation
      User.aggregate([
        { $match: { role: 'employee' } },
        {
          $group: {
            _id: { $ifNull: ['$department', 'Unassigned'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            department: '$_id',
            count: 1,
          },
        },
      ]),

      // 5 most recently joined employees
      User.find({ role: 'employee' })
        .select('-password')
        .sort({ joiningDate: -1, createdAt: -1 })
        .limit(5),
    ]);

    return sendSuccess(res, 200, 'Dashboard statistics fetched successfully', {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalAdmins,
      departmentStats,
      recentlyJoined,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
};
