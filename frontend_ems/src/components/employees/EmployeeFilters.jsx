import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import { DEPARTMENTS, STATUS_OPTIONS, SORT_OPTIONS } from '../../utils/constants';

const EmployeeFilters = ({
  search,
  department,
  status,
  sortBy,
  order,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onSortByChange,
  onOrderToggle,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, role, phone..."
            className="block w-full rounded-lg border border-gray-300 pl-9 pr-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Department Filter */}
        <div className="lg:col-span-3">
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="lg:col-span-2 flex items-center space-x-1.5">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onOrderToggle}
            title={`Sort ${order === 'asc' ? 'Ascending' : 'Descending'}`}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Reset Filter Button */}
        <div className="lg:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            title="Reset Filters"
            className="w-full sm:w-auto inline-flex items-center justify-center p-2 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4 sm:mr-0 mr-1.5" />
            <span className="sm:hidden text-xs">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;
