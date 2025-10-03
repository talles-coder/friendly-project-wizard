import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/api/authService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ChangeFirstPassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await authService.changeFirstPassword(currentPassword, newPassword);
      toast.success("Senha alterada com sucesso! Faça login novamente.");
      logout();
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img style={{ width: '100%', maxWidth: 350 }} src="../public/fecaf_colorido.png" alt="FECAF Logo"/>
          <h1 className="text-2xl font-bold text-blue-600 mt-4">Primeiro Acesso</h1>
          <p className="text-gray-600 mt-2">
            Por segurança, altere sua senha de primeiro acesso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Senha Atual (Provisória)
            </label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Senha recebida"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangeFirstPassword;
