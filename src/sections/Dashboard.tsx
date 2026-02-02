import { useAssessment } from '@/hooks/useAssessment';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus, 
  TrendingUp, 
  Shield,
  AlertCircle,
  Eye
} from 'lucide-react';

interface DashboardProps {
  onNewAssessment: () => void;
  onContinueAssessment: () => void;
  onViewAssessment: () => void;
}

export function Dashboard({ onNewAssessment, onContinueAssessment, onViewAssessment }: DashboardProps) {
  const { user } = useAuth();
  const { assessment, company, getProgress } = useAssessment();

  const progress = getProgress();
  const hasAssessment = !!assessment;
  const isCompleted = assessment?.status === 'completed';

  const stats = [
    {
      title: 'Assessments Realizados',
      value: hasAssessment ? 1 : 0,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Progresso Atual',
      value: `${progress}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Status',
      value: isCompleted ? 'Concluído' : hasAssessment ? 'Em Andamento' : 'Não Iniciado',
      icon: isCompleted ? CheckCircle : hasAssessment ? Clock : AlertCircle,
      color: isCompleted ? 'text-green-500' : hasAssessment ? 'text-amber-500' : 'text-slate-500',
      bgColor: isCompleted ? 'bg-green-100' : hasAssessment ? 'bg-amber-100' : 'bg-slate-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-slate-500 mt-1">
            Acompanhe seus assessments de segurança da informação
          </p>
        </div>
        <div className="flex gap-2">
          {!hasAssessment ? (
            <Button onClick={onNewAssessment} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Assessment
            </Button>
          ) : !isCompleted ? (
            <Button onClick={onContinueAssessment} className="bg-amber-500 hover:bg-amber-600">
              <Clock className="h-4 w-4 mr-2" />
              Continuar Assessment
            </Button>
          ) : (
            <Button onClick={onViewAssessment} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver Assessment
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Assessment */}
      {hasAssessment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assessment Atual</CardTitle>
                <CardDescription>
                  {company?.razaoSocial || 'Empresa não informada'}
                </CardDescription>
              </div>
              <Badge variant={isCompleted ? 'default' : 'secondary'}>
                {isCompleted ? 'Concluído' : 'Em Andamento'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">CNPJ</p>
                <p className="font-medium truncate">{company?.cnpj || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Tamanho</p>
                <p className="font-medium capitalize">{company?.tamanhoEmpresa || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Colaboradores</p>
                <p className="font-medium">{company?.numeroColaboradores || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Servidores</p>
                <p className="font-medium">{company?.numeroServidores || '-'}</p>
              </div>
            </div>
            
            {!isCompleted && (
              <div className="flex gap-2 pt-4">
                <Button onClick={onContinueAssessment} className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Continuar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Sobre o Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Este assessment de segurança da informação é baseado nos controles CIS 
              (Center for Internet Security) e avalia a maturidade da sua organização 
              em diversas áreas de segurança cibernética.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Preencha os dados da sua empresa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Responda as perguntas da Parte 1
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Complete os controles CIS (Parte 2)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Exporte o relatório completo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
