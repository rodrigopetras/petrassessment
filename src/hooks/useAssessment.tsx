import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { Assessment, Answer, Company, Question, MaturityLevel } from '@/types';
import { cisQuestions, filterQuestionsByCompanySize } from '@/data/cisQuestions';
import { useAuth } from './useAuth';

interface AssessmentContextType {
  assessment: Assessment | null;
  answers: Record<string, Answer>;
  company: Company | null;
  setCompany: (company: Company) => void;
  setAnswer: (questionId: string, value: string | number | boolean | string[], maturityLevel?: MaturityLevel) => void;
  getAnswer: (questionId: string) => Answer | undefined;
  getProgress: () => number;
  getMissingFields: () => string[];
  submitAssessment: () => Promise<boolean>;
  exportToTxt: () => string;
  loadAssessment: (id: string) => void;
  createNewAssessment: () => void;
  isPart1Complete: () => boolean;
  getFilteredQuestions: () => Question[];
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [company, setCompanyState] = useState<Company | null>(null);

  useEffect(() => {
    if (user) {
      const savedAssessment = localStorage.getItem(`assessment-${user.id}`);
      if (savedAssessment) {
        const parsed = JSON.parse(savedAssessment);
        setAssessment(parsed.assessment);
        setAnswers(parsed.answers || {});
        setCompanyState(parsed.company || null);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && assessment) {
      localStorage.setItem(`assessment-${user.id}`, JSON.stringify({
        assessment,
        answers,
        company
      }));
    }
  }, [assessment, answers, company, user]);

  const setCompany = (newCompany: Company) => {
    setCompanyState(newCompany);
    
    if (!assessment) {
      const newAssessment: Assessment = {
        id: `assessment-${Date.now()}`,
        userId: user?.id || '',
        company: newCompany,
        answers: [],
        status: 'draft',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setAssessment(newAssessment);
    } else {
      setAssessment({
        ...assessment,
        company: newCompany,
        updatedAt: new Date()
      });
    }
  };

  const setAnswer = (
    questionId: string,
    value: string | number | boolean | string[],
    maturityLevel?: MaturityLevel
  ) => {
    const newAnswer: Answer = {
      questionId,
      value,
      ...(maturityLevel !== undefined && { maturityLevel })
    };
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }));
  };

  const getAnswer = (questionId: string): Answer | undefined => {
    return answers[questionId];
  };

  const getFilteredQuestions = (): Question[] => {
    if (!company) return [];
    return filterQuestionsByCompanySize(cisQuestions, company.tamanhoEmpresa);
  };

  const getProgress = (): number => {
    if (!company) return 0;
    
    const filteredQuestions = getFilteredQuestions();
    const allQuestions = filteredQuestions;
    const requiredQuestions = allQuestions.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => 
      answers[q.id] !== undefined && answers[q.id]?.value !== ''
    ).length;
    
    return requiredQuestions.length > 0 
      ? Math.round((answeredRequired / requiredQuestions.length) * 100)
      : 0;
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    
    if (!company) {
      missing.push('Dados da Empresa');
      return missing;
    }
    
    const requiredCompanyFields = [
      { field: 'cnpj', label: 'CNPJ' },
      { field: 'razaoSocial', label: 'Razao Social' },
      { field: 'nomeUsuario', label: 'Nome do Usuario' },
      { field: 'emailCorporativo', label: 'Email Corporativo' },
      { field: 'telefone', label: 'Telefone' },
      { field: 'numeroColaboradores', label: 'N de Colaboradores' }
    ];
    
    requiredCompanyFields.forEach(({ field, label }) => {
      if (!company[field as keyof Company]) {
        missing.push(label);
      }
    });
    
    const filteredQuestions = getFilteredQuestions();
    const unansweredQuestions = filteredQuestions.filter(q => 
      q.required && (!answers[q.id] || answers[q.id]?.value === '')
    );
    
    unansweredQuestions.forEach(q => {
      missing.push(`${q.category} - ${q.text.substring(0, 50)}...`);
    });
    
    return missing;
  };

  const isPart1Complete = (): boolean => {
    return false;
  };

  const submitAssessment = async (): Promise<boolean> => {
    const missing = getMissingFields();
    
    if (missing.length > 0) {
      return false;
    }
    
    const completedAssessment: Assessment = {
      ...assessment!,
      answers: Object.values(answers),
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
      updatedAt: new Date()
    };
    
    setAssessment(completedAssessment);
    
    localStorage.setItem(`assessment-completed-${completedAssessment.id}`, JSON.stringify({
      assessment: completedAssessment,
      answers,
      company
    }));
    
    return true;
  };

  const exportToTxt = (): string => {
    if (!assessment || !company) return '';
    
    let content = 'ASSESSMENT DE SEGURANCA DA INFORMACAO\n';
    content += '=' .repeat(50) + '\n\n';
    
    content += 'DADOS DA EMPRESA\n';
    content += '-'.repeat(30) + '\n';
    content += `CNPJ: ${company.cnpj}\n`;
    content += `Razao Social: ${company.razaoSocial}\n`;
    content += `Website: ${company.website || 'Nao informado'}\n`;
    content += `Nome do Usuario: ${company.nomeUsuario}\n`;
    content += `Email Corporativo: ${company.emailCorporativo}\n`;
    content += `Telefone: ${company.telefone}\n`;
    content += `N de Colaboradores: ${company.numeroColaboradores}\n`;
    content += `Tamanho da Empresa: ${company.tamanhoEmpresa.toUpperCase()}\n`;
    content += `Escritorios/Filiais: ${company.numeroEscritoriosFiliais}\n`;
    content += `Links de Internet: ${company.numeroLinksInternet}\n`;
    content += `Links de Transporte: ${company.numeroLinksTransporte}\n`;
    content += `VPN Site to Site: ${company.numeroVpnSiteToSite}\n`;
    content += `Computadores: ${company.numeroComputadores}\n`;
    content += `Servidores: ${company.numeroServidores}\n`;
    content += `Modelo Operacional: ${company.modeloOperacional}\n`;
    content += `Tipo de Nuvem: ${company.tipoNuvem}\n`;
    content += `Provedores de Nuvem: ${company.provedoresNuvem.join(', ')}\n\n`;
    
    content += 'RESPOSTAS DO ASSESSMENT\n';
    content += '-'.repeat(30) + '\n\n';
    
    const filteredQuestions = getFilteredQuestions();
    
    filteredQuestions.forEach(q => {
      const answer = answers[q.id];
      content += `[${q.category}] ${q.text}\n`;
      content += `Resposta: ${answer ? answer.value : 'Nao respondida'}\n`;
      if (answer?.maturityLevel !== undefined) {
        const maturityLabels = ['Nao Implementado', 'Em Implementacao', 'Implementado Parcialmente', 'Em Fase Final', 'Totalmente Implementado'];
        content += `Nivel de Maturidade: ${maturityLabels[answer.maturityLevel]}\n`;
      }
      content += '\n';
    });
    
    content += '\n' + '='.repeat(50) + '\n';
    content += `Assessment gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
    content += `ID do Assessment: ${assessment.id}\n`;
    
    return content;
  };

  const loadAssessment = (id: string) => {
    const saved = localStorage.getItem(`assessment-completed-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAssessment(parsed.assessment);
      setAnswers(parsed.answers || {});
      setCompanyState(parsed.company || null);
    }
  };

  const createNewAssessment = () => {
    setAssessment(null);
    setAnswers({});
    setCompanyState(null);
    
    if (user) {
      localStorage.removeItem(`assessment-${user.id}`);
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessment,
        answers,
        company,
        setCompany,
        setAnswer,
        getAnswer,
        getProgress,
        getMissingFields,
        submitAssessment,
        exportToTxt,
        loadAssessment,
        createNewAssessment,
        isPart1Complete,
        getFilteredQuestions
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
