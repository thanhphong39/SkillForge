import React, { useState } from 'react';
import { Search, Filter, Lock, Unlock, CheckCircle, XCircle, Plus, Eye } from 'lucide-react';
import { Tenant } from '../types';

interface TenantManagementProps {
  tenants: Tenant[];
  onUpdateTenantStatus: (id: string, status: 'active' | 'locked') => void;
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'registeredAt'>) => void;
}

export const TenantManagement: React.FC<TenantManagementProps> = ({
  tenants,
  onUpdateTenantStatus,
  onAddTenant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Tenant | null>(null);

  // New tenant form state
  const [newTenant, setNewTenant] = useState({
    name: '',
    packageType: 'Starter' as Tenant['packageType'],
    employeeCount: 10,
    adminName: '',
    adminEmail: '',
    status: 'active' as Tenant['status'],
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.adminEmail) {
      alert('Vui lòng nhập tên công ty và email admin!');
      return;
    }
    onAddTenant(newTenant);
    setShowAddModal(false);
    setNewTenant({
      name: '',
      packageType: 'Starter',
      employeeCount: 10,
      adminName: '',
      adminEmail: '',
      status: 'active',
    });
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = selectedPackage === 'All' || t.packageType === selectedPackage;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesPackage && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên công ty hoặc email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Package filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedPackage}
              onChange={e => setSelectedPackage(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="All">Tất cả gói dịch vụ</option>
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đang bị khóa</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/10 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Khai sinh Doanh nghiệp
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Tên Doanh nghiệp</th>
                <th className="px-6 py-4">Ngày đăng ký</th>
                <th className="px-6 py-4">Gói đang dùng</th>
                <th className="px-6 py-4 text-center">Số lượng nhân sự</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.length > 0 ? (
                filteredTenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="px-6 py-4.5 font-bold text-slate-950">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p>{tenant.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{tenant.adminEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-slate-500">
                      {new Date(tenant.registeredAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        tenant.packageType === 'Enterprise' 
                          ? 'bg-purple-50 text-purple-700' 
                          : tenant.packageType === 'Growth' 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'bg-sky-50 text-sky-700'
                      }`}>
                        {tenant.packageType}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center font-semibold text-slate-700">
                      {tenant.employeeCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tenant.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {tenant.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Locked
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDetailModal(tenant)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {tenant.status === 'active' ? (
                          <button
                            onClick={() => onUpdateTenantStatus(tenant.id, 'locked')}
                            className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Khóa tài khoản"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateTenantStatus(tenant.id, 'active')}
                            className="p-1.5 rounded-lg border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-600 transition-colors"
                            title="Mở khóa tài khoản"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Không tìm thấy doanh nghiệp nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Details */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Chi tiết Doanh nghiệp</h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-400 font-medium">Tên Doanh nghiệp</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{showDetailModal.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Trạng thái</p>
                  <p className="font-bold mt-0.5">
                    <span className={showDetailModal.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}>
                      {showDetailModal.status === 'active' ? 'Đang hoạt động' : 'Đang bị khóa'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <span className="text-slate-400">Người đại diện (Admin)</span>
                  <span className="font-semibold text-slate-800">{showDetailModal.adminName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <span className="text-slate-400">Email quản trị</span>
                  <span className="font-semibold text-slate-800">{showDetailModal.adminEmail}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <span className="text-slate-400">Ngày đăng ký hệ thống</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(showDetailModal.registeredAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <span className="text-slate-400">Gói sản phẩm hiện tại</span>
                  <span className="font-bold text-blue-600">{showDetailModal.packageType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <span className="text-slate-400">Giới hạn số lượng nhân sự</span>
                  <span className="font-semibold text-slate-800">{showDetailModal.employeeCount} tài khoản</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              {showDetailModal.status === 'active' ? (
                <button
                  onClick={() => {
                    onUpdateTenantStatus(showDetailModal.id, 'locked');
                    setShowDetailModal(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-rose-500/10 transition-colors"
                >
                  Khóa doanh nghiệp
                </button>
              ) : (
                <button
                  onClick={() => {
                    onUpdateTenantStatus(showDetailModal.id, 'active');
                    setShowDetailModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-colors"
                >
                  Kích hoạt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Tenant */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Khởi tạo Doanh nghiệp mới (Tenant)</h3>
            
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">Tên Công ty / Tổ chức</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty Cổ phần A"
                  value={newTenant.name}
                  onChange={e => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">Gói dịch vụ</label>
                  <select
                    value={newTenant.packageType}
                    onChange={e => setNewTenant(prev => ({ ...prev, packageType: e.target.value as Tenant['packageType'] }))}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">Hạn mức nhân sự</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newTenant.employeeCount}
                    onChange={e => setNewTenant(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 10 }))}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">Tên Người quản trị (Admin)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  value={newTenant.adminName}
                  onChange={e => setNewTenant(prev => ({ ...prev, adminName: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">Email người quản trị</label>
                <input
                  type="email"
                  required
                  placeholder="admin@tencongty.com"
                  value={newTenant.adminEmail}
                  onChange={e => setNewTenant(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/10 transition-colors"
                >
                  Kích hoạt ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
