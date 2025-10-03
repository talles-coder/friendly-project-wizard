export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role: "admin" | "afiliado" | "polo";
  status?: string;
  firstAccess?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildCoupon {
  id: string;
  affiliateId: string;
  affiliateName: string;
  couponCode: string;
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
  minPurchaseAmount?: number;
  startDate: string;
  validFrom?: string;
  validUntil: string;
  isActive: boolean;
  uniquePerCpf?: boolean;
  affiliateId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  // Cupons Filhos
  childCoupons?: ChildCoupon[];
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

export interface BankData {
  repasseType?: 'pix' | 'bank_data';
  // Campos PIX
  pixKey?: string;
  pixName?: string;
  pixBank?: string;
  // Campos bancários
  bankCode: string;
  bankName: string;
  agency: string;
  account: string;
  // Novos campos adicionados
  bankAgency?: string;
  bankAccount?: string;
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
  affiliateCode?: string;
  partnershipStartDate: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  subscriptionCommissionRate: number;
  subscriptionCommissionType: "percentage" | "fixed";
  status?: string;
  notes?: string;
  paymentType: "pix" | "bank";
  pixData?: {
    pixKey: string;
    fullName: string;
    bank: string;
  };
  bankData?: BankData;
  socialNetworks: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
  };
  experience?: string;
  motivation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardData {
  membershipRevenue: number;
  totalUsedCoupons: number;
  couponUsageRate: number;
  topCoupons: Coupon[];
}