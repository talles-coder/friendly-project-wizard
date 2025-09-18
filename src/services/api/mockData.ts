import { User, Coupon, Affiliate, DashboardData } from "@/types";

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@example.com",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    role: "admin",
  },
  {
    id: "2",
    name: "Afiliado Teste",
    email: "afiliado@example.com",
    cpf: "987.654.321-00",
    phone: "(11) 91234-5678",
    role: "afiliado",
  },
  {
    id: "3",
    name: "João Silva",
    email: "joao@example.com",
    cpf: "111.222.333-44",
    phone: "(21) 98765-4321",
    role: "afiliado",
  },
  {
    id: "4",
    name: "Maria Oliveira",
    email: "maria@example.com",
    cpf: "555.666.777-88",
    phone: "(31) 98765-4321",
    role: "afiliado",
  },
  {
    id: "5",
    name: "Pedro Santos",
    email: "pedro@example.com",
    cpf: "999.888.777-66",
    phone: "(41) 95555-1234",
    role: "polo",
  },
];

// Mock Coupons
export const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "BLACKFRIDAY2024",
    name: "Black Friday 2024",
    description: "Desconto especial para Black Friday",
    discountType: "percentage",
    discountValue: 25,
    subscriptionDiscount: 0,
    availableQuantity: 100,
    usedCount: 23,
    startDate: "2024-11-20",
    validUntil: "2024-11-30",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "Admin",
    availabilityRules: {
      discountType: "Porcentagem Fixa",
      baseValue: 10,
      unitFilter: "Todos",
      courseFilter: "Todos",
      ingressFormFilter: "Todos",
      userFilter: "Todos",
      initialValidity: "2024-11-20",
      finalValidity: "2024-11-30"
    }
  },
  {
    id: "2",
    code: "WELCOME2024",
    name: "Boas-vindas 2024",
    description: "Desconto de boas-vindas para novos alunos",
    discountType: "fixed",
    discountValue: 50,
    subscriptionDiscount: 0,
    availableQuantity: 500,
    usedCount: 152,
    startDate: "2024-01-01",
    validUntil: "2024-12-31",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "System",
  },
  {
    id: "3",
    code: "SUMMER2024",
    name: "Verão 2024",
    description: "Promoção de verão",
    discountType: "percentage",
    discountValue: 15,
    subscriptionDiscount: 0,
    availableQuantity: 200,
    usedCount: 87,
    startDate: "2024-01-01",
    validUntil: "2024-03-31",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "Marketing",
  },
  {
    id: "4",
    code: "AFILIADO25",
    name: "Desconto Afiliado",
    description: "Desconto exclusivo para afiliados",
    discountType: "percentage",
    discountValue: 25,
    subscriptionDiscount: 0,
    availableQuantity: 50,
    usedCount: 12,
    startDate: "2024-01-01",
    validUntil: "2024-12-31",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "AffiliateManager",
  },
];

// Mock Affiliates
export const MOCK_AFFILIATES: Affiliate[] = [
  {
    id: "1",
    name: "Maria Silva",
    birthDate: "1985-03-15",
    cpf: "123.456.789-00",
    email: "maria@example.com",
    phone: "(11) 99999-1111",
    address: {
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    internalCode: "AFF001234",
    partnershipStartDate: "2024-01-15",
    commissionRate: 5.5,
    commissionType: "percentage",
    notes: "Afiliada com ótimo desempenho em redes sociais",
    paymentType: "pix",
    pixData: {
      pixKey: "maria.silva@email.com",
      fullName: "Maria Silva",
      bank: "Banco do Brasil"
    },
    socialNetworks: {
      facebook: "https://facebook.com/maria.silva",
      instagram: "https://instagram.com/maria.silva",
      youtube: "https://youtube.com/mariasilva"
    }
  },
  {
    id: "2",
    name: "João Santos",
    birthDate: "1990-07-22",
    cpf: "987.654.321-00",
    email: "joao@example.com",
    phone: "(21) 88888-2222",
    address: {
      street: "Av. Atlântica",
      number: "456",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22070-011"
    },
    internalCode: "AFF001235",
    partnershipStartDate: "2024-02-01",
    commissionRate: 150.00,
    commissionType: "fixed",
    notes: "Especialista em marketing digital",
    paymentType: "pix",
    pixData: {
      pixKey: "987.654.321-00",
      fullName: "João Santos",
      bank: "Itaú"
    },
    socialNetworks: {
      instagram: "https://instagram.com/joao.santos",
      tiktok: "https://tiktok.com/@joao.santos"
    }
  },
  {
    id: "3",
    name: "Ana Costa",
    birthDate: "1988-12-05",
    cpf: "456.789.123-00",
    email: "ana@example.com",
    phone: "(31) 77777-3333",
    address: {
      street: "Rua da Liberdade",
      number: "789",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30112-000"
    },
    internalCode: "AFF001236",
    partnershipStartDate: "2024-01-10",
    commissionRate: 7.0,
    commissionType: "percentage",
    notes: "Foco em público jovem universitário",
    paymentType: "bank",
    bankData: {
      bankCode: "237",
      bankName: "Bradesco",
      agency: "3456-7",
      account: "23456-8"
    },
    socialNetworks: {
      facebook: "https://facebook.com/ana.costa",
      tiktok: "https://tiktok.com/@ana.costa",
      youtube: "https://youtube.com/anacosta"
    }
  }
];

// Mock Dashboard Data
export const MOCK_DASHBOARD: DashboardData = {
  membershipRevenue: 125430.50,
  totalUsedCoupons: 274,
  couponUsageRate: 68.5,
  topCoupons: MOCK_COUPONS.slice(0, 3)
};

// Dados auxiliares para formulários
export const MOCK_OPTIONS = {
  units: [
    "Unidade Central",
    "Unidade Norte",
    "Unidade Sul",
    "Unidade Leste",
    "Unidade Oeste"
  ],
  courses: [
    "Administração",
    "Direito",
    "Engenharia",
    "Medicina",
    "Psicologia",
    "Ciências da Computação",
    "Marketing",
    "Pedagogia"
  ],
  ingressForms: [
    "ENEM",
    "Vestibular Tradicional",
    "Transferência Externa",
    "Transferência Interna",
    "Portador de Diploma"
  ],
  semesters: [
    "2024.1",
    "2024.2", 
    "2025.1",
    "2025.2"
  ]
};