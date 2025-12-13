import React from "react";
import { Shield, Activity, Settings } from "lucide-react";
import { PermissionStats as StatsType } from "../../types/permission";

interface PermissionStatsProps {
  stats: StatsType;
}

export const PermissionStats: React.FC<PermissionStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {/* Total Card */}
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Permissions
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Active Card */}
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Inactive Card */}
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Settings className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
