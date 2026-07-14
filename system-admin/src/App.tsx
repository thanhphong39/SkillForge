import React, { useState } from 'react';
import { 
  initialTenants, 
  initialInvoices, 
  initialKpis, 
  initialBscs, 
  initialAuditLogs 
} from './mockData';
import { Tenant, Invoice, KpiTemplate, BscTemplate, AuditLog } from './types';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardOverview } from './pages/DashboardOverview';
import { TenantManagement } from './pages/TenantManagement';
import { BillingRevenue } from './pages/BillingRevenue';
import { TemplateMasterData } from './pages/TemplateMasterData';
import { SettingsPage } from './pages/SettingsPage';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export const App: React.FC = () => {
  // App state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default logged in for easy test, can toggle

  // Database states
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [kpis, setKpis] = useState<KpiTemplate[]>(initialKpis);
  const [bscs, setBscs] = useState<BscTemplate[]>(initialBscs);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('admin@skillforge.vn');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@skillforge.vn') {
      setIsLoggedIn(true);
      setLoginError('');
      // Log audit
      const newLog: AuditLog = {
        id: `log${Date.now()}`,
        adminName: 'Supreme Admin',
        action: 'Đăng nhập Hệ thống',
        target: 'Bàn làm việc Admin',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        ipAddress: '127.0.0.1',
      };
      setAuditLogs(prev => [newLog, ...prev]);
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // State Mutators passed to child views
  const handleUpdateTenantStatus = (id: string, status: 'active' | 'locked') => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    
    // Write audit log
    const tenantName = tenants.find(t => t.id === id)?.name || id;
    const newLog: AuditLog = {
      id: `log${Date.now()}`,
      adminName: 'Supreme Admin',
      action: status === 'active' ? 'Mở khóa doanh nghiệp' : 'Tạm khóa doanh nghiệp',
      target: `${tenantName} (${status})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ipAddress: '192.168.1.45',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddTenant = (newTenantData: Omit<Tenant, 'id' | 'registeredAt'>) => {
    const newTenant: Tenant = {
      ...newTenantData,
      id: `t${tenants.length + 1}`,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setTenants(prev => [newTenant, ...prev]);

    // Create automatic invoice for initialization
    let amount = 3500000;
    if (newTenant.packageType === 'Growth') amount = 8500000;
    else if (newTenant.packageType === 'Enterprise') amount = 16500000;

    const newInvoice: Invoice = {
      id: `inv${invoices.length + 1}`,
      invoiceCode: `SKF-2026-0${invoices.length + 1}`,
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      packageType: newTenant.packageType,
      cycle: 'monthly',
      amount: amount,
      paymentMethod: 'bank_transfer',
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Write audit log
    const newLog: AuditLog = {
      id: `log${Date.now()}`,
      adminName: 'Supreme Admin',
      action: 'Khởi tạo Doanh nghiệp mới',
      target: `${newTenant.name} (${newTenant.packageType})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ipAddress: '192.168.1.45',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddKpi = (newKpiData: Omit<KpiTemplate, 'id'>) => {
    const newKpi: KpiTemplate = {
      ...newKpiData,
      id: `kpi${kpis.length + 1}`,
    };
    setKpis(prev => [newKpi, ...prev]);

    // Write audit log
    const newLog: AuditLog = {
      id: `log${Date.now()}`,
      adminName: 'Supreme Admin',
      action: 'Thêm mới KPI thư viện',
      target: `${newKpi.name} (${newKpi.department})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ipAddress: '192.168.1.45',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddBsc = (newBscData: Omit<BscTemplate, 'id'>) => {
    const newBsc: BscTemplate = {
      ...newBscData,
      id: `bsc${bscs.length + 1}`,
    };
    setBscs(prev => [newBsc, ...prev]);

    // Write audit log
    const newLog: AuditLog = {
      id: `log${Date.now()}`,
      adminName: 'Supreme Admin',
      action: 'Thêm mới Khung BSC mẫu',
      target: `${newBsc.objective} (${newBsc.industry})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ipAddress: '192.168.1.45',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getActiveTabName = () => {
    switch (activeTab) {
      case 'overview': return 'Tổng quan Hệ thống';
      case 'tenants': return 'Quản lý Doanh nghiệp Khách hàng';
      case 'billing': return 'Quản lý Hóa đơn & Tài chính';
      case 'templates': return 'Kho Thư viện Mẫu Chiến lược';
      case 'settings': return 'Cấu hình và Nhật ký Bảo mật';
      default: return 'Hệ thống Quản trị';
    }
  };

  // Render Subpage content based on state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview tenants={tenants} invoices={invoices} />;
      case 'tenants':
        return (
          <TenantManagement 
            tenants={tenants} 
            onUpdateTenantStatus={handleUpdateTenantStatus}
            onAddTenant={handleAddTenant}
          />
        );
      case 'billing':
        return <BillingRevenue invoices={invoices} />;
      case 'templates':
        return (
          <TemplateMasterData 
            kpiTemplates={kpis} 
            bscTemplates={bscs}
            onAddKpi={handleAddKpi}
            onAddBsc={handleAddBsc}
          />
        );
      case 'settings':
        return <SettingsPage auditLogs={auditLogs} />;
      default:
        return <DashboardOverview tenants={tenants} invoices={invoices} />;
    }
  };

  // Login Gate Render
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background graphics for premium styling */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center">
            <div className="p-3.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            SkillForge SaaS Admin
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Hệ thống quản trị tối cao của nền tảng quản trị mục tiêu BSC/KPI
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-900 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Địa chỉ email quản trị
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="block w-full text-xs pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    placeholder="admin@skillforge.vn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mật khẩu tối cao
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="block w-full text-xs pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 bg-slate-950 border-slate-850 rounded-md"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-slate-400">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-slate-500">
                  IP đăng nhập sẽ được ghi lại
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Đăng nhập Hệ thống
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Frame Layout
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar */}
        <Topbar activeTabName={getActiveTabName()} onLogout={handleLogout} />

        {/* Outer body view */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};
