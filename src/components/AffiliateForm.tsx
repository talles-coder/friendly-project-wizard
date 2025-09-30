import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Affiliate } from "@/types";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().min(14, "CPF deve estar no formato 999.999.999-99"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  partnershipStartDate: z.date({
    required_error: "Data de início da parceria é obrigatória",
  }),
  commissionRate: z.coerce.number().min(0, "Comissão deve ser maior que 0"),
  commissionType: z.enum(["percentage", "fixed"], {
    required_error: "Tipo de comissão é obrigatório",
  }),
  subscriptionCommissionRate: z.coerce.number().min(0, "Comissão deve ser maior que 0"),
  subscriptionCommissionType: z.enum(["percentage", "fixed"], {
    required_error: "Tipo de comissão é obrigatório",
  }),
  notes: z.string().optional(),
  paymentType: z.enum(["pix", "bank"], {
    required_error: "Tipo de repasse é obrigatório",
  }),
  // Campos PIX
  pixKey: z.string().optional(),
  pixFullName: z.string().optional(),
  pixBank: z.string().optional(),
  // Campos bancários
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  agency: z.string().optional(),
  account: z.string().optional(),
  // Redes sociais
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  // Experiência e motivação
  experience: z.string().optional(),
  motivation: z.string().optional(),
}).refine((data) => {
  if (data.paymentType === "pix") {
    return data.pixKey && data.pixFullName && data.pixBank;
  }
  if (data.paymentType === "bank") {
    return data.bankCode && data.bankName && data.agency && data.account;
  }
  return true;
}, {
  message: "Preencha todos os campos obrigatórios para o tipo de repasse selecionado",
  path: ["paymentType"],
});

type FormData = z.infer<typeof formSchema>;

interface AffiliateFormProps {
  affiliate?: Affiliate;
  onSave: (data: Partial<Affiliate>) => void;
  onCancel: () => void;
}

// Utility functions for masks
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

const formatZipCode = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,3})/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

const generateInternalCode = () => {
  return 'AFF' + Date.now().toString().slice(-6);
};

