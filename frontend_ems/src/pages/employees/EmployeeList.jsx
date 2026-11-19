import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  removeEmployee,
} from '../../redux/slices/employeeSlice';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeFilters from '../../components/employees/EmployeeFilters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employees, pagination, loading } = useSelector(
    (state) => state.employees
  );

  // Filters and pagination state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch employees whenever query params change
  const loadEmployees = useCallback(() => {
    const params = {
      page,
      limit,
      sortBy,
      order,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (department !== 'All') params.department = department;
    if (status !== 'All') params.status = status;

    dispatch(fetchEmployees(params));
  }, [dispatch, page, limit, debouncedSearch, department, status, sortBy, order]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDepartment('All');
    setStatus('All');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  const handleView = (employee) => {
    navigate(`/employees/${employee._id}`);
  };

  const handleEdit = (employee) => {
    navigate(`/employees/${employee._id}/edit`);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      setIsDeleting(true);
      const res = await dispatch(removeEmployee(employeeToDelete._id));
      if (removeEmployee.fulfilled.match(res)) {
        toast.success(`Employee ${employeeToDelete.name} deleted successfully`);
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
        // Refresh page or list
        loadEmployees();
      } else {
        toast.error(res.payload || 'Failed to delete employee');
      }
    } catch {
      toast.error('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalRecords = pagination?.totalRecords || 0;
  const totalPages = pagination?.totalPages || 1;
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalRecords);

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your company workforce, credentials and departments
          </p>
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => navigate('/employees/add')}
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter Toolbar */}
      <EmployeeFilters
        search={search}
        department={department}
        status={status}
        sortBy={sortBy}
        order={order}
        onSearchChange={setSearch}
        onDepartmentChange={(dept) => {
          setDepartment(dept);
          setPage(1);
        }}
        onStatusChange={(st) => {
          setStatus(st);
          setPage(1);
        }}
        onSortByChange={setSortBy}
        onOrderToggle={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onReset={handleResetFilters}
      />

      {/* Employee Data Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Pagination Controls */}
      {totalRecords > 0 && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{startRecord}</span> to{' '}
              <span className="font-semibold text-gray-900">{endRecord}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalRecords}</span> entries
            </span>
            <div className="flex items-center space-x-1 pl-4 border-l border-gray-200">
              <span className="text-xs text-gray-500">Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 py-1 px-2 text-xs text-gray-700 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>

            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete employee "${employeeToDelete?.name}"? All associated data will be permanently removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default EmployeeList;
