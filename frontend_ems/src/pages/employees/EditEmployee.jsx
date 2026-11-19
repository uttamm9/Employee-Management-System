import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployeeById,
  updateEmployeeData,
} from '../../redux/slices/employeeSlice';
import EmployeeForm from '../../components/employees/EmployeeForm';
import Loader from '../../components/common/Loader';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await dispatch(fetchEmployeeById(id));
        if (fetchEmployeeById.fulfilled.match(res)) {
          setEmployee(res.payload);
        } else {
          setError(res.payload || 'Failed to fetch employee record');
        }
      } catch {
        setError('Error loading employee record');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEmployee();
    }
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      const res = await dispatch(
        updateEmployeeData({ id, data: formData })
      );
      if (updateEmployeeData.fulfilled.match(res)) {
        toast.success('Employee record updated successfully!');
        if (isAdmin) {
          navigate('/employees');
        } else {
          navigate('/profile');
        }
      } else {
        toast.error(res.payload || 'Failed to update employee');
      }
    } catch {
      toast.error('An error occurred while saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Loading employee record..." />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center bg-red-50 border border-red-200 rounded-2xl p-6">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="font-semibold text-red-800 text-lg">Unable to Edit</h3>
        <p className="text-sm text-red-600 mt-1 mb-4">{error || 'Employee not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Edit Employee: {employee.name}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Update employee details, credentials and work assignments
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
        <EmployeeForm
          initialValues={employee}
          onSubmit={handleSubmit}
          isLoading={saving}
          isEdit={true}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default EditEmployee;
