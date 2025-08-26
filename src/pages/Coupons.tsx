import { useState, useEffect } from "react";
import { Coupon } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
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
  
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({ ...coupon });
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
      // Validate unique coupon code among active coupons
      const existingActiveCoupon = coupons.find(
        c => c.code === editForm.code && c.isActive && c.id !== selectedCoupon.id
      );
      
      if (existingActiveCoupon && editForm.isActive) {
        alert("Já existe um cupom ativo com este código. Use um código diferente.");
        return;
      }

      const updatedCoupons = coupons.map((c) =>
        c.id === selectedCoupon.id ? { ...c, ...editForm, updatedAt: new Date().toISOString() } : c
      );
      saveCoupons(updatedCoupons);
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      // Validate unique coupon code among active coupons
      const existingActiveCoupon = coupons.find(
        c => c.code === editForm.code && c.isActive && c.id !== selectedCoupon?.id
      );
      
      if (existingActiveCoupon) {
        alert("Já existe um cupom ativo com este código. Use um código diferente.");
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
      };
      saveCoupons([...coupons, newCoupon]);
      setIsCreateDialogOpen(false);
      setEditForm({});
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cupons</h1>
        {isAdmin && (
          <Button 
            onClick={() => {
              setEditForm({});
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
              <TableHead>Nome do Cupom</TableHead>
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
        <DialogContent className="max-w-2xl">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Cupom</Label>
                <Input
                  id="code"
                  value={editForm.code || ""}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: DESCONTO50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cupom</Label>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
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
