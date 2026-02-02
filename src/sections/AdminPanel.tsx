import { useState } from 'react';
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
import { Users, HelpCircle, FileText, Plus, Pencil, Trash2, Search, Download } from 'lucide-react';

// Mock de usuários para admin
const MOCK_USERS = [
  { id: '1', name: 'rodrigo', email: 'rodrigo@admin.com', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', name: 'João Silva', email: 'joao@empresa.com', role: 'user', company: 'Empresa A', createdAt: '2024-02-20' },
  { id: '3', name: 'Maria Santos', email: 'maria@empresa.com', role: 'user', company: 'Empresa B', createdAt: '2024-03-10' }
];

// Mock de assessments para admin
const MOCK_ASSESSMENTS = [
  { id: 'assessment-001', company: 'Empresa A LTDA', user: 'João Silva', status: 'completed', date: '2024-03-15', progress: 100 },
  { id: 'assessment-002', company: 'Empresa B SA', user: 'Maria Santos', status: 'draft', date: '2024-03-20', progress: 65 }
];

export function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

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

  const filteredAssessments = MOCK_ASSESSMENTS.filter(a =>
    a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportAssessment = (assessmentId: string) => {
    toast.success(`Assessment ${assessmentId} exportado!`);
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
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Perguntas
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assessments
          </TabsTrigger>
        </TabsList>

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

        {/* Assessments */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Todos os Assessments</CardTitle>
                  <CardDescription>Visualize e exporte assessments dos usuários</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell>{a.company}</TableCell>
                      <TableCell>{a.user}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'completed' ? 'default' : 'secondary'}>
                          {a.status === 'completed' ? 'Concluído' : 'Rascunho'}
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
                      <TableCell>{a.date}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleExportAssessment(a.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
