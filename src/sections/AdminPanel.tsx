import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Users, HelpCircle, FileText, Plus, Pencil, Trash2, Search, Download, Eye, ArrowLeft } from 'lucide-react';

// Interface para assessment salvo
interface SavedAssessment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: {
    cnpj: string;
    razaoSocial: string;
    nomeUsuario: string;
    emailCorporativo: string;
    telefone: string;
    numeroColaboradores: number;
    numeroServidores: number;
    tipoNuvem: string;
  };
  answers: Record<string, any>;
  status: 'draft' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Mock de usuários para admin
const MOCK_USERS = [
  { id: 'admin-001', name: 'rodrigo', email: 'rodrigo@admin.com', role: 'admin', createdAt: '2024-01-15' },
  { id: 'user-001', name: 'João Silva', email: 'joao@empresa.com', role: 'user', company: 'Empresa A', createdAt: '2024-02-20' },
  { id: 'user-002', name: 'Maria Santos', email: 'maria@empresa.com', role: 'user', company: 'Empresa B', createdAt: '2024-03-10' }
];

export function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('assessments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showAssessmentDetail, setShowAssessmentDetail] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<SavedAssessment | null>(null);
  const [allAssessments, setAllAssessments] = useState<SavedAssessment[]>([]);

  // Carregar todos os assessments do localStorage
  useEffect(() => {
    const assessments: SavedAssessment[] = [];
    
    // Percorre todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('assessment-') || key.startsWith('assessment-completed-'))) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.assessment && data.company) {
            assessments.push({
              ...data.assessment,
              company: data.company,
              answers: data.answers || {}
            });
          }
        } catch (e) {
          console.error('Erro ao carregar assessment:', e);
        }
      }
    }
    
    // Ordena por data de atualização (mais recente primeiro)
    assessments.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    setAllAssessments(assessments);
  }, []);

  // Verificar se é admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">Acesso Negado</h2>
          <p className="text-slate-500 mt-2">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssessments = allAssessments.filter(a =>
    a.company?.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company?.cnpj?.includes(searchTerm) ||
    a.company?.nomeUsuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAssessment = (assessment: SavedAssessment) => {
    setSelectedAssessment(assessment);
    setShowAssessmentDetail(true);
  };

  const handleExportAssessment = (assessment: SavedAssessment) => {
    let content = 'ASSESSMENT DE SEGURANCA DA INFORMACAO\n';
    content += '=' .repeat(60) + '\n\n';
    
    content += 'DADOS DA EMPRESA\n';
    content += '-'.repeat(40) + '\n';
    content += `CNPJ: ${assessment.company.cnpj}\n`;
    content += `Razao Social: ${assessment.company.razaoSocial}\n`;
    content += `Nome do Usuario: ${assessment.company.nomeUsuario}\n`;
    content += `Email: ${assessment.company.emailCorporativo}\n`;
    content += `Telefone: ${assessment.company.telefone}\n`;
    content += `Colaboradores: ${assessment.company.numeroColaboradores}\n`;
    content += `Servidores: ${assessment.company.numeroServidores}\n`;
    content += `Tipo de Nuvem: ${assessment.company.tipoNuvem || 'Nao informado'}\n\n`;
    
    content += 'RESPOSTAS\n';
    content += '-'.repeat(40) + '\n';
    content += `Total de respostas: ${Object.keys(assessment.answers).length}\n`;
    content += `Progresso: ${assessment.progress}%\n`;
    content += `Status: ${assessment.status === 'completed' ? 'Concluido' : 'Em Andamento'}\n`;
    content += `Criado em: ${new Date(assessment.createdAt).toLocaleString('pt-BR')}\n`;
    content += `Atualizado em: ${new Date(assessment.updatedAt).toLocaleString('pt-BR')}\n\n`;
    
    if (assessment.status === 'completed' && assessment.completedAt) {
      content += `Concluido em: ${new Date(assessment.completedAt).toLocaleString('pt-BR')}\n\n`;
    }
    
    content += '='.repeat(60) + '\n';
    content += `ID do Assessment: ${assessment.id}\n`;
    content += `ID do Usuario: ${assessment.userId}\n`;
    
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

  const handleDeleteUser = (userId: string) => {
    toast.success(`Usuário ${userId} removido!`);
  };

  const handleEditUser = (userData: any) => {
    setEditingUser(userData);
    setShowUserDialog(true);
  };

  const handleSaveUser = () => {
    toast.success('Usuário salvo com sucesso!');
    setShowUserDialog(false);
    setEditingUser(null);
  };

  // Componente de detalhe do assessment
  const AssessmentDetail = () => {
    if (!selectedAssessment) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowAssessmentDetail(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Detalhes do Assessment</h2>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>{selectedAssessment.company.razaoSocial}</CardDescription>
              </div>
              <Badge variant={selectedAssessment.status === 'completed' ? 'default' : 'secondary'}>
                {selectedAssessment.status === 'completed' ? 'Concluído' : 'Em Andamento'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">CNPJ</p>
                <p className="font-medium">{selectedAssessment.company.cnpj}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Razão Social</p>
                <p className="font-medium">{selectedAssessment.company.razaoSocial}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Responsável</p>
                <p className="font-medium">{selectedAssessment.company.nomeUsuario}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium">{selectedAssessment.company.emailCorporativo}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Telefone</p>
                <p className="font-medium">{selectedAssessment.company.telefone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Colaboradores</p>
                <p className="font-medium">{selectedAssessment.company.numeroColaboradores}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Servidores</p>
                <p className="font-medium">{selectedAssessment.company.numeroServidores}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Tipo de Nuvem</p>
                <p className="font-medium">{selectedAssessment.company.tipoNuvem || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Progresso</p>
                <p className="font-medium">{selectedAssessment.progress}%</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => handleExportAssessment(selectedAssessment)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar TXT
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">ID do Assessment</p>
                <p className="font-mono text-sm">{selectedAssessment.id}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">ID do Usuário</p>
                <p className="font-mono text-sm">{selectedAssessment.userId}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Criado em</p>
                <p className="text-sm">{new Date(selectedAssessment.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Atualizado em</p>
                <p className="text-sm">{new Date(selectedAssessment.updatedAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (showAssessmentDetail && selectedAssessment) {
    return <AssessmentDetail />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Painel Administrativo</h2>
          <p className="text-slate-500">Gerencie usuários, perguntas e assessments</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Perguntas
          </TabsTrigger>
        </TabsList>

        {/* Assessments */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Todos os Assessments</CardTitle>
                  <CardDescription>Visualize e exporte assessments de todos os usuários</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por CNPJ, empresa ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {filteredAssessments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum assessment encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.company?.razaoSocial || '-'}</TableCell>
                        <TableCell>{a.company?.cnpj || '-'}</TableCell>
                        <TableCell>{a.company?.nomeUsuario || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={a.status === 'completed' ? 'default' : 'secondary'}>
                            {a.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${a.progress}%` }}
                              />
                            </div>
                            <span className="text-xs">{a.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(a.updatedAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewAssessment(a)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleExportAssessment(a)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuários */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <CardDescription>Visualize e gerencie os usuários do sistema</CardDescription>
                </div>
                <Button onClick={() => { setEditingUser(null); setShowUserDialog(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                          {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </Badge>
                      </TableCell>
                      <TableCell>{u.company || '-'}</TableCell>
                      <TableCell>{u.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(u)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.role === 'admin'}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perguntas */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Perguntas</CardTitle>
                  <CardDescription>Adicione, edite ou remova perguntas do assessment</CardDescription>
                </div>
                <Button onClick={() => setShowQuestionDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Pergunta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Dispositivos', 'Software', 'Dados', 'Documentação', 'Usuários', 'Rede'].map((category) => (
                  <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-slate-500">Clique para gerenciar</p>
                        </div>
                        <HelpCircle className="h-5 w-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Edite as informações do usuário' : 'Preencha as informações do novo usuário'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input defaultValue={editingUser?.name} placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={editingUser?.email} type="email" placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label>Perfil</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Pergunta */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Pergunta</DialogTitle>
            <DialogDescription>
              Adicione uma nova pergunta ao assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Dispositivos</option>
                <option>Software</option>
                <option>Dados</option>
                <option>Documentação</option>
                <option>Usuários</option>
                <option>Rede</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Grupo</Label>
              <Input placeholder="Ex: Inventário, Proteção, Detecção" />
            </div>
            <div className="space-y-2">
              <Label>Função de Segurança</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Identify</option>
                <option>Protect</option>
                <option>Detect</option>
                <option>Respond</option>
                <option>Recover</option>
                <option>Govern</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Texto da Pergunta</Label>
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Digite a pergunta..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pequenas" className="rounded" />
                <Label htmlFor="pequenas">Pequenas</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="medias" className="rounded" />
                <Label htmlFor="medias">Médias</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="grandes" className="rounded" />
                <Label htmlFor="grandes">Grandes</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => { toast.success('Pergunta criada!'); setShowQuestionDialog(false); }}>
              Criar Pergunta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
