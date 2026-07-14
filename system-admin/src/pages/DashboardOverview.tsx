import React from 'react';
import { 
  TrendingUp, 
  Building2, 
  Target, 
  Zap 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { Tenant, Invoice } from '../types';

interface DashboardOverviewProps {
  tenants: Tenant[];
  invoices: Invoice[];
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ tenants, invoices }) => {
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  
  const calculateMRR = () => {
    let mrr = 0;
    tenants.forEach(tenant => {
      if (tenant.status === 'active') {
        if (tenant.packageType === 'Starter') mrr += 3500000;
        else if (tenant.packageType === 'Growth') mrr += 8500000;
        else if (tenant.packageType === 'Enterprise') mrr += 16500000;
      }
    });
    return mrr;
  };

  const totalMRR = calculateMRR();
  const totalBscCreated = 5432;
  const renewalRate = 94.6;

  const revenueTrendData = [
    { name: 'T1', MRR: 62000000, ARR: 744000000 },
    { name: 'T2', MRR: 68500000, ARR: 822000000 },
    { name: 'T3', MRR: 81000000, ARR: 972000000 },
    { name: 'T4', MRR: 94500000, ARR: 1134000000 },
    { name: 'T5', MRR: 112000000, ARR: 1344000000 },
    { name: 'T6', MRR: totalMRR, ARR: totalMRR * 12 },
  ];

  const getPackageStats = () => {
    let starterCount = 0;
    let growthCount = 0;
    let enterpriseCount = 0;

    tenants.forEach(t => {
      if (t.status === 'active') {
        if (t.packageType === 'Starter') starterCount++;
        else if (t.packageType === 'Growth') growthCount++;
        else if (t.packageType === 'Enterprise') enterpriseCount++;
      }
    });

    return [
      { name: 'Gói Starter', value: starterCount, revenue: starterCount * 3500000, color: '#38bdf8' },
      { name: 'Gói Growth', value: growthCount, revenue: growthCount * 8500000, color: '#6366f1' },
      { name: 'Gói Enterprise', value: enterpriseCount, revenue: enterpriseCount * 16500000, color: '#4f46e5' },
    ];
  };

  const packageData = getPackageStats();

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Doanh thu hàng tháng (MRR)" 
          value={formatVND(totalMRR)}
          subtext="Ước tính doanh thu đăng ký hoạt động"
          icon={TrendingUp}
          trend={{ value: '14.8%', isPositive: true }}
          iconBgColor="bg-blue-50"
          iconTextColor="text-blue-600"
        />
        <StatCard 
          title="Doanh nghiệp hoạt động" 
          value={`${activeTenantsCount} / ${tenants.length}`}
          subtext="Khách hàng doanh nghiệp SaaS"
          icon={Building2}
          trend={{ value: '2 mới tháng này', isPositive: true }}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
        />
        <StatCard 
          title="Bảng BSC được khởi tạo" 
          value={totalBscCreated.toLocaleString()}
          subtext="Khởi tạo chiến lược toàn hệ thống"
          icon={Target}
          trend={{ value: '12%', isPositive: true }}
          iconBgColor="bg-violet-50"
          iconTextColor="text-violet-600"
        />
        <StatCard 
          title="Tỷ lệ gia hạn gói" 
          value={`${renewalRate}%`}
          subtext="Đo lường mức độ trung thành"
          icon={Zap}
          trend={{ value: '0.4%', isPositive: true }}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Xu hướng doanh thu định kỳ</h3>
              <p className="text-xs text-slate-400">Doanh thu MRR và Ước tính doanh thu hàng năm (ARR)</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                VND tăng trưởng
              </span>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Tr`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatVND(Number(value)), 'Doanh thu']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="MRR" 
                  name="Doanh thu hàng tháng (MRR)" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMRR)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Share Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tỷ trọng doanh thu theo gói</h3>
            <p className="text-xs text-slate-400">Doanh thu đóng góp từ các phân khúc tài khoản</p>
          </div>

          <div className="h-[220px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={packageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="revenue"
                >
                  {packageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatVND(Number(value)), 'Tổng thu']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Doanh Thu</span>
              <span className="text-lg font-extrabold text-slate-800">
                {(totalMRR / 1000000).toFixed(0)}Tr VNĐ
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {packageData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{formatVND(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Giao dịch gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3 font-semibold">Mã hóa đơn</th>
                  <th className="pb-3 font-semibold">Doanh nghiệp</th>
                  <th className="pb-3 font-semibold">Gói</th>
                  <th className="pb-3 font-semibold">Số tiền</th>
                  <th className="pb-3 font-semibold text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{inv.invoiceCode}</td>
                    <td className="py-3 text-slate-600">{inv.tenantName}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        inv.packageType === 'Enterprise' 
                          ? 'bg-purple-50 text-purple-700' 
                          : inv.packageType === 'Growth' 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'bg-sky-50 text-sky-700'
                      }`}>
                        {inv.packageType}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-800">{formatVND(inv.amount)}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : inv.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                      }`}>
                        {inv.status === 'success' ? 'Thành công' : inv.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Hành vi người dùng</h3>
            <p className="text-xs text-slate-400">Các hoạt động thao tác hệ thống nổi bật</p>
          </div>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Tạo mới mục tiêu phòng ban</p>
                <p className="text-[10px] text-slate-400">Đại diện FPT Software thiết lập 12 mục tiêu BSC mới.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Thêm KPI thành viên</p>
                <p className="text-[10px] text-slate-400">Phòng HR Masan Group chỉ định KPI cho 40 quản lý phòng ban.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Cảnh báo hệ thống (Uptime)</p>
                <p className="text-[10px] text-slate-400">Thực hiện kiểm tra cổng thanh toán thành công (99.98% uptime).</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span>Phiên bản Core Engine:</span>
            <span className="font-bold text-slate-800">v2.4.1-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
