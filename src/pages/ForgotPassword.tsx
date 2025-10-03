import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/api/authService";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao solicitar recuperação de senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <img style={{ width: '100%', maxWidth: 350 }} src="../public/fecaf_colorido.png" alt="FECAF Logo"/>
            <h1 className="text-2xl font-bold text-blue-600 mt-4">Email Enviado!</h1>
            <p className="text-gray-600 mt-4">
              Enviamos um link de recuperação para seu email. 
              Verifique sua caixa de entrada e siga as instruções.
            </p>
          </div>
          
          <Link to="/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Voltar para o Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img style={{ width: '100%', maxWidth: 350 }} src="../public/fecaf_colorido.png" alt="FECAF Logo"/>
          <h1 className="text-2xl font-bold text-blue-600 mt-4">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
