import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { DEPARTMENTS, STATUS_OPTIONS } from '../../utils/constants';
import { isValidEmail, isValidPhone } from '../../utils/validation';

const EmployeeForm = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  isEdit = false,
  isAdmin = true,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    address: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        password: '',
        phone: initialValues.phone || '',
        department: initialValues.department || 'Engineering',
        designation: initialValues.designation || '',
        joiningDate: initialValues.joiningDate
          ? new Date(initialValues.joiningDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        address: initialValues.address || '',
        status: initialValues.status || 'active',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = 'New password must be at least 6 characters';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    if (isAdmin) {
      if (!formData.department) {
        newErrors.department = 'Department is required';
      }
      if (!formData.designation || formData.designation.trim() === '') {
        newErrors.designation = 'Designation is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload
    const payload = { ...formData };
    if (isEdit && !payload.password) {
      delete payload.password;
    }
    if (!isAdmin) {
      // Employee can only send name, phone, address
      delete payload.department;
      delete payload.designation;
      delete payload.status;
      delete payload.joiningDate;
      delete payload.email;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Sarah Connor"
          required
          error={errors.name}
        />

        {/* Email */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. sarah@company.com"
          required
          disabled={!isAdmin && isEdit}
          error={errors.email}
          helperText={
            !isAdmin && isEdit ? 'Email can only be updated by Administrator' : ''
          }
        />

        {/* Password */}
        <Input
          label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
          required={!isEdit}
          error={errors.password}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 555-0100"
          error={errors.phone}
        />

        {/* Department (Admin only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Department {isAdmin && <span className="text-red-500">*</span>}
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!isAdmin}
            className={`block w-full rounded-lg border py-2.5 px-3.5 text-sm ${
              !isAdmin ? 'bg-gray-100 text-gray-500' : 'bg-white'
            } border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-xs text-red-600">{errors.department}</p>
          )}
        </div>

        {/* Designation (Admin only) */}
        <Input
          label="Designation / Job Title"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g. Full Stack Developer"
          required={isAdmin}
          disabled={!isAdmin}
          error={errors.designation}
        />

        {/* Joining Date (Admin only) */}
        <Input
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={formData.joiningDate}
          onChange={handleChange}
          disabled={!isAdmin}
          error={errors.joiningDate}
        />

        {/* Status (Admin only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Account Status {isAdmin && <span className="text-red-500">*</span>}
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!isAdmin}
            className={`block w-full rounded-lg border py-2.5 px-3.5 text-sm ${
              !isAdmin ? 'bg-gray-100 text-gray-500' : 'bg-white'
            } border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Office / Residential Address
          </label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Corporate Blvd, Suite 400..."
            className="block w-full rounded-lg border border-gray-300 py-2.5 px-3.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {isEdit ? 'Save Changes' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
