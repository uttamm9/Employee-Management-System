import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployeeById,
  updateEmployeeData,
} from '../../redux/slices/employeeSlice';
import { updateUserProfile } from '../../redux/slices/authSlice';
import employeeService from '../../services/employeeService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  MapPin,
  Shield,
  Edit3,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidPhone } from '../../utils/validation';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.auth);
  const isAdmin = authUser?.role === 'admin';

  // Determine target employee ID: from URL params if present, else logged-in user
  const targetId = id || authUser?.id || authUser?._id;
  const isViewingSelf = (authUser?.id || authUser?._id) === targetId;

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal for employee editing their own details
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        // Fetch via employee service by id
        const res = await employeeService.getEmployeeById(id);
        setEmployee(res.data.employee);
      } else {
        // Fetch self profile
        setEmployee(authUser);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to load employee profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id, authUser]);

  const openEditModal = () => {
    if (employee) {
      setEditFormData({
        name: employee.name || '',
        phone: employee.phone || '',
        address: employee.address || '',
      });
      setEditErrors({});
      setEditModalOpen(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEdit = () => {
    const errors = {};
    if (!editFormData.name || editFormData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }
    if (editFormData.phone && !isValidPhone(editFormData.phone)) {
      errors.phone = 'Please provide a valid phone number';
    }
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;

    try {
      setSaving(true);
      if (isViewingSelf) {
        // Update via auth slice
        const res = await dispatch(updateUserProfile(editFormData));
        if (updateUserProfile.fulfilled.match(res)) {
          toast.success('Your profile updated successfully!');
          setEmployee((prev) => ({ ...prev, ...editFormData }));
          setEditModalOpen(false);
        } else {
          toast.error(res.payload || 'Failed to update profile');
        }
      } else {
        // Admin updating employee
        const res = await dispatch(
          updateEmployeeData({ id: targetId, data: editFormData })
        );
        if (updateEmployeeData.fulfilled.match(res)) {
          toast.success('Employee profile updated!');
          setEmployee((prev) => ({ ...prev, ...editFormData }));
          setEditModalOpen(false);
        } else {
          toast.error(res.payload || 'Failed to update profile');
        }
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Loading profile details..." />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-md mx-auto py-12 text-center bg-red-50 border border-red-200 rounded-2xl p-6">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="font-semibold text-red-800 text-lg">Profile Not Found</h3>
        <p className="text-sm text-red-600 mt-1 mb-4">
          {error || 'Unable to retrieve employee profile'}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button if navigated from employee directory */}
      {id && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/employees')}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Employee Directory</span>
          </button>
        </div>
      )}

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Decorative banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 to-indigo-800" />

        <div className="px-6 pb-6 relative">
          {/* Avatar and Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border-2 border-white">
                <div className="w-full h-full rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-3xl">
                  {employee.name ? employee.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="mb-1">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {employee.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {employee.designation || 'Staff'} • {employee.department || 'General'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isAdmin && id ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={() => navigate(`/employees/${id}/edit`)}
                >
                  Edit Full Record
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={openEditModal}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${employee.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
            >
              <span
                className={`w-1.5 h-1.5 mr-1.5 rounded-full ${employee.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
              />
              {employee.status} Account
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              <Shield className="w-3 h-3 mr-1" />
              {employee.role}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              <Building className="w-3 h-3 mr-1 text-gray-500" />
              {employee.department || 'General'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Contact Information</span>
          </h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {employee.phone || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {employee.address || 'No address specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment & Organization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Organization Details</span>
          </h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-start space-x-3">
              <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Designation / Role</p>
                <p className="font-medium text-gray-900">
                  {employee.designation || 'Staff'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-900">
                  {employee.department || 'General'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Joining Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(employee.joiningDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Personal Info Modal for Employee or Quick Profile Update */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Personal Information"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={editFormData.name}
            onChange={handleEditChange}
            required
            error={editErrors.name}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={editFormData.phone}
            onChange={handleEditChange}
            error={editErrors.phone}
            placeholder="0987654321"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Residential Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={editFormData.address}
              onChange={handleEditChange}
              placeholder="Your home or correspondence address"
              className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={saving}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeProfile;
