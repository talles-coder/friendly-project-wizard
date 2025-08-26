
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
  // Availability Rules
  availabilityRules?: {
    discountType: string;
    baseValue?: number;
    limitValue?: number;
    unitFilter: string;
    selectedUnits?: string[];
    courseFilter: string;
    selectedCourses?: string[];
    ingressFormFilter: string;
    selectedIngressForms?: string[];
    userFilter: string;
    selectedUsers?: string[];
    semesterFilter?: string;
    selectedSemesters?: string[];
    initialValidity: string;
    finalValidity: string;
  };
}

export interface Affiliate {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  internalCode: string;
  partnershipStartDate: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  notes?: string;
  pixKey: string;
  socialNetworks: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface DashboardData {
  membershipRevenue: number;
  totalUsedCoupons: number;
  couponUsageRate: number;
  topCoupons: Coupon[];
}
