import { useState, useEffect } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCategories, getGroupsByCategory } from '@/data/cisQuestions';
import { MaturityLabels, type Question, type MaturityLevel } from '@/types';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

interface Part2QuestionsProps {
  onComplete: () => void;
}

export function Part2Questions({ onComplete }: Part2QuestionsProps) {
  const { company, answers, setAnswer, getProgress, getMissingFields, submitAssessment, getFilteredQuestions } = useAssessment();
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});
  const [maturityLevels, setMaturityLevels] = useState<Record<string, number>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');

  const filteredQuestions = getFilteredQuestions();
  const categories = getCategories();
  
  // Inicializar categoria ativa
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Carregar respostas existentes
  useEffect(() => {
    const existingAnswers: Record<string, any> = {};
    const existingMaturity: Record<string, number> = {};
    
    Object.entries(answers).forEach(([key, answer]) => {
      existingAnswers[key] = answer.value;
      if (answer.maturityLevel !== undefined) {
        existingMaturity[key] = answer.maturityLevel;
      }
    });
    
    setLocalAnswers(existingAnswers);
    setMaturityLevels(existingMaturity);
  }, [answers]);

  const handleAnswerChange = (questionId: string, value: any, maturityLevel?: number) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (maturityLevel !== undefined) {
      setMaturityLevels(prev => ({ ...prev, [questionId]: maturityLevel }));
    }
    
    setAnswer(questionId, value, maturityLevel as MaturityLevel);
  };

  const getMaturityColor = (level: number): string => {
    const colors: Record<number, string> = {
      0: 'bg-red-500',
      1: 'bg-orange-500',
      2: 'bg-yellow-500',
      3: 'bg-blue-400',
      4: 'bg-blue-600'
    };
    return colors[level] || 'bg-gray-300';
  };

  const renderQuestion = (question: Question) => {
    const value = localAnswers[question.id] || '';
    const maturityLevel = maturityLevels[question.id] || 0;

    if (question.type === 'maturity') {
      return (
        <div className="space-y-4">
          <RadioGroup
            value={value}
            onValueChange={(val) => handleAnswerChange(question.id, val, maturityLevel)}
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
          
          {value === 'sim' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nível de Maturidade:</span>
                <Badge className={getMaturityColor(maturityLevel)}>
                  {MaturityLabels[maturityLevel as 0 | 1 | 2 | 3 | 4]}
                </Badge>
              </div>
              <Slider
                value={[maturityLevel]}
                onValueChange={([val]) => handleAnswerChange(question.id, value, val)}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Não Implementado</span>
                <span>Em Implementação</span>
                <span>Implementado Parcialmente</span>
                <span>Em Fase Final</span>
                <span>Totalmente Implementado</span>
              </div>
            </div>
          )}
        </div>
      );
    }

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
  };

  const QuestionCard = ({ question, index }: { question: Question; index: number }) => (
    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <Label className="text-sm font-medium">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {question.securityFunction}
              </Badge>
            </div>
          </div>
          <div className="mt-2">
            {renderQuestion(question)}
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    const missing = getMissingFields();
    
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowSubmitDialog(true);
      return;
    }
    
    const success = await submitAssessment();
    
    if (success) {
      toast.success('Assessment enviado com sucesso!');
      onComplete();
    } else {
      toast.error('Erro ao enviar assessment. Verifique os campos obrigatórios.');
    }
  };

  const progress = getProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Parte 2: CIS Controls</h2>
          <p className="text-slate-500">
            Avaliação baseada nos controles CIS para empresas {company?.tamanhoEmpresa}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {filteredQuestions.length} perguntas
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Progresso:</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Questions by Category */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map((category) => {
            const categoryQuestions = filteredQuestions.filter(q => q.category === category);
            const answeredCount = categoryQuestions.filter(q => localAnswers[q.id]).length;
            
            return (
              <TabsTrigger 
                key={category} 
                value={category}
                className="relative"
              >
                {category}
                {answeredCount === categoryQuestions.length && categoryQuestions.length > 0 && (
                  <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => {
          const categoryQuestions = filteredQuestions.filter(q => q.category === category);
          const groups = getGroupsByCategory(category);
          
          return (
            <TabsContent key={category} value={category} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    {categoryQuestions.length} perguntas nesta categoria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {groups.map((group) => {
                    const groupQuestions = categoryQuestions.filter(q => q.group === group);
                    if (groupQuestions.length === 0) return null;
                    
                    return (
                      <div key={group} className="space-y-4">
                        <h4 className="font-semibold text-slate-700 border-b pb-2">{group}</h4>
                        <div className="space-y-4">
                          {groupQuestions
                            .sort((a, b) => a.order - b.order)
                            .map((q, i) => (
                              <QuestionCard key={q.id} question={q} index={i} />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => setShowSubmitDialog(true)}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-500"
        >
          <Send className="h-5 w-5 mr-2" />
          Enviar Assessment
        </Button>
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Enviar Assessment</DialogTitle>
            <DialogDescription>
              Revise as informações antes de enviar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Progresso Total:</span>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32 h-2" />
                <span className="font-medium">{progress}%</span>
              </div>
            </div>
            
            {missingFields.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Campos pendentes:</span>
                </div>
                <div className="max-h-48 overflow-auto p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <ul className="space-y-1">
                    {missingFields.map((field, i) => (
                      <li key={i} className="text-sm text-amber-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-slate-500">
                  Preencha todos os campos obrigatórios antes de enviar.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Todas as perguntas foram respondidas!</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continuar Editando
            </Button>
            {missingFields.length === 0 && (
              <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
                <Send className="h-4 w-4 mr-2" />
                Confirmar Envio
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
