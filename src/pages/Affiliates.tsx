import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Facebook, Instagram, Youtube, Edit, Trash2 } from "lucide-react";
import { Affiliate } from "@/types";
import { AffiliateForm } from "@/components/AffiliateForm";
import { toast } from "@/hooks/use-toast";

// Mock data for affiliates
const MOCK_AFFILIATES: Affiliate[] = [
  {
    id: "1",
    name: "Maria Silva",
    birthDate: "1985-03-15",
    cpf: "123.456.789-00",
    email: "maria@example.com",
    phone: "(11) 99999-1111",
    internalCode: "AFF001234",
    partnershipStartDate: "2024-01-15",
    commissionRate: 5.5,
    commissionType: "percentage",
    pixKey: "maria.silva@email.com",
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
    internalCode: "AFF001235",
    partnershipStartDate: "2024-02-01",
    commissionRate: 150.00,
    commissionType: "fixed",
    pixKey: "987.654.321-00",
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
    internalCode: "AFF001236",
    partnershipStartDate: "2024-01-10",
    commissionRate: 7.0,
    commissionType: "percentage",
    pixKey: "+5531777773333",
    socialNetworks: {
      facebook: "https://facebook.com/ana.costa",
      tiktok: "https://tiktok.com/@ana.costa",
      youtube: "https://youtube.com/anacosta"
    }
  }
];

// TikTok icon component (since it's not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Affiliates = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(MOCK_AFFILIATES);
  const [showForm, setShowForm] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);

  const getSocialIcon = (network: string, url?: string) => {
    if (!url) return null;

    const iconProps = { className: "h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" };
    
    switch (network) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'tiktok':
        return <TikTokIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const handleSaveAffiliate = (affiliateData: Partial<Affiliate>) => {
    if (editingAffiliate) {
      // Update existing affiliate
      setAffiliates(affiliates.map(a => 
        a.id === editingAffiliate.id 
          ? { ...a, ...affiliateData } as Affiliate
          : a
      ));
    } else {
      // Add new affiliate
      setAffiliates([...affiliates, affiliateData as Affiliate]);
    }
    
    setShowForm(false);
    setEditingAffiliate(null);
  };

  const handleEditAffiliate = (affiliate: Affiliate) => {
    setEditingAffiliate(affiliate);
    setShowForm(true);
  };

  const handleDeleteAffiliate = (id: string) => {
    setAffiliates(affiliates.filter(a => a.id !== id));
  };

  const handleNewAffiliate = () => {
    setEditingAffiliate(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAffiliate(null);
  };

  if (showForm) {
    return (
      <AffiliateForm
        affiliate={editingAffiliate || undefined}
        onSave={handleSaveAffiliate}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Afiliados</h2>
        <div className="flex gap-2">
          <Button onClick={handleNewAffiliate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Afiliado
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const baseUrl = window.location.origin;
              const affiliateUrl = `${baseUrl}/cadastro-afiliado`;
              navigator.clipboard.writeText(affiliateUrl);
              toast({
                title: "Link copiado!",
                description: "O link de cadastro foi copiado para a área de transferência.",
              });
            }}
          >
            📋 Copiar Link de Cadastro
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Afiliados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Redes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell className="font-medium">{affiliate.name}</TableCell>
                  <TableCell>{affiliate.cpf}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSocialIcon('facebook', affiliate.socialNetworks.facebook)}
                      {getSocialIcon('instagram', affiliate.socialNetworks.instagram)}
                      {getSocialIcon('tiktok', affiliate.socialNetworks.tiktok)}
                      {getSocialIcon('youtube', affiliate.socialNetworks.youtube)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAffiliate(affiliate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAffiliate(affiliate.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Affiliates;