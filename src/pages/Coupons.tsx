import { useState, useEffect } from "react";
import { Coupon, ChildCoupon, Affiliate } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, X, Link } from "lucide-react";
import { MOCK_AFFILIATES } from "@/services/api/mockData";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

// Gera dados de exemplo atualizados
const generateMockCoupons = (): Coupon[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "1",
      code: "BLACKFRIDAY2023",
      name: "BLACKFRIDAY",
      description: "Desconto para Black Friday",
      discountType: "percentage",
      discountValue: 20,
      subscriptionDiscount: 0,
      availableQuantity: 100,
      usedCount: 23,
      startDate: "2023-11-20",
      validUntil: "2023-11-30",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: "Admin",
    },
    {
      id: "2",
      code: "WELCOME10",
      name: "WELCOME10",
      description: "Desconto de boas-vindas",
      discountType: "fixed",
      discountValue: 10,
      subscriptionDiscount: 0,
      availableQuantity: 500,
      usedCount: 152,
      startDate: "2023-12-01",
      validUntil: "2023-12-31",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: "System",
    },
    {
      id: "3",
      code: "SUMMER2023",
      name: "SUMMER2023",
      description: "Desconto de verão",
      discountType: "percentage",
      discountValue: 15,
      subscriptionDiscount: 0,
      availableQuantity: 200,
      usedCount: 87,
      startDate: "2023-07-01",
      validUntil: "2023-08-31",
      isActive: false,
      createdAt: now,
      updatedAt: now,
      createdBy: "Marketing",
    },
    {
      id: "4",
      code: "AFILIADO20",
      name: "AFILIADO20",
      description: "Desconto exclusivo para afiliados",
      discountType: "percentage",
      discountValue: 20,
      subscriptionDiscount: 0,
      availableQuantity: 50,
      usedCount: 12,
      startDate: "2023-09-01",
      validUntil: "2023-09-15",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: "AffiliateManager",
    },
    {
      id: "5",
      code: "PRIMEIRACOMPRA",
      name: "PRIMEIRACOMPRA",
      description: "Desconto para a primeira compra",
      discountType: "fixed",
      discountValue: 5,
      subscriptionDiscount: 0,
      availableQuantity: 1000,
      usedCount: 345,
      startDate: "2023-01-01",
      validUntil: "2023-12-31",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: "System",
    },
  ];
};

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Coupon>>({});
  const [childCoupons, setChildCoupons] = useState<ChildCoupon[]>([]);
  const [affiliates] = useState<Affiliate[]>(MOCK_AFFILIATES);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("general");
  const [codeError, setCodeError] = useState("");
  const [childCodeErrors, setChildCodeErrors] = useState<{[key: string]: string}>({});
  const itemsPerPage = 10;
  
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";

  // Paginação dos cupons filhos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChildCoupons = childCoupons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(childCoupons.length / itemsPerPage);

  useEffect(() => {
    // Em uma aplicação real, isso seria uma chamada à API
    const storedCoupons = localStorage.getItem("coupons");
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    } else {
      const mockCoupons = generateMockCoupons();
      setCoupons(mockCoupons);
      localStorage.setItem("coupons", JSON.stringify(mockCoupons));
    }
  }, []);

  // Salva os cupons quando há alterações
  const saveCoupons = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
  };

  // Valida se um código de cupom é único
  const validateCouponCode = (code: string, excludeId?: string) => {
    if (!code.trim()) return "";
    
    // Verifica duplicata entre cupons base
    const existingBaseCoupon = coupons.find(
      c => c.code.toLowerCase() === code.toLowerCase() && c.id !== excludeId
    );
    
    if (existingBaseCoupon) {
      return "Este código já está sendo usado por outro cupom base";
    }
    
    // Verifica duplicata entre todos os cupons filhos existentes
    const allChildCoupons = coupons.flatMap(c => c.childCoupons || []);
    const existingChildCoupon = allChildCoupons.find(
      child => child.couponCode.toLowerCase() === code.toLowerCase()
    );
    
    if (existingChildCoupon) {
      return "Este código já está sendo usado por um cupom filho";
    }
    
    return "";
  };

  // Valida se um código de cupom filho é único
  const validateChildCouponCode = (code: string, excludeChildId?: string) => {
    if (!code.trim()) return "";
    
    // Verifica duplicata entre cupons base
    const existingBaseCoupon = coupons.find(
      c => c.code.toLowerCase() === code.toLowerCase()
    );
    
    if (existingBaseCoupon) {
      return "Este código já está sendo usado por um cupom base";
    }
    
    // Verifica duplicata entre cupons filhos atuais
    const duplicateInCurrent = childCoupons.find(
      child => child.couponCode.toLowerCase() === code.toLowerCase() && child.id !== excludeChildId
    );
    
    if (duplicateInCurrent) {
      return "Este código já está sendo usado por outro cupom filho";
    }
    
    // Verifica duplicata entre todos os cupons filhos de outros cupons
    const otherChildCoupons = coupons
      .filter(c => c.id !== selectedCoupon?.id)
      .flatMap(c => c.childCoupons || []);
    
    const existingChildCoupon = otherChildCoupons.find(
      child => child.couponCode.toLowerCase() === code.toLowerCase()
    );
    
    if (existingChildCoupon) {
      return "Este código já está sendo usado por um cupom filho de outro cupom";
    }
    
    return "";
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({ ...coupon });
    setChildCoupons(coupon.childCoupons || []);
    setCurrentPage(1);
    setActiveTab("general");
    setCodeError("");
    setChildCodeErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      const updatedCoupons = coupons.filter((c) => c.id !== selectedCoupon.id);
      saveCoupons(updatedCoupons);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCoupon && editForm) {
      // Valida código único
      const codeValidation = validateCouponCode(editForm.code || "", selectedCoupon.id);
      if (codeValidation) {
        setCodeError(codeValidation);
        toast({
          title: "Erro de validação",
          description: codeValidation,
          variant: "destructive",
        });
        return;
      }

      // Valida códigos dos cupons filhos
      const childErrors: {[key: string]: string} = {};
      for (const child of childCoupons) {
        const error = validateChildCouponCode(child.couponCode, child.id);
        if (error) {
          childErrors[child.id] = error;
        }
      }

      if (Object.keys(childErrors).length > 0) {
        setChildCodeErrors(childErrors);
        toast({
          title: "Erro de validação",
          description: "Existem códigos duplicados nos cupons filhos",
          variant: "destructive",
        });
        return;
      }

      const updatedCoupons = coupons.map((c) =>
        c.id === selectedCoupon.id ? { 
          ...c, 
          ...editForm, 
          childCoupons, 
          updatedAt: new Date().toISOString() 
        } : c
      );
      saveCoupons(updatedCoupons);
      setIsEditDialogOpen(false);
      setChildCoupons([]);
      setCodeError("");
      setChildCodeErrors({});
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      // Valida código único
      const codeValidation = validateCouponCode(editForm.code || "");
      if (codeValidation) {
        setCodeError(codeValidation);
        toast({
          title: "Erro de validação",
          description: codeValidation,
          variant: "destructive",
        });
        return;
      }

      // Valida códigos dos cupons filhos
      const childErrors: {[key: string]: string} = {};
      for (const child of childCoupons) {
        const error = validateChildCouponCode(child.couponCode, child.id);
        if (error) {
          childErrors[child.id] = error;
        }
      }

      if (Object.keys(childErrors).length > 0) {
        setChildCodeErrors(childErrors);
        toast({
          title: "Erro de validação",
          description: "Existem códigos duplicados nos cupons filhos",
          variant: "destructive",
        });
        return;
      }

      const now = new Date().toISOString();
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: editForm.code || "",
        name: editForm.name || "",
        description: editForm.description || "",
        discountType: editForm.discountType || "percentage",
        discountValue: Number(editForm.discountValue) || 0,
        subscriptionDiscount: Number(editForm.subscriptionDiscount) || 0,
        availableQuantity: Number(editForm.availableQuantity) || 0,
        usedCount: 0,
        startDate: editForm.startDate || now.split("T")[0],
        validUntil: editForm.validUntil || now.split("T")[0],
        isActive: editForm.isActive ?? true,
        createdAt: now,
        updatedAt: now,
        createdBy: user?.name || "Unknown",
        childCoupons,
      };
      saveCoupons([...coupons, newCoupon]);
      setIsCreateDialogOpen(false);
      setEditForm({});
      setChildCoupons([]);
      setCodeError("");
      setChildCodeErrors({});
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Funções para gerenciar cupons filhos
  const addChildCoupon = () => {
    const newChildCoupon: ChildCoupon = {
      id: Date.now().toString(),
      affiliateId: "",
      affiliateName: "",
      couponCode: ""
    };
    setChildCoupons([...childCoupons, newChildCoupon]);
  };

  const removeChildCoupon = (id: string) => {
    setChildCoupons(childCoupons.filter(child => child.id !== id));
  };

  const updateChildCoupon = (id: string, updates: Partial<ChildCoupon>) => {
    setChildCoupons(childCoupons.map(child => 
      child.id === id ? { ...child, ...updates } : child
    ));
    
    // Limpa o erro do código quando ele é alterado
    if (updates.couponCode !== undefined) {
      setChildCodeErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCouponCodeChange = (code: string) => {
    setEditForm({ ...editForm, code: code.toUpperCase() });
    setCodeError(""); // Limpa o erro quando o código é alterado
  };

  const handleChildCouponCodeChange = (childId: string, code: string) => {
    updateChildCoupon(childId, { couponCode: code.toUpperCase() });
  };

  const copyToClipboard = async (couponCode: string) => {
    if (!couponCode) {
      toast({
        title: "Erro",
        description: "Código do cupom não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = `http://teste/?cupom=${couponCode}`;
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "O link do cupom foi copiado para o clipboard",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const handleAffiliateChange = (childId: string, affiliateId: string) => {
    const affiliate = affiliates.find(aff => aff.id === affiliateId);
    if (affiliate) {
      updateChildCoupon(childId, {
        affiliateId,
        affiliateName: affiliate.name
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cupons</h1>
        {isAdmin && (
          <Button 
            onClick={() => {
              setEditForm({});
              setChildCoupons([]);
              setCurrentPage(1);
              setActiveTab("general");
              setCodeError("");
              setChildCodeErrors({});
              setIsCreateDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Cupom
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cupom Base</TableHead>
              <TableHead>Quantidade Máxima</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono text-sm">{coupon.code}</TableCell>
                <TableCell className="font-medium">{coupon.name}</TableCell>
                <TableCell>{coupon.availableQuantity}</TableCell>
                <TableCell>{coupon.usedCount}</TableCell>
                <TableCell>{formatDate(coupon.validUntil)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(coupon)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhum cupom encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog (Create/Edit) */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} 
             onOpenChange={(open) => {
               if (!open) {
                 setIsCreateDialogOpen(false);
                 setIsEditDialogOpen(false);
               }
             }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "Novo Cupom" : "Editar Cupom"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do cupom abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={isCreateDialogOpen ? handleCreateSubmit : handleEditSubmit} 
                className="space-y-4 py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Dados Gerais</TabsTrigger>
                <TabsTrigger value="children">Cupons Filhos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código do Cupom</Label>
                    <Input
                      id="code"
                      value={editForm.code || ""}
                      onChange={(e) => handleCouponCodeChange(e.target.value)}
                      placeholder="Ex: DESCONTO50"
                      className={codeError ? "border-red-500" : ""}
                      required
                    />
                    {codeError && (
                      <p className="text-sm text-red-600">{codeError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Cupom Base</Label>
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountType">Tipo de Desconto</Label>
                    <Select
                      value={editForm.discountType || "percentage"}
                      onValueChange={(value) => setEditForm({ ...editForm, discountType: value as "percentage" | "fixed" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentagem</SelectItem>
                        <SelectItem value="fixed">Valor Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Valor do Desconto</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={editForm.discountValue || ""}
                      onChange={(e) => setEditForm({ ...editForm, discountValue: parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableQuantity">Quantidade Máxima (Utilizações)</Label>
                    <Input
                      id="availableQuantity"
                      type="number"
                      value={editForm.availableQuantity || ""}
                      onChange={(e) => setEditForm({ ...editForm, availableQuantity: parseInt(e.target.value) })}
                      placeholder="Número máximo de usos"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={editForm.startDate || ""}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Data de Fim</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={editForm.validUntil || ""}
                      onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={editForm.isActive ?? true}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="uniquePerCpf"
                    checked={editForm.uniquePerCpf ?? false}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, uniquePerCpf: checked })}
                  />
                  <Label htmlFor="uniquePerCpf">Uso único por CPF</Label>
                </div>

                {/* Regras de Disponibilização */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900">Regras de Disponibilização</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rulesDiscountType">Tipo de Desconto das Parcelas</Label>
                      <Select
                        value={editForm.availabilityRules?.discountType || ""}
                        onValueChange={(value) => setEditForm({ 
                          ...editForm, 
                          availabilityRules: { 
                            ...editForm.availabilityRules,
                            discountType: value,
                            baseValue: value === "Nenhum" ? undefined : editForm.availabilityRules?.baseValue,
                            limitValue: value === "Nenhum" ? undefined : editForm.availabilityRules?.limitValue,
                            unitFilter: value === "Nenhum" ? "Todos" : editForm.availabilityRules?.unitFilter || "Todos",
                            courseFilter: value === "Nenhum" ? "Todos" : editForm.availabilityRules?.courseFilter || "Todos",
                            ingressFormFilter: value === "Nenhum" ? "Todos" : editForm.availabilityRules?.ingressFormFilter || "Todos",
                            userFilter: value === "Nenhum" ? "Todos" : editForm.availabilityRules?.userFilter || "Todos",
                            initialValidity: value === "Nenhum" ? "" : editForm.availabilityRules?.initialValidity || "",
                            finalValidity: value === "Nenhum" ? "" : editForm.availabilityRules?.finalValidity || ""
                          } 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nenhum">Nenhum</SelectItem>
                          <SelectItem value="Valor Fixo">Valor Fixo</SelectItem>
                          <SelectItem value="Valor Variável">Valor Variável</SelectItem>
                          <SelectItem value="Porcentagem Fixa">Porcentagem Fixa</SelectItem>
                          <SelectItem value="Porcentagem Variável">Porcentagem Variável</SelectItem>
                          <SelectItem value="Preço Fixo">Preço Fixo</SelectItem>
                          <SelectItem value="Preço Variável">Preço Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {editForm.availabilityRules?.discountType && editForm.availabilityRules.discountType !== "Nenhum" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="baseValue">
                            {["Valor Variável", "Preço Variável"].includes(editForm.availabilityRules.discountType) 
                              ? "Valor Mínimo" 
                              : ["Porcentagem Variável"].includes(editForm.availabilityRules.discountType)
                              ? "Porcentagem Mínima"
                              : ["Valor Fixo", "Preço Fixo"].includes(editForm.availabilityRules.discountType)
                              ? "Valor"
                              : "Porcentagem"
                            }
                          </Label>
                          <div className="relative">
                            <Input
                              id="baseValue"
                              type="number"
                              value={editForm.availabilityRules?.baseValue || ""}
                              onChange={(e) => setEditForm({ 
                                ...editForm, 
                                availabilityRules: { 
                                  ...editForm.availabilityRules!,
                                  baseValue: parseFloat(e.target.value) 
                                } 
                              })}
                              className="pr-12"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                              {["Valor Variável", "Valor Fixo", "Preço Fixo", "Preço Variável"].includes(editForm.availabilityRules.discountType) ? "R$" : "%"}
                            </div>
                          </div>
                        </div>

                        {["Valor Variável", "Porcentagem Variável", "Preço Variável"].includes(editForm.availabilityRules.discountType) && (
                          <div className="space-y-2">
                            <Label htmlFor="limitValue">
                              {["Valor Variável", "Preço Variável"].includes(editForm.availabilityRules.discountType) 
                                ? "Valor Máximo" 
                                : "Porcentagem Máxima"
                              }
                            </Label>
                            <div className="relative">
                              <Input
                                id="limitValue"
                                type="number"
                                value={editForm.availabilityRules?.limitValue || ""}
                                onChange={(e) => setEditForm({ 
                                  ...editForm, 
                                  availabilityRules: { 
                                    ...editForm.availabilityRules!,
                                    limitValue: parseFloat(e.target.value) 
                                  } 
                                })}
                                className="pr-12"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                {["Preço Fixo", "Preço Variável", "Valor Variável", "Valor Fixo"].includes(editForm.availabilityRules.discountType) ? "R$" : "%"}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="unitFilter">Unidade</Label>
                          <div className="flex gap-2">
                            <Select
                              value={editForm.availabilityRules?.unitFilter || "Todos"}
                              onValueChange={(value) => setEditForm({ 
                                ...editForm, 
                                availabilityRules: { 
                                  ...editForm.availabilityRules!,
                                  unitFilter: value,
                                  selectedUnits: value === "Todos" ? [] : editForm.availabilityRules?.selectedUnits
                                } 
                              })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecione a unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todos">Todos</SelectItem>
                                <SelectItem value="Exceto">Exceto</SelectItem>
                                <SelectItem value="Somente">Somente</SelectItem>
                              </SelectContent>
                            </Select>
                            {(editForm.availabilityRules?.unitFilter === "Exceto" || editForm.availabilityRules?.unitFilter === "Somente") && (
                              <Select
                                value={editForm.availabilityRules?.selectedUnits?.[0] || ""}
                                onValueChange={(value) => setEditForm({ 
                                  ...editForm, 
                                  availabilityRules: { 
                                    ...editForm.availabilityRules!,
                                    selectedUnits: [value]
                                  } 
                                })}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Selecionar unidades..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Unidade A">Unidade A</SelectItem>
                                  <SelectItem value="Unidade B">Unidade B</SelectItem>
                                  <SelectItem value="Unidade C">Unidade C</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="courseFilter">Curso</Label>
                          <div className="flex gap-2">
                            <Select
                              value={editForm.availabilityRules?.courseFilter || "Todos"}
                              onValueChange={(value) => setEditForm({ 
                                ...editForm, 
                                availabilityRules: { 
                                  ...editForm.availabilityRules!,
                                  courseFilter: value,
                                  selectedCourses: value === "Todos" ? [] : editForm.availabilityRules?.selectedCourses
                                } 
                              })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecione o curso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todos">Todos</SelectItem>
                                <SelectItem value="Exceto">Exceto</SelectItem>
                                <SelectItem value="Somente">Somente</SelectItem>
                              </SelectContent>
                            </Select>
                            {(editForm.availabilityRules?.courseFilter === "Exceto" || editForm.availabilityRules?.courseFilter === "Somente") && (
                              <Select
                                value={editForm.availabilityRules?.selectedCourses?.[0] || ""}
                                onValueChange={(value) => setEditForm({ 
                                  ...editForm, 
                                  availabilityRules: { 
                                    ...editForm.availabilityRules!,
                                    selectedCourses: [value]
                                  } 
                                })}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Selecionar cursos..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Curso de Medicina">Curso de Medicina</SelectItem>
                                  <SelectItem value="Curso de Direito">Curso de Direito</SelectItem>
                                  <SelectItem value="Curso de Engenharia">Curso de Engenharia</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ingressFormFilter">Forma de Ingresso</Label>
                          <div className="flex gap-2">
                            <Select
                              value={editForm.availabilityRules?.ingressFormFilter || "Todos"}
                              onValueChange={(value) => setEditForm({ 
                                ...editForm, 
                                availabilityRules: { 
                                  ...editForm.availabilityRules!,
                                  ingressFormFilter: value,
                                  selectedIngressForms: value === "Todos" ? [] : editForm.availabilityRules?.selectedIngressForms
                                } 
                              })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecione a forma de ingresso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todos">Todos</SelectItem>
                                <SelectItem value="Exceto">Exceto</SelectItem>
                                <SelectItem value="Somente">Somente</SelectItem>
                              </SelectContent>
                            </Select>
                            {(editForm.availabilityRules?.ingressFormFilter === "Exceto" || editForm.availabilityRules?.ingressFormFilter === "Somente") && (
                              <Select
                                value={editForm.availabilityRules?.selectedIngressForms?.[0] || ""}
                                onValueChange={(value) => setEditForm({ 
                                  ...editForm, 
                                  availabilityRules: { 
                                    ...editForm.availabilityRules!,
                                    selectedIngressForms: [value]
                                  } 
                                })}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Selecionar formas..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ENEM">ENEM</SelectItem>
                                  <SelectItem value="Vestibular">Vestibular</SelectItem>
                                  <SelectItem value="Transferência">Transferência</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="userFilter">Usuários</Label>
                          <Select
                            value={editForm.availabilityRules?.userFilter || "Todos"}
                            onValueChange={(value) => setEditForm({ 
                              ...editForm, 
                              availabilityRules: { 
                                ...editForm.availabilityRules!,
                                userFilter: value,
                                selectedUsers: value === "Todos" ? [] : editForm.availabilityRules?.selectedUsers
                              } 
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione os usuários" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todos">Todos</SelectItem>
                              <SelectItem value="Específicos">Específicos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="initialValidity">Início da Vigência</Label>
                          <Input
                            id="initialValidity"
                            type="date"
                            value={editForm.availabilityRules?.initialValidity || ""}
                            onChange={(e) => setEditForm({ 
                              ...editForm, 
                              availabilityRules: { 
                                ...editForm.availabilityRules!,
                                initialValidity: e.target.value 
                              } 
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="finalValidity">Final da Vigência</Label>
                          <Input
                            id="finalValidity"
                            type="date"
                            value={editForm.availabilityRules?.finalValidity || ""}
                            onChange={(e) => setEditForm({ 
                              ...editForm, 
                              availabilityRules: { 
                                ...editForm.availabilityRules!,
                                finalValidity: e.target.value 
                              } 
                            })}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="children" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Cupons Filhos</h3>
                    <Button 
                      type="button"
                      onClick={() => {
                        addChildCoupon();
                        setCurrentPage(Math.ceil((childCoupons.length + 1) / itemsPerPage));
                      }}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {childCoupons.length > 0 ? (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código Interno</TableHead>
                              <TableHead>Nome do Afiliado</TableHead>
                              <TableHead>Código do Cupom</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedChildCoupons.map((child) => (
                              <TableRow key={child.id}>
                                <TableCell>
                                  {child.affiliateId ? affiliates.find(a => a.id === child.affiliateId)?.internalCode || '-' : '-'}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={child.affiliateId}
                                    onValueChange={(value) => handleAffiliateChange(child.id, value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecione um afiliado" />
                                    </SelectTrigger>
                                     <SelectContent>
                                       {affiliates
                                         .filter(affiliate => 
                                           !childCoupons.some(c => c.affiliateId === affiliate.id && c.id !== child.id)
                                         )
                                         .map((affiliate) => (
                                           <SelectItem key={affiliate.id} value={affiliate.id}>
                                             {affiliate.name}
                                           </SelectItem>
                                         ))}
                                     </SelectContent>
                                  </Select>
                                </TableCell>
                                 <TableCell>
                                   <Input
                                     value={child.couponCode}
                                     onChange={(e) => handleChildCouponCodeChange(child.id, e.target.value)}
                                     placeholder="Código do cupom"
                                     className={childCodeErrors[child.id] ? "border-red-500" : ""}
                                   />
                                   {childCodeErrors[child.id] && (
                                     <p className="text-xs text-red-600 mt-1">{childCodeErrors[child.id]}</p>
                                   )}
                                 </TableCell>
                                 <TableCell className="text-right">
                                   <div className="flex justify-end gap-1">
                                     <Button
                                       type="button"
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => copyToClipboard(child.couponCode)}
                                       disabled={!child.couponCode}
                                     >
                                       <Link className="h-4 w-4 text-blue-600" />
                                     </Button>
                                     <Button
                                       type="button"
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => removeChildCoupon(child.id)}
                                     >
                                       <X className="h-4 w-4 text-red-600" />
                                     </Button>
                                   </div>
                                 </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {totalPages > 1 && (
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1);
                                  }
                                }}
                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages) {
                                    setCurrentPage(currentPage + 1);
                                  }
                                }}
                                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum cupom filho adicionado. Clique em "Adicionar" para começar.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                  setCodeError("");
                  setChildCodeErrors({});
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isCreateDialogOpen ? "Criar Cupom" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir o cupom{" "}
              <strong>{selectedCoupon?.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
