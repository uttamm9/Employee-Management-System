import React from 'react';
import { Eye, Edit3, Trash2, Calendar, Phone, Mail, UserX } from 'lucide-react';
import Loader from '../common/Loader';

const EmployeeTable = ({
  employees = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-12 text-center">
        <Loader text="Loading employee records..." />
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">No Employees Found</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          No records match your search criteria. Try modifying your filters or add a new employee.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Employee
              </th>
              <th scope="col" className="px-5 py-3.5">
                Contact
              </th>
              <th scope="col" className="px-5 py-3.5">
                Department & Role
              </th>
              <th scope="col" className="px-5 py-3.5">
                Joining Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="hover:bg-gray-50/80 transition-colors"
              >
                {/* Employee info */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {employee._id.slice(-6).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact info */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                      <span>{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Department & Designation */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.designation || 'Staff'}
                  </div>
                  <div className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {employee.department || 'General'}
                  </div>
                </td>

                {/* Joining date */}
                <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                    <span>{formatDate(employee.joiningDate)}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      employee.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                        employee.status === 'active'
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    {employee.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center space-x-1">
                    <button
                      onClick={() => onView && onView(employee)}
                      title="View Profile"
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(employee)}
                      title="Edit Employee"
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(employee)}
                      title="Delete Employee"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
