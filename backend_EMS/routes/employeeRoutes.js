const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createEmployeeValidator,
  updateEmployeeValidator,
} = require('../validators/employeeValidator');

// Apply protection to all employee routes
router.use(protect);

router
  .route('/')
  .post(authorize('admin'), createEmployeeValidator, validate, createEmployee)
  .get(authorize('admin'), getEmployees);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployeeValidator, validate, updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