export const AffiliateForm = ({ affiliate, onSave, onCancel }: AffiliateFormProps) => {
  const [internalCode] = useState(affiliate?.internalCode || generateInternalCode());
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: affiliate?.name || "",
      birthDate: affiliate?.birthDate || "",
      cpf: affiliate?.cpf || "",
      email: affiliate?.email || "",
      phone: affiliate?.phone || "",
      street: affiliate?.address?.street || "",
      number: affiliate?.address?.number || "",
      neighborhood: affiliate?.address?.neighborhood || "",
      city: affiliate?.address?.city || "",
      state: affiliate?.address?.state || "",
      zipCode: affiliate?.address?.zipCode || "",
      partnershipStartDate: affiliate?.partnershipStartDate ? new Date(affiliate.partnershipStartDate) : undefined,
      commissionRate: affiliate?.commissionRate || 0,
      commissionType: affiliate?.commissionType || "percentage",
      subscriptionCommissionRate: affiliate?.subscriptionCommissionRate || 0,
      subscriptionCommissionType: affiliate?.subscriptionCommissionType || "percentage",
      notes: affiliate?.notes || "",
      paymentType: affiliate?.paymentType || "pix",
      pixKey: affiliate?.pixData?.pixKey || "",
      pixFullName: affiliate?.pixData?.fullName || "",
      pixBank: affiliate?.pixData?.bank || "",
      bankCode: affiliate?.bankData?.bankCode || "",
      bankName: affiliate?.bankData?.bankName || "",
      agency: affiliate?.bankData?.agency || "",
      account: affiliate?.bankData?.account || "",
      facebook: affiliate?.socialNetworks?.facebook || "",
      instagram: affiliate?.socialNetworks?.instagram || "",
      tiktok: affiliate?.socialNetworks?.tiktok || "",
      youtube: affiliate?.socialNetworks?.youtube || "",
      experience: affiliate?.experience || "",
      motivation: affiliate?.motivation || "",
    },
  });

  const onSubmit = (data: FormData) => {
    const affiliateData: Partial<Affiliate> = {
      id: affiliate?.id || Date.now().toString(),
      name: data.name,
      birthDate: data.birthDate,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      address: {
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      internalCode,
      partnershipStartDate: data.partnershipStartDate.toISOString(),
      commissionRate: data.commissionRate,
      commissionType: data.commissionType,
      subscriptionCommissionRate: data.subscriptionCommissionRate,
      subscriptionCommissionType: data.subscriptionCommissionType,
      notes: data.notes,
      paymentType: data.paymentType,
      pixData: data.paymentType === "pix" ? {
        pixKey: data.pixKey!,
        fullName: data.pixFullName!,
        bank: data.pixBank!,
      } : undefined,
      bankData: data.paymentType === "bank" ? {
        bankCode: data.bankCode!,
        bankName: data.bankName!,
        agency: data.agency!,
        account: data.account!,
      } : undefined,
      socialNetworks: {
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        tiktok: data.tiktok || "",
        youtube: data.youtube || "",
      },
      experience: data.experience,
      motivation: data.motivation,
    };

    onSave(affiliateData);
    toast({
      title: affiliate ? "Afiliado atualizado" : "Afiliado cadastrado",
      description: "As informações foram salvas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {affiliate ? "Editar Afiliado" : "Novo Afiliado"}
          </h1>
          <p className="text-muted-foreground">
            {affiliate ? "Atualize as informações do afiliado" : "Cadastre um novo parceiro"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais e de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais e de Contato</CardTitle>
              <CardDescription>
                Informações básicas e dados de contato do afiliado
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              field.value
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value.split('/').reverse().join('-')) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "dd/MM/yyyy") : "")}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone/WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Endereço */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-medium">Endereço Completo</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatZipCode(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Programa de Afiliados */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Programa de Afiliados</CardTitle>
              <CardDescription>
                Dados específicos da parceria e comissões
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel>Código Interno do Afiliado</FormLabel>
                <FormControl>
                  <Input value={internalCode} readOnly className="bg-muted" />
                </FormControl>
                <FormDescription>
                  Código gerado automaticamente para identificação interna
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="partnershipStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início da Parceria</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2020-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 space-y-4">
                <h4 className="font-medium">Taxa de Adesão</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="commissionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Comissão - Taxa de Adesão</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">% sobre venda</SelectItem>
                            <SelectItem value="fixed">Valor fixo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("commissionType") === "percentage" ? "Comissão - Taxa de Adesão (%)" : "Comissão - Taxa de Adesão (R$)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={form.watch("commissionType") === "percentage" ? "5.5" : "100.00"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h4 className="font-medium">Mensalidades</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="subscriptionCommissionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Comissão - Mensalidades</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">% sobre venda</SelectItem>
                            <SelectItem value="fixed">Valor fixo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriptionCommissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("subscriptionCommissionType") === "percentage" ? "Comissão - Mensalidades (%)" : "Comissão - Mensalidades (R$)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={form.watch("subscriptionCommissionType") === "percentage" ? "5.5" : "100.00"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais sobre a parceria..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dados para Repasse */}
          <Card>
            <CardHeader>
              <CardTitle>Dados para Repasse</CardTitle>
              <CardDescription>
                Informações para pagamento das comissões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Repasse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de repasse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="bank">Dados Bancários</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos PIX */}
              {form.watch("paymentType") === "pix" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pixKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chave PIX</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pixFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo do PIX</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo como cadastrado no PIX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pixBank"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Banco do PIX</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do banco onde está cadastrado o PIX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Campos Bancários */}
              {form.watch("paymentType") === "bank" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bankCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código do Banco</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Exemplo: 001, 033, 104"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Banco</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Exemplo: Banco do Brasil, Itaú"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agência</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número da agência"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número da conta"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>📱 Redes Sociais</CardTitle>
              <CardDescription>
                Onde o afiliado pretende promover os produtos (Opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="facebook.com/usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input placeholder="@usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="youtube.com/c/canal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Experiência e Motivação */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Informações Adicionais</CardTitle>
              <CardDescription>
                Experiência e motivações do afiliado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiência com Marketing Digital/Vendas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Experiência anterior com vendas, marketing digital, redes sociais, etc..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação para ser afiliado</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="O que motiva a ser parceiro? Como pretende divulgar os produtos?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {affiliate ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};