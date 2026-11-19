import React from 'react';
import { Mail, Phone, Calendar, MapPin, Building, Eye, Edit3, Trash2 } from 'lucide-react';

const EmployeeCard = ({
  employee,
  onView,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  if (!employee) return null;

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
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-base leading-tight">
              {employee.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {employee.designation || 'Staff'}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
            employee.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {employee.status}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="font-medium text-gray-700">
            {employee.department || 'General'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{employee.phone}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>Joined: {formatDate(employee.joiningDate)}</span>
        </div>
        {employee.address && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{employee.address}</span>
          </div>
        )}
      </div>

      {(onView || onEdit || onDelete) && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
          {onView && (
            <button
              onClick={() => onView(employee)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
          )}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-medium flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(employee)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
