import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidEmail, isValidPhone } from '../../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Please provide a valid phone number';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { name, email, phone, password } = formData;
    const result = await dispatch(registerUser({ name, email, phone, password }));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900">Create an Account</h3>
        <p className="text-xs text-gray-500 mt-1">
          Register for the Employee Self-Service Portal
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
          icon={User}
          error={validationErrors.name}
        />

        <Input
          label="Work Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@company.com"
          required
          icon={Mail}
          error={validationErrors.email}
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 555-0155"
          icon={Phone}
          error={validationErrors.phone}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          icon={Lock}
          error={validationErrors.password}
          helperText="At least 6 characters"
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          icon={Lock}
          error={validationErrors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          icon={UserPlus}
          className="w-full mt-3"
        >
          Register Account
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-gray-600">
        Already registered?{' '}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default Register;
