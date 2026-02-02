import { useState } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudProviders } from '@/types';
import { toast } from 'sonner';
import { 
  Building2, 
  Users, 
  Server, 
  Cloud, 
  Search,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';

interface CompanyFormProps {
  onComplete: () => void;
}

interface ServerEntry {
  id: string;
  versao: string;
  tipo: string;
  quantidade: number;
  fisicoVirtual: 'fisico' | 'virtual';
}

export function CompanyForm({ onComplete }: CompanyFormProps) {
  const { company, setCompany } = useAssessment();
  
  // Form state
  const [cnpj, setCnpj] = useState(company?.cnpj || '');
  const [razaoSocial, setRazaoSocial] = useState(company?.razaoSocial || '');
  const [website, setWebsite] = useState(company?.website || '');
  const [nomeUsuario, setNomeUsuario] = useState(company?.nomeUsuario || '');
  const [emailCorporativo, setEmailCorporativo] = useState(company?.emailCorporativo || '');
  const [telefone, setTelefone] = useState(company?.telefone || '');
  const [numeroColaboradores, setNumeroColaboradores] = useState(company?.numeroColaboradores || 0);
  const [numeroEscritoriosFiliais, setNumeroEscritoriosFiliais] = useState(company?.numeroEscritoriosFiliais || 0);
  const [numeroLinksInternet, setNumeroLinksInternet] = useState(company?.numeroLinksInternet || 0);
  const [numeroLinksTransporte, setNumeroLinksTransporte] = useState(company?.numeroLinksTransporte || 0);
  const [numeroVpnSiteToSite, setNumeroVpnSiteToSite] = useState(company?.numeroVpnSiteToSite || 0);
  const [numeroComputadores, setNumeroComputadores] = useState(company?.numeroComputadores || 0);
  const [numeroServidores, setNumeroServidores] = useState(company?.numeroServidores || 0);
  const [modeloOperacional, setModeloOperacional] = useState(company?.modeloOperacional || '');
  const [servidoresWindows, setServidoresWindows] = useState<ServerEntry[]>([]);
  const [servidoresLinux, setServidoresLinux] = useState<ServerEntry[]>([]);
  const [servidoresFisicosHypervisor, setServidoresFisicosHypervisor] = useState(company?.servidoresFisicosHypervisor || 0);
  const [detalhesHypervisor, setDetalhesHypervisor] = useState(company?.detalhesHypervisor || '');
  const [tipoNuvem, setTipoNuvem] = useState(company?.tipoNuvem || '');
  const [provedoresNuvem, setProvedoresNuvem] = useState<string[]>(company?.provedoresNuvem || []);
  const [sistemasNuvem, setSistemasNuvem] = useState(company?.sistemasNuvem || '');
  const [modeloServicoNuvem, setModeloServicoNuvem] = useState(company?.modeloServicoNuvem || '');
  const [responsavelNuvem, setResponsavelNuvem] = useState(company?.responsavelNuvem || '');
  const [integracaoNuvemOnPremise, setIntegracaoNuvemOnPremise] = useState(company?.integracaoNuvemOnPremise || '');
  const [backupsNuvem, setBackupsNuvem] = useState(company?.backupsNuvem || '');
  const [controleAcessoNuvem, setControleAcessoNuvem] = useState(company?.controleAcessoNuvem || '');
  const [descricaoNuvem, setDescricaoNuvem] = useState(company?.descricaoNuvem || '');
  
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false);

  // Calcular tamanho da empresa
  const getTamanhoEmpresa = (colaboradores: number): 'pequena' | 'media' | 'grande' => {
    if (colaboradores <= 40) return 'pequena';
    if (colaboradores <= 100) return 'media';
    return 'grande';
  };

  const tamanhoEmpresa = getTamanhoEmpresa(numeroColaboradores);

  // Formatar CNPJ
  const formatCnpj = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cleaned.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Validar CNPJ
  const isValidCnpj = (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return false;
    
    // Verificar dígitos repetidos
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Calcular dígitos verificadores
    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    size = size + 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };

  // Buscar CNPJ
  const handleSearchCnpj = async () => {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    if (cleanedCnpj.length !== 14) {
      toast.error('CNPJ inválido!');
      return;
    }
    
    setIsSearchingCnpj(true);
    
    // Simular busca na API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Dados mockados para demonstração
    if (isValidCnpj(cnpj)) {
      setRazaoSocial(`Empresa ${cleanedCnpj.slice(0, 8)} LTDA`);
      toast.success('CNPJ encontrado! Dados preenchidos automaticamente.');
    } else {
      toast.error('CNPJ não encontrado ou inválido!');
    }
    
    setIsSearchingCnpj(false);
  };

  // Adicionar servidor Windows
  const addWindowsServer = () => {
    const newServer: ServerEntry = {
      id: Date.now().toString(),
      versao: '',
      tipo: '',
      quantidade: 1,
      fisicoVirtual: 'virtual'
    };
    setServidoresWindows([...servidoresWindows, newServer]);
  };

  // Adicionar servidor Linux
  const addLinuxServer = () => {
    const newServer: ServerEntry = {
      id: Date.now().toString(),
      versao: '',
      tipo: '',
      quantidade: 1,
      fisicoVirtual: 'virtual'
    };
    setServidoresLinux([...servidoresLinux, newServer]);
  };

  // Remover servidor
  const removeServer = (id: string, isWindows: boolean) => {
    if (isWindows) {
      setServidoresWindows(servidoresWindows.filter(s => s.id !== id));
    } else {
      setServidoresLinux(servidoresLinux.filter(s => s.id !== id));
    }
  };

  // Atualizar servidor
  const updateServer = (id: string, field: keyof ServerEntry, value: any, isWindows: boolean) => {
    if (isWindows) {
      setServidoresWindows(servidoresWindows.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      ));
    } else {
      setServidoresLinux(servidoresLinux.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      ));
    }
  };

  // Toggle provedor de nuvem
  const toggleProvedorNuvem = (provedorId: string) => {
    if (provedoresNuvem.includes(provedorId)) {
      setProvedoresNuvem(provedoresNuvem.filter(p => p !== provedorId));
    } else {
      setProvedoresNuvem([...provedoresNuvem, provedorId]);
    }
  };

  // Salvar empresa
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidCnpj(cnpj)) {
      toast.error('CNPJ inválido!');
      return;
    }
    
    if (!razaoSocial || !nomeUsuario || !emailCorporativo || !telefone) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }
    
    const companyData = {
      cnpj,
      razaoSocial,
      website,
      nomeUsuario,
      emailCorporativo,
      telefone,
      numeroColaboradores,
      tamanhoEmpresa,
      numeroEscritoriosFiliais,
      numeroLinksInternet,
      numeroLinksTransporte,
      numeroVpnSiteToSite,
      numeroComputadores,
      numeroServidores,
      modeloOperacional,
      servidoresWindows,
      servidoresLinux,
      servidoresFisicosHypervisor,
      detalhesHypervisor,
      tipoNuvem,
      provedoresNuvem,
      sistemasNuvem,
      modeloServicoNuvem,
      responsavelNuvem,
      integracaoNuvemOnPremise,
      backupsNuvem,
      controleAcessoNuvem,
      descricaoNuvem
    };
    
    setCompany(companyData);
    toast.success('Dados da empresa salvos com sucesso!');
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Empresa
          </CardTitle>
          <CardDescription>
            Informações básicas sobre a organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <div className="flex gap-2">
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSearchCnpj}
                  disabled={isSearchingCnpj}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                placeholder="Nome da empresa"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.empresa.com.br"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomeUsuario">Nome do Usuário *</Label>
              <Input
                id="nomeUsuario"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailCorporativo">Email Corporativo *</Label>
              <Input
                id="emailCorporativo"
                type="email"
                value={emailCorporativo}
                onChange={(e) => setEmailCorporativo(e.target.value)}
                placeholder="seu@empresa.com.br"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escala da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Escala da Empresa
          </CardTitle>
          <CardDescription>
            Informações sobre o tamanho e estrutura da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroColaboradores">Nº de Colaboradores/Usuários *</Label>
              <Input
                id="numeroColaboradores"
                type="number"
                min={0}
                value={numeroColaboradores}
                onChange={(e) => setNumeroColaboradores(parseInt(e.target.value) || 0)}
                required
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-slate-500">Classificação:</span>
                <Badge variant={tamanhoEmpresa === 'pequena' ? 'default' : tamanhoEmpresa === 'media' ? 'secondary' : 'destructive'}>
                  {tamanhoEmpresa === 'pequena' ? 'Pequena (≤40)' : tamanhoEmpresa === 'media' ? 'Média (41-100)' : 'Grande (>100)'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroEscritoriosFiliais">Nº de Escritórios/Filiais</Label>
              <Input
                id="numeroEscritoriosFiliais"
                type="number"
                min={0}
                value={numeroEscritoriosFiliais}
                onChange={(e) => setNumeroEscritoriosFiliais(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroLinksInternet">Nº de Links de Internet</Label>
              <Input
                id="numeroLinksInternet"
                type="number"
                min={0}
                value={numeroLinksInternet}
                onChange={(e) => setNumeroLinksInternet(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroLinksTransporte">Nº de Links de Transporte (LAN to LAN)</Label>
              <Input
                id="numeroLinksTransporte"
                type="number"
                min={0}
                value={numeroLinksTransporte}
                onChange={(e) => setNumeroLinksTransporte(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroVpnSiteToSite">Nº de Conexões VPN Site to Site</Label>
              <Input
                id="numeroVpnSiteToSite"
                type="number"
                min={0}
                value={numeroVpnSiteToSite}
                onChange={(e) => setNumeroVpnSiteToSite(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroComputadores">Nº Total de Computadores</Label>
              <Input
                id="numeroComputadores"
                type="number"
                min={0}
                value={numeroComputadores}
                onChange={(e) => setNumeroComputadores(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroServidores">Nº Total de Servidores</Label>
              <Input
                id="numeroServidores"
                type="number"
                min={0}
                value={numeroServidores}
                onChange={(e) => setNumeroServidores(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modeloOperacional">Modelo Operacional da Infraestrutura</Label>
            <Input
              id="modeloOperacional"
              value={modeloOperacional}
              onChange={(e) => setModeloOperacional(e.target.value)}
              placeholder="Ex: On-premise, Híbrido, Cloud-first"
            />
          </div>
        </CardContent>
      </Card>

      {/* Servidores Windows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Servidores Windows
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {servidoresWindows.map((server) => (
            <div key={server.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="space-y-2">
                <Label>Versão</Label>
                <Input
                  value={server.versao}
                  onChange={(e) => updateServer(server.id, 'versao', e.target.value, true)}
                  placeholder="Ex: 2019, 2022"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input
                  value={server.tipo}
                  onChange={(e) => updateServer(server.id, 'tipo', e.target.value, true)}
                  placeholder="Ex: DC, File Server"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  value={server.quantidade}
                  onChange={(e) => updateServer(server.id, 'quantidade', parseInt(e.target.value) || 1, true)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={server.fisicoVirtual}
                  onChange={(e) => updateServer(server.id, 'fisicoVirtual', e.target.value, true)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="fisico">Físico</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeServer(server.id, true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addWindowsServer}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Servidor Windows
          </Button>
        </CardContent>
      </Card>

      {/* Servidores Linux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Servidores Linux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {servidoresLinux.map((server) => (
            <div key={server.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="space-y-2">
                <Label>Versão</Label>
                <Input
                  value={server.versao}
                  onChange={(e) => updateServer(server.id, 'versao', e.target.value, false)}
                  placeholder="Ex: Ubuntu 22.04, RHEL 9"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input
                  value={server.tipo}
                  onChange={(e) => updateServer(server.id, 'tipo', e.target.value, false)}
                  placeholder="Ex: Web Server, Database"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  value={server.quantidade}
                  onChange={(e) => updateServer(server.id, 'quantidade', parseInt(e.target.value) || 1, false)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={server.fisicoVirtual}
                  onChange={(e) => updateServer(server.id, 'fisicoVirtual', e.target.value, false)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="fisico">Físico</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeServer(server.id, false)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLinuxServer}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Servidor Linux
          </Button>
        </CardContent>
      </Card>

      {/* Hypervisor */}
      <Card>
        <CardHeader>
          <CardTitle>Hypervisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="servidoresFisicosHypervisor">Nº de Servidores Físicos (Hypervisor)</Label>
            <Input
              id="servidoresFisicosHypervisor"
              type="number"
              min={0}
              value={servidoresFisicosHypervisor}
              onChange={(e) => setServidoresFisicosHypervisor(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detalhesHypervisor">Detalhes do Ambiente de Hypervisor</Label>
            <textarea
              id="detalhesHypervisor"
              value={detalhesHypervisor}
              onChange={(e) => setDetalhesHypervisor(e.target.value)}
              placeholder="Descreva detalhes sobre VMware, Hyper-V, Proxmox, etc."
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Nuvem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Ambiente em Nuvem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoNuvem">Tipo de Ambiente em Nuvem</Label>
            <Input
              id="tipoNuvem"
              value={tipoNuvem}
              onChange={(e) => setTipoNuvem(e.target.value)}
              placeholder="Ex: Pública, Privada, Híbrida"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Provedores de Nuvem Utilizados</Label>
            <div className="flex flex-wrap gap-2">
              {CloudProviders.map((provider) => (
                <Badge
                  key={provider.id}
                  variant={provedoresNuvem.includes(provider.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleProvedorNuvem(provider.id)}
                >
                  {provider.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sistemasNuvem">Sistemas/Aplicações em Nuvem</Label>
            <Input
              id="sistemasNuvem"
              value={sistemasNuvem}
              onChange={(e) => setSistemasNuvem(e.target.value)}
              placeholder="Ex: ERP, Email, Backup"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modeloServicoNuvem">Modelo de Serviço Predominante</Label>
            <Input
              id="modeloServicoNuvem"
              value={modeloServicoNuvem}
              onChange={(e) => setModeloServicoNuvem(e.target.value)}
              placeholder="Ex: IaaS, PaaS, SaaS"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsavelNuvem">Responsável pela Administração</Label>
            <Input
              id="responsavelNuvem"
              value={responsavelNuvem}
              onChange={(e) => setResponsavelNuvem(e.target.value)}
              placeholder="Ex: Interno, Terceirizado, Híbrido"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="integracaoNuvemOnPremise">Integração com On-Premise</Label>
            <Input
              id="integracaoNuvemOnPremise"
              value={integracaoNuvemOnPremise}
              onChange={(e) => setIntegracaoNuvemOnPremise(e.target.value)}
              placeholder="Descreva como é feita a integração"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backupsNuvem">Backups em Nuvem</Label>
            <Input
              id="backupsNuvem"
              value={backupsNuvem}
              onChange={(e) => setBackupsNuvem(e.target.value)}
              placeholder="Como são realizados os backups"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="controleAcessoNuvem">Controle de Acesso à Nuvem</Label>
            <Input
              id="controleAcessoNuvem"
              value={controleAcessoNuvem}
              onChange={(e) => setControleAcessoNuvem(e.target.value)}
              placeholder="Como é feito o controle de acesso"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricaoNuvem">Descrição do Ambiente em Nuvem</Label>
            <textarea
              id="descricaoNuvem"
              value={descricaoNuvem}
              onChange={(e) => setDescricaoNuvem(e.target.value)}
              placeholder="Descreva detalhadamente o ambiente de nuvem"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <CheckCircle className="h-5 w-5 mr-2" />
          Salvar e Continuar
        </Button>
      </div>
    </form>
  );
}
