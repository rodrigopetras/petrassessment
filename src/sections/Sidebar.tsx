import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Eye, 
  Printer, 
  User as UserIcon, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  FileText,
  HelpCircle,
  ChevronDown,
  Pencil,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout, updateAvatar } = useAuth();
  const { assessment, createNewAssessment, exportToTxt } = useAssessment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'admin';

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
        toast.success('Foto de perfil atualizada!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (!assessment) {
      toast.error('Nenhum assessment para exportar!');
      return;
    }
    
    const content = exportToTxt();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-${assessment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Assessment exportado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const MenuItems = () => (
    <div className="space-y-1">
      <Button
        variant={currentView === 'dashboard' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => {
          onViewChange('dashboard');
          setIsMobileMenuOpen(false);
        }}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      
      <Button
        variant={currentView === 'new-assessment' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => {
          createNewAssessment();
          onViewChange('new-assessment');
          setIsMobileMenuOpen(false);
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Assessment
      </Button>
      
      <Button
        variant={currentView === 'view-assessment' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => {
          onViewChange('view-assessment');
          setIsMobileMenuOpen(false);
        }}
      >
        <Eye className="mr-2 h-4 w-4" />
        Ver/Continuar Assessment
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          handleExport();
          setIsMobileMenuOpen(false);
        }}
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Dados
      </Button>

      {isAdmin && (
        <>
          <div className="pt-4 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
              Administração
            </p>
          </div>
          
          <Button
            variant={currentView === 'admin-users' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              onViewChange('admin-users');
              setIsMobileMenuOpen(false);
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Gerenciar Usuários
          </Button>
          
          <Button
            variant={currentView === 'admin-questions' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              onViewChange('admin-questions');
              setIsMobileMenuOpen(false);
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Gerenciar Perguntas
          </Button>
          
          <Button
            variant={currentView === 'admin-assessments' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              onViewChange('admin-assessments');
              setIsMobileMenuOpen(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver Assessments
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-900 border-slate-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <MenuItems />
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-white">Security Assessment</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onViewChange('profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Security</h1>
              <p className="text-xs text-slate-400">Assessment</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-slate-700 text-white">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Pencil className="h-3 w-3 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-slate-50 mt-1">
                  Administrador
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-auto p-4">
          <MenuItems />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onViewChange('profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
