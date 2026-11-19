import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock, LogIn, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidEmail } from '../../utils/validation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const target =
        location.state?.from?.pathname ||
        (user.role === 'admin' ? '/dashboard' : '/profile');
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`);
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const handleFillDemo = (email, password) => {
    setFormData({ email, password });
    setValidationErrors({});
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900">Sign in to your account</h3>
        <p className="text-xs text-gray-500 mt-1">
          Enter your credentials to access the system
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          required
          icon={Mail}
          error={validationErrors.email}
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
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          icon={LogIn}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Demo credentials helper for quick review */}
      <div className="mt-6 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-gray-600 space-y-2">
        <div className="flex items-center space-x-1.5 font-semibold text-indigo-900">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <span>Demo Credentials (Click to Autofill)</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('admin@ems.com', 'Admin@12345')}
            className="flex-1 text-left px-2.5 py-1.5 bg-white rounded border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <span className="font-semibold text-indigo-700 block">Admin (Uttam):</span>
            <span className="text-[11px] text-gray-500 block">admin@ems.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('aarav.sharma@ems.com', 'Password123')}
            className="flex-1 text-left px-2.5 py-1.5 bg-white rounded border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <span className="font-semibold text-emerald-700 block">Employee (Aarav):</span>
            <span className="text-[11px] text-gray-500 block">aarav.sharma@ems.com</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-600">
        Don&apos;t have an employee account?{' '}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
        >
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
