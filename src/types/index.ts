
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: "admin" | "afiliado" | "polo";
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  subscriptionDiscount: number;
  availableQuantity: number;
  usedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DashboardData {
  membershipRevenue: number;
  totalUsedCoupons: number;
  couponUsageRate: number;
  topCoupons: Coupon[];
}
