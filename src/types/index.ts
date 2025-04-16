
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: "admin" | "afiliado";
}

export interface Coupon {
  id: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  availableQuantity: number;
  usedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
