import { useState, useEffect } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Part1Questions as Part1QuestionsData } from '@/types';
import { toast } from 'sonner';
import { CheckCircle, Mail, Network, Cpu, Shield, Users, Lock, Server, Cloud, FileText, HelpCircle, Building2 } from 'lucide-react';

interface Part1QuestionsProps {
  onComplete: () => void;
}

export function Part1Questions({ onComplete }: Part1QuestionsProps) {
  const { answers, setAnswer, company } = useAssessment();
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});

  // Carregar respostas existentes
  useEffect(() => {
    const existingAnswers: Record<string, any> = {};
    Object.entries(answers).forEach(([key, answer]) => {
      existingAnswers[key] = answer.value;
    });
    setLocalAnswers(existingAnswers);
  }, [answers]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }));
    setAnswer(questionId, value);
  };

  const renderQuestion = (question: any) => {
    const value = localAnswers[question.id] || '';

    switch (question.type) {
      case 'yes_no':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleAnswerChange(question.id, val)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${question.id}-sim`} />
              <Label htmlFor={`${question.id}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${question.id}-nao`} />
              <Label htmlFor={`${question.id}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );

      case 'number':
        return (
          <Input
            type="number"
            min={0}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value) || 0)}
            className="max-w-xs"
          />
        );

      case 'text':
      default:
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Digite sua resposta..."
            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
          />
        );
    }
  };

  const QuestionCard = ({ question, index }: { question: any; index: number }) => (
    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
          {index + 1}
        </span>
        <div className="flex-1">
          <Label className="text-sm font-medium">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="mt-2">
            {renderQuestion(question)}
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = () => {
    // Verificar campos obrigatórios
    const allQuestions = [
      ...Part1QuestionsData.email,
      ...Part1QuestionsData.rede,
      ...Part1QuestionsData.iot,
      ...Part1QuestionsData.governanca,
      ...Part1QuestionsData.identidade,
      ...Part1QuestionsData.cofre_senhas,
      ...Part1QuestionsData.firewall,
      ...Part1QuestionsData.servidores,
      ...Part1QuestionsData.antimalware,
      ...Part1QuestionsData.patch,
      ...Part1QuestionsData.aplicacoes,
      ...Part1QuestionsData.soc,
      ...Part1QuestionsData.incidentes,
      ...Part1QuestionsData.backup,
      ...Part1QuestionsData.dr,
      ...Part1QuestionsData.vulnerabilidade,
      ...Part1QuestionsData.monitoramento,
      ...Part1QuestionsData.conformidade,
      ...Part1QuestionsData.lgpd,
      ...Part1QuestionsData.conscientizacao,
      ...Part1QuestionsData.fornecedores,
      ...Part1QuestionsData.pam,
      ...Part1QuestionsData.complementar
    ];

    const missingRequired = allQuestions.filter(q => 
      q.required && (!localAnswers[q.id] || localAnswers[q.id] === '')
    );

    if (missingRequired.length > 0) {
      toast.error(`Existem ${missingRequired.length} perguntas obrigatórias não respondidas!`);
      return;
    }

    toast.success('Parte 1 do Assessment concluída!');
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Parte 1: Informações Gerais</h2>
          <p className="text-slate-500">
            Preencha as informações sobre a infraestrutura e segurança da sua organização
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {company?.tamanhoEmpresa?.toUpperCase() || 'EMPRESA'}
        </Badge>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">E-mail</span>
          </TabsTrigger>
          <TabsTrigger value="rede" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Rede</span>
          </TabsTrigger>
          <TabsTrigger value="iot" className="flex items-center gap-1">
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">IoT/OT</span>
          </TabsTrigger>
          <TabsTrigger value="governanca" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Governança</span>
          </TabsTrigger>
          <TabsTrigger value="identidade" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Identidade</span>
          </TabsTrigger>
          <TabsTrigger value="cofre" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Cofre</span>
          </TabsTrigger>
          <TabsTrigger value="firewall" className="flex items-center gap-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Firewall</span>
          </TabsTrigger>
          <TabsTrigger value="servidores" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Servidores</span>
          </TabsTrigger>
          <TabsTrigger value="antimalware" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Anti-malware</span>
          </TabsTrigger>
          <TabsTrigger value="patch" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Patch</span>
          </TabsTrigger>
          <TabsTrigger value="soc" className="flex items-center gap-1">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">SOC</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Backup/DR</span>
          </TabsTrigger>
          <TabsTrigger value="lgpd" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">LGPD</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                E-mail
              </CardTitle>
              <CardDescription>Informações sobre o ambiente de e-mail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.email.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rede" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Infraestrutura de Rede
              </CardTitle>
              <CardDescription>Informações sobre switches, APs e segmentação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.rede.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                IoT e Tecnologia Operacional
              </CardTitle>
              <CardDescription>Dispositivos IoT e OT no ambiente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.iot.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governanca" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Governança e Estratégia
              </CardTitle>
              <CardDescription>Políticas e gestão de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.governanca.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identidade" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Identidade
              </CardTitle>
              <CardDescription>Controle de acesso e autenticação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.identidade.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cofre" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Cofre de Senhas
              </CardTitle>
              <CardDescription>Gerenciamento de credenciais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.cofre_senhas.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Firewall
              </CardTitle>
              <CardDescription>Proteção de perímetro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.firewall.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servidores" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Servidores
              </CardTitle>
              <CardDescription>Segurança de infraestrutura de servidores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.servidores.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="antimalware" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Anti-malware
              </CardTitle>
              <CardDescription>Proteção contra malware</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.antimalware.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patch" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Patch Management
              </CardTitle>
              <CardDescription>Gestão de atualizações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.patch.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soc" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                SOC e Monitoramento
              </CardTitle>
              <CardDescription>Centro de operações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.soc.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
              {Part1QuestionsData.incidentes.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + Part1QuestionsData.soc.length} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Backup e Recuperação
              </CardTitle>
              <CardDescription>Estratégias de backup e DR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.backup.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
              {Part1QuestionsData.dr.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + Part1QuestionsData.backup.length} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lgpd" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                LGPD e Conformidade
              </CardTitle>
              <CardDescription>Conformidade regulatória</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Part1QuestionsData.lgpd.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
              {Part1QuestionsData.conformidade.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + Part1QuestionsData.lgpd.length} />
              ))}
              {Part1QuestionsData.vulnerabilidade.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + Part1QuestionsData.lgpd.length + Part1QuestionsData.conformidade.length} />
              ))}
              {Part1QuestionsData.monitoramento.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i + Part1QuestionsData.lgpd.length + Part1QuestionsData.conformidade.length + Part1QuestionsData.vulnerabilidade.length} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <CheckCircle className="h-5 w-5 mr-2" />
          Concluir Parte 1
        </Button>
      </div>
    </div>
  );
}
