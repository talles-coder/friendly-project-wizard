
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

// Gera dados de exemplo
const generateMockCoupons = (): Coupon[] => {
  return [
    {
      id: "1",
      name: "BLACKFRIDAY",
      availableQuantity: 100,
      usedCount: 23,
      validUntil: "2023-11-30",
    },
    {
      id: "2",
      name: "WELCOME10",
      availableQuantity: 500,
      usedCount: 152,
      validUntil: "2023-12-31",
    },
    {
      id: "3",
      name: "SUMMER2023",
      availableQuantity: 200,
      usedCount: 87,
      validUntil: "2023-08-31",
    },
    {
      id: "4",
      name: "AFILIADO20",
      availableQuantity: 50,
      usedCount: 12,
      validUntil: "2023-09-15",
    },
    {
      id: "5",
      name: "PRIMEIRACOMPRA",
      availableQuantity: 1000,
      usedCount: 345,
      validUntil: "2023-12-31",
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
      const updatedCoupons = coupons.map((c) =>
        c.id === selectedCoupon.id ? { ...c, ...editForm } : c
      );
      saveCoupons(updatedCoupons);
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        name: editForm.name || "",
        availableQuantity: Number(editForm.availableQuantity) || 0,
        usedCount: 0,
        validUntil: editForm.validUntil || new Date().toISOString().split("T")[0],
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
              <TableHead>Nome do Cupom</TableHead>
              <TableHead>Quantidade Disponível</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
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
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhum cupom encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

      {/* Dialog de Edição de Cupom */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Cupom
              </label>
              <Input
                id="name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="availableQuantity" className="text-sm font-medium">
                Quantidade Disponível
              </label>
              <Input
                id="availableQuantity"
                type="number"
                value={editForm.availableQuantity || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, availableQuantity: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="validUntil" className="text-sm font-medium">
                Válido Até
              </label>
              <Input
                id="validUntil"
                type="date"
                value={editForm.validUntil ? editForm.validUntil.split("T")[0] : ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, validUntil: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação de Cupom */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cupom</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="create-name" className="text-sm font-medium">
                Nome do Cupom
              </label>
              <Input
                id="create-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="create-quantity" className="text-sm font-medium">
                Quantidade Disponível
              </label>
              <Input
                id="create-quantity"
                type="number"
                value={editForm.availableQuantity || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, availableQuantity: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="create-valid" className="text-sm font-medium">
                Válido Até
              </label>
              <Input
                id="create-valid"
                type="date"
                value={editForm.validUntil || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, validUntil: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Cupom</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
