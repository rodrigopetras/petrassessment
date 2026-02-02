import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AssessmentProvider, useAssessment } from '@/hooks/useAssessment';
import { Login } from '@/sections/Login';
import { Sidebar } from '@/sections/Sidebar';
import { Dashboard } from '@/sections/Dashboard';
import { CompanyForm } from '@/sections/CompanyForm';
import { Part1Questions } from '@/sections/Part1Questions';
import { Part2Questions } from '@/sections/Part2Questions';
import { AdminPanel } from '@/sections/AdminPanel';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, User, Save } from 'lucide-react';

// Profile Component
function Profile({ onBack }: { onBack: () => void }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');

  const handleSave = () => {
    updateProfile({ name, email, company });
    toast.success('Perfil atualizado com sucesso!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <p className="text-slate-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            <p className="text-xs text-slate-500">O email não pode ser alterado</p>
          </div>
          <div className="space-y-2">
            <Label>Empresa</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// View Assessment Component
function ViewAssessment({ onBack }: { onBack: () => void }) {
  const { assessment, company, answers, exportToTxt } = useAssessment();

  const handleExport = () => {
    const content = exportToTxt();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-${assessment?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Assessment exportado com sucesso!');
  };

  if (!assessment || !company) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-500">Nenhum assessment encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Visualizar Assessment</h2>
        </div>
        <Button onClick={handleExport}>
          Exportar TXT
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">CNPJ</p>
              <p className="font-medium">{company.cnpj}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Razão Social</p>
              <p className="font-medium">{company.razaoSocial}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tamanho</p>
              <p className="font-medium capitalize">{company.tamanhoEmpresa}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Colaboradores</p>
              <p className="font-medium">{company.numeroColaboradores}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Respostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Total de respostas: {Object.keys(answers).length}
            </p>
            <p className="text-sm text-slate-500">
              Progresso: {assessment.progress}%
            </p>
            <p className="text-sm text-slate-500">
              Status: {assessment.status === 'completed' ? 'Concluído' : 'Em Andamento'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main App Content
function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [assessmentStep, setAssessmentStep] = useState<'company' | 'part1' | 'part2'>('company');
  useAuth();
  const { assessment, company, createNewAssessment } = useAssessment();

  const handleNewAssessment = () => {
    createNewAssessment();
    setAssessmentStep('company');
    setCurrentView('new-assessment');
  };

  const handleContinueAssessment = () => {
    if (!company) {
      setAssessmentStep('company');
    } else if (assessment?.progress && assessment.progress < 50) {
      setAssessmentStep('part1');
    } else {
      setAssessmentStep('part2');
    }
    setCurrentView('view-assessment');
  };

  const handleCompanyComplete = () => {
    setAssessmentStep('part1');
  };

  const handlePart1Complete = () => {
    setAssessmentStep('part2');
  };

  const handlePart2Complete = () => {
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNewAssessment={handleNewAssessment}
            onContinueAssessment={handleContinueAssessment}
            onViewAssessment={() => setCurrentView('view-assessment-detail')}
          />
        );

      case 'new-assessment':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-2xl font-bold">Novo Assessment</h2>
            </div>
            <CompanyForm onComplete={handleCompanyComplete} />
          </div>
        );

      case 'view-assessment':
        if (assessmentStep === 'company' || !company) {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h2 className="text-2xl font-bold">Continuar Assessment</h2>
              </div>
              <CompanyForm onComplete={handleCompanyComplete} />
            </div>
          );
        } else if (assessmentStep === 'part1') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setAssessmentStep('company')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h2 className="text-2xl font-bold">Assessment - Parte 1</h2>
              </div>
              <Part1Questions onComplete={handlePart1Complete} />
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setAssessmentStep('part1')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h2 className="text-2xl font-bold">Assessment - Parte 2</h2>
              </div>
              <Part2Questions onComplete={handlePart2Complete} />
            </div>
          );
        }

      case 'view-assessment-detail':
        return <ViewAssessment onBack={() => setCurrentView('dashboard')} />;

      case 'profile':
        return <Profile onBack={() => setCurrentView('dashboard')} />;

      case 'admin-users':
      case 'admin-questions':
      case 'admin-assessments':
        return <AdminPanel />;

      default:
        return <Dashboard onNewAssessment={handleNewAssessment} onContinueAssessment={handleContinueAssessment} onViewAssessment={() => setCurrentView('view-assessment-detail')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Mobile Spacing */}
        <div className="h-16 lg:hidden" />
        
        {/* Content */}
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <AssessmentProvider>
        {isLoggedIn ? (
          <AppContent />
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
        <Toaster position="top-right" richColors />
      </AssessmentProvider>
    </AuthProvider>
  );
}

export default App;
