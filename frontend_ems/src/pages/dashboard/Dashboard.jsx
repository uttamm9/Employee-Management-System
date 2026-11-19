import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  UserPlus,
  Building,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load dashboard metrics';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Loading dashboard analytics..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
        <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
        <Button onClick={fetchStats} variant="outline" size="sm">
          Retry Loading
        </Button>
      </div>
    );
  }

  const {
    totalEmployees = 0,
    activeEmployees = 0,
    inactiveEmployees = 0,
    totalAdmins = 0,
    departmentStats = [],
    recentlyJoined = [],
  } = stats || {};

  const kpiCards = [
    {
      title: 'Total Workforce',
      value: totalEmployees,
      label: 'Registered Employees',
      icon: Users,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      label: `${totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 100}% Active Rate`,
      icon: UserCheck,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      title: 'Inactive Accounts',
      value: inactiveEmployees,
      label: 'Deactivated / On Leave',
      icon: UserX,
      bgColor: 'bg-rose-50 text-rose-600 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      title: 'System Admins',
      value: totalAdmins,
      label: 'Full Privilege Access',
      icon: ShieldCheck,
      bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Workforce Overview
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time HR analytics, employee headcount and department insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => navigate('/employees/add')}
          >
            Add Employee
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/employees')}
          >
            View Directory
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${kpi.iconBg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs font-medium text-gray-500">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                <span>{kpi.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section: Department Distribution & Recently Joined */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">
                  Department Distribution
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {departmentStats.length} Depts
              </span>
            </div>

            {departmentStats.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                No departmental data available yet.
              </p>
            ) : (
              <div className="space-y-3.5 mt-2">
                {departmentStats.map((item, index) => {
                  const percentage =
                    totalEmployees > 0
                      ? Math.round((item.count / totalEmployees) * 100)
                      : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-700">{item.department}</span>
                        <span className="text-gray-500">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>Data aggregated from MongoDB</span>
            <span className="text-indigo-600 font-semibold">100% Real-time</span>
          </div>
        </div>

        {/* Recently Joined Employees */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">
                Recently Joined Employees
              </h3>
            </div>
            <button
              onClick={() => navigate('/employees')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentlyJoined.length === 0 ? (
            <p className="text-sm text-gray-500 py-10 text-center">
              No recently joined employees.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentlyJoined.map((emp) => (
                <div
                  key={emp._id}
                  onClick={() => navigate(`/employees/${emp._id}`)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50/80 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs shrink-0">
                      {emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {emp.designation || 'Staff'} • {emp.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                        emp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {emp.status}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
