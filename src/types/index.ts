
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
  availableQuantity: number;
  usedCount: number;
  validUntil: string;
}
