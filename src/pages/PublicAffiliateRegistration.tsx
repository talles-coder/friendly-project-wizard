import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

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
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().min(14, "CPF deve estar no formato 999.999.999-99"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(14, "Telefone é obrigatório"),
  street: z.string().min(5, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(9, "CEP é obrigatório"),
  commissionType: z.enum(["percentage", "fixed"], {
    required_error: "Tipo de comissão é obrigatório",
  }),
  expectedCommissionRate: z.coerce.number().min(0, "Comissão esperada deve ser maior que 0"),
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
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  experience: z.string().min(10, "Descreva sua experiência (mínimo 10 caracteres)"),
  motivation: z.string().min(10, "Conte sua motivação (mínimo 10 caracteres)"),
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

export default function PublicAffiliateRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commissionType: "percentage",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Dados do afiliado:", data);
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    toast({
      title: "Cadastro enviado com sucesso!",
      description: "Entraremos em contato em até 48 horas úteis.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Cadastro Enviado!</CardTitle>
            <CardDescription>
              Recebemos sua solicitação para se tornar nosso parceiro afiliado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Nossa equipe analisará suas informações e entrará em contato em até 48 horas úteis 
              através do email fornecido.
            </p>
            <Button 
              onClick={() => window.close()} 
              variant="outline" 
              className="w-full"
            >
              Fechar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Torne-se nosso Parceiro Afiliado
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se ao nosso programa de afiliados e comece a ganhar comissões promovendo nossos produtos e serviços.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações básicas para seu cadastro como afiliado
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
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
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal",
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
                      <FormLabel>CPF *</FormLabel>
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
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
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
                      <FormLabel>Telefone/WhatsApp *</FormLabel>
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
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>📍 Endereço</CardTitle>
                <CardDescription>
                  Onde você está localizado
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Rua *</FormLabel>
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
                      <FormLabel>Número *</FormLabel>
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
                      <FormLabel>Bairro *</FormLabel>
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
                      <FormLabel>Cidade *</FormLabel>
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
                      <FormLabel>Estado *</FormLabel>
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
                      <FormLabel>CEP *</FormLabel>
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
              </CardContent>
            </Card>

            {/* Informações de Comissão */}
            <Card>
              <CardHeader>
                <CardTitle>💰 Expectativa de Comissão</CardTitle>
                <CardDescription>
                  Qual tipo de comissão você prefere?
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="commissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Comissão Preferida *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">% sobre cada venda</SelectItem>
                          <SelectItem value="fixed">Valor fixo por venda</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedCommissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("commissionType") === "percentage" ? "Expectativa de % *" : "Expectativa de Valor (R$) *"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={form.watch("commissionType") === "percentage" ? "Ex: 5.5" : "Ex: 100.00"}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta é apenas sua expectativa inicial, a comissão final será negociada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card>
              <CardHeader>
                <CardTitle>📱 Redes Sociais</CardTitle>
                <CardDescription>
                  Onde você pretende promover nossos produtos? (Opcional)
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
                        <Input placeholder="@seuusuario" {...field} />
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
                        <Input placeholder="facebook.com/seuusuario" {...field} />
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
                        <Input placeholder="@seuusuario" {...field} />
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
                        <Input placeholder="youtube.com/c/seucanal" {...field} />
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
                <CardTitle>💡 Conte-nos mais sobre você</CardTitle>
                <CardDescription>
                  Queremos conhecer melhor seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiência com Marketing Digital/Vendas *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte sobre sua experiência anterior com vendas, marketing digital, redes sociais, etc..."
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
                      <FormLabel>Por que quer ser nosso afiliado? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="O que te motiva a ser nosso parceiro? Como pretende divulgar nossos produtos?"
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Algo mais que gostaria de compartilhar conosco..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Dados de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>💳 Dados para Recebimento</CardTitle>
                <CardDescription>
                  Como você gostaria de receber as comissões?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Repasse *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "pix"}>
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
                          <FormLabel>Chave PIX *</FormLabel>
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
                          <FormLabel>Nome Completo do PIX *</FormLabel>
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
                          <FormLabel>Banco do PIX *</FormLabel>
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
                          <FormLabel>Código do Banco *</FormLabel>
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
                          <FormLabel>Nome do Banco *</FormLabel>
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
                          <FormLabel>Agência *</FormLabel>
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
                          <FormLabel>Conta *</FormLabel>
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

            {/* Botão de Envio */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Enviando cadastro..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Cadastro
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Ao enviar este formulário, você concorda com nossos termos de parceria. 
                  Entraremos em contato em até 48 horas úteis.
                </p>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}