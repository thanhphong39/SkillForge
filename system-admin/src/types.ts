export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  registeredAt: string;
  packageType: 'Starter' | 'Growth' | 'Enterprise';
  employeeCount: number;
  status: 'active' | 'locked';
  adminName: string;
  adminEmail: string;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  tenantId: string;
  tenantName: string;
  packageType: 'Starter' | 'Growth' | 'Enterprise';
  cycle: 'monthly' | 'yearly';
  amount: number; // in VND
  paymentMethod: 'momo' | 'vnpay' | 'bank_transfer';
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface KpiTemplate {
  id: string;
  department: string;
  name: string;
  target: string;
  unit: string;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  description: string;
}

export interface BscTemplate {
  id: string;
  industry: string;
  perspective: 'Financial' | 'Customer' | 'Internal Process' | 'Learning & Growth';
  objective: string;
  description: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}
