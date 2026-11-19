import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addEmployee } from '../../redux/slices/employeeSlice';
import EmployeeForm from '../../components/employees/EmployeeForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await dispatch(addEmployee(formData));
      if (addEmployee.fulfilled.match(res)) {
        toast.success(`Employee ${formData.name} added successfully!`);
        navigate('/employees');
      } else {
        toast.error(res.payload || 'Failed to create employee');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Back to Employees"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Register New Employee
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create employee profile and system credentials
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
        <EmployeeForm
          onSubmit={handleSubmit}
          isLoading={loading}
          isEdit={false}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AddEmployee;
