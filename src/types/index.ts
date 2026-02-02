// Tipos principais da aplicação de Assessment de Segurança

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  socialProvider?: 'google' | 'microsoft' | 'facebook';
}

export interface Company {
  cnpj: string;
  razaoSocial: string;
  website?: string;
  nomeUsuario: string;
  emailCorporativo: string;
  telefone: string;
  numeroColaboradores: number;
  tamanhoEmpresa: 'pequena' | 'media' | 'grande';
  numeroEscritoriosFiliais: number;
  numeroLinksInternet: number;
  numeroLinksTransporte: number;
  numeroVpnSiteToSite: number;
  numeroComputadores: number;
  numeroServidores: number;
  modeloOperacional: string;
  servidoresWindows: ServerInfo[];
  servidoresLinux: ServerInfo[];
  servidoresFisicosHypervisor: number;
  detalhesHypervisor: string;
  tipoNuvem: string;
  provedoresNuvem: string[];
  sistemasNuvem: string;
  modeloServicoNuvem: string;
  responsavelNuvem: string;
  integracaoNuvemOnPremise: string;
  backupsNuvem: string;
  controleAcessoNuvem: string;
  descricaoNuvem: string;
}

export interface ServerInfo {
  id?: string;
  versao: string;
  tipo: string;
  quantidade: number;
  fisicoVirtual: 'fisico' | 'virtual';
}

export type QuestionType = 'yes_no' | 'text' | 'maturity' | 'number' | 'select' | 'multi_select';

export type MaturityLevel = 0 | 1 | 2 | 3 | 4;

export const MaturityLabels: Record<MaturityLevel, string> = {
  0: 'Não Implementado',
  1: 'Em Implementação',
  2: 'Implementado Parcialmente',
  3: 'Em Fase Final',
  4: 'Totalmente Implementado'
};

export const MaturityColors: Record<MaturityLevel, string> = {
  0: 'bg-red-500',
  1: 'bg-orange-500',
  2: 'bg-yellow-500',
  3: 'bg-blue-400',
  4: 'bg-blue-600'
};

export interface Question {
  id: string;
  category: string;
  group: string;
  assetClass: string;
  securityFunction: string;
  text: string;
  type: QuestionType;
  options?: string[];
  pequenas: boolean;
  medias: boolean;
  grandes: boolean;
  required: boolean;
  order: number;
}

export interface Answer {
  questionId: string;
  value: string | number | boolean | string[];
  maturityLevel?: MaturityLevel;
}

export interface Assessment {
  id: string;
  userId: string;
  company: Company;
  answers: Answer[];
  status: 'draft' | 'completed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface AssessmentCategory {
  id: string;
  name: string;
  groups: AssessmentGroup[];
}

export interface AssessmentGroup {
  id: string;
  name: string;
  questions: Question[];
}

export interface CloudProvider {
  id: string;
  name: string;
}

export const CloudProviders: CloudProvider[] = [
  { id: 'aws', name: 'Amazon Web Services (AWS)' },
  { id: 'azure', name: 'Microsoft Azure' },
  { id: 'gcp', name: 'Google Cloud Platform' },
  { id: 'oracle', name: 'Oracle Cloud' },
  { id: 'ibm', name: 'IBM Cloud' },
  { id: 'alibaba', name: 'Alibaba Cloud' },
  { id: 'digitalocean', name: 'DigitalOcean' },
  { id: 'none', name: 'Não Possui Nuvem' }
];

export const Part1Questions = {
  email: [
    {
      id: 'email_tipo_servico',
      text: 'Que tipo de serviço de e-mail a organização usa?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'email_antispam',
      text: 'O ambiente de e-mail utiliza solução de antispam avançada?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'email_administracao',
      text: 'Quem administra a infraestrutura e segurança?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'email_colaboracao',
      text: 'Detalhar como os terceiros e internos colaboram na administração do ambiente',
      type: 'text' as QuestionType,
      required: true
    }
  ],
  rede: [
    {
      id: 'rede_switches_total',
      text: 'Quantidade de switches total em toda rede (matriz e filiais)?',
      type: 'number' as QuestionType,
      required: true
    },
    {
      id: 'rede_ap_total',
      text: 'Quantidade de Access Point (AP) total em toda rede (matriz e filiais)?',
      type: 'number' as QuestionType,
      required: true
    },
    {
      id: 'rede_switches_fabricantes',
      text: 'Quais modelos ou fabricantes de switches são utilizados na infraestrutura de rede?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'rede_ap_fabricantes',
      text: 'Quais modelos ou fabricantes de Access Points (AP) são utilizados?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'rede_vlan_segmentada',
      text: 'A rede interna é segmentada por VLANs para separar áreas críticas?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'rede_controle_acesso',
      text: 'Existe controle de acesso à rede cabeada e WIFI (NAC ou 802.1X)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'rede_wifi_separado',
      text: 'O Wi-Fi corporativo é separado entre rede corporativa e visitantes?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'rede_monitoramento',
      text: 'Há monitoramento e gerenciamento centralizado da rede (controladora)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'rede_redundancia',
      text: 'Existe redundância de switches ou links para evitar indisponibilidade da rede?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  iot: [
    {
      id: 'iot_dispositivos',
      text: 'Existem dispositivos IoT integrados ao ambiente de rede da empresa?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'iot_inventariado',
      text: 'Os dispositivos IoT são inventariados e gerenciados com políticas de segurança?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'iot_controle_acesso',
      text: 'Existem controles de acesso e segmentação de rede para dispositivos IoT?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'iot_firewall',
      text: 'Os IoT têm acesso a internet controlado por firewall?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'iot_ot',
      text: 'A empresa possui dispositivos de Tecnologia Operacional (OT) em operação?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  governanca: [
    {
      id: 'gov_politica',
      text: 'A organização possui uma política de segurança da informação documentada?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'gov_revisao',
      text: 'Existe um processo de revisão e atualização regular da política de segurança?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'gov_gestao_riscos',
      text: 'A organização possui processo de gestão de riscos cibernéticos documentado?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'gov_ciso',
      text: 'Existe um responsável formal pela segurança (CISO ou equivalente)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'gov_detalhes',
      text: 'Descreva mais detalhes sobre Governança e Estratégia',
      type: 'text' as QuestionType,
      required: false
    }
  ],
  identidade: [
    {
      id: 'id_credenciais_individuais',
      text: 'Todos os usuários possuem credenciais individuais?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_desativacao',
      text: 'Como é realizado o processo de desativação de usuários em casos de desligamento?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'id_iam',
      text: 'Possui gestão de identidade (IAM)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_mfa_admin',
      text: 'Há autenticação multifator (MFA) para acessos administrativos e remotos?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_revisao_acessos',
      text: 'Existe revisão periódica de acessos e segregação de funções?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_politica_senhas',
      text: 'Há política de senhas com complexidade e expiração configuradas?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_contas_desativadas',
      text: 'As contas de ex-funcionários são desativadas automaticamente no desligamento?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_ad_centralizado',
      text: 'Existe sistema centralizado de autenticação (AD, Azure AD, IAM)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'id_mfa_aplicacoes',
      text: 'São utilizados mecanismos de autenticação multifator (MFA) em quais aplicações?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'id_revogacao_senha',
      text: 'Existem política de revogação de senha de acesso a rede?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  cofre_senhas: [
    {
      id: 'cofre_utiliza',
      text: 'A organização utiliza um cofre de senha para gerenciar e proteger credenciais?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'cofre_politicas',
      text: 'Existem políticas de uso de senhas fortes e exclusivas para cada serviço?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'cofre_controle',
      text: 'O acesso ao cofre de senha é controlado e monitorado?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  firewall: [
    {
      id: 'fw_solucao',
      text: 'Solução de Firewall de Borda',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'fw_modelo',
      text: 'Informe o modelo dos Firewalls e tipo licenciamento de forma abreviada',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'fw_quantidade',
      text: 'Descreva a quantidade e a distribuição de firewalls físicos e virtuais',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'fw_gestao',
      text: 'A organização utiliza uma ferramenta de gestão centralizada de firewalls?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'fw_segmentacao',
      text: 'Há segmentação de rede (VLANs, DMZ, segregação OT/IT)?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  servidores: [
    {
      id: 'srv_segmentacao',
      text: 'A infraestrutura de servidores está segmentada em rede própria com firewall interno?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'srv_seguranca',
      text: 'Os servidores são configurados com segurança, incluindo firewalls e sistemas de detecção?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'srv_monitoramento',
      text: 'Os servidores são monitorados continuamente para detectar ameaças e vulnerabilidades?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  antimalware: [
    {
      id: 'am_solucao',
      text: 'Qual solução de antimalware a organização usa?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'am_recursos',
      text: 'A solução de antimalware tem qual destes recursos avançados?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'am_instalado',
      text: 'O antimalware está instalado em todos os computadores e servidores?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'am_politicas',
      text: 'Existem políticas de resposta rápida para incidentes de malware detectados?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'am_console',
      text: 'Existe monitoramento centralizado de endpoints (console)?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  patch: [
    {
      id: 'patch_atualizacoes',
      text: 'As atualizações e patches são aplicados regularmente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'patch_gestao',
      text: 'Possui solução de gestão de patches (Patch Management)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'patch_desktop',
      text: 'A empresa utiliza alguma solução de gerenciamento de desktops?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  aplicacoes: [
    {
      id: 'app_nuvem',
      text: 'A organização utiliza aplicações hospedadas em nuvem?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'app_bancos',
      text: 'A organização mantém bancos de dados corporativos hospedados?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  soc: [
    {
      id: 'soc_possui',
      text: 'A empresa possui um SOC (Security Operations Center)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'soc_tipo',
      text: 'O Centro de Operações de Segurança (SOC) é operado internamente ou terceirizado?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'soc_siem',
      text: 'Existe plataforma de SIEM consolidando logs de segurança?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'soc_mdr',
      text: 'A empresa possui algum serviço de MDR (Managed Detection and Response)?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  incidentes: [
    {
      id: 'inc_playbooks',
      text: 'Existem playbooks documentados de resposta a incidentes?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'inc_tabletop',
      text: 'São realizados testes simulados de incidentes (tabletop)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'inc_mttd',
      text: 'Existem indicadores MTTD e MTTR sendo monitorados e acompanhados regularmente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'inc_lioes',
      text: 'Os incidentes são analisados e revisados com lições aprendidas?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  backup: [
    {
      id: 'bkp_politicas',
      text: 'Existem políticas de backup claras e documentadas?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'bkp_ferramenta',
      text: 'Ferramenta de backup utilizada?',
      type: 'text' as QuestionType,
      required: true
    },
    {
      id: 'bkp_testes',
      text: 'Os backups são regularmente testados para garantir a recuperação de dados?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'bkp_locais',
      text: 'Os backups da organização são armazenados em múltiplos locais seguros?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  dr: [
    {
      id: 'dr_bcp',
      text: 'Existe um plano de continuidade de negócios (BCP) formalizado?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'dr_drp',
      text: 'Há um plano de recuperação de desastres (DRP) testado periodicamente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'dr_restauracao',
      text: 'Há procedimentos de restauração testados regularmente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'dr_ambiente',
      text: 'Existe ambiente alternativo ou redundante para sistemas críticos?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  vulnerabilidade: [
    {
      id: 'vuln_varredura',
      text: 'A organização utiliza ferramentas de varredura de vulnerabilidades?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'vuln_relatorios',
      text: 'Os relatórios de vulnerabilidade são acompanhados pela gestão?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'vuln_recorrente',
      text: 'Os scans de vulnerabilidades são realizados de forma recorrente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'vuln_politicas',
      text: 'Existem políticas documentadas para a correção de vulnerabilidades identificadas?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  monitoramento: [
    {
      id: 'mon_indisponibilidade',
      text: 'A organização possui sistemas de monitoramento contínuo para detectar indisponibilidade?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'mon_dashboards',
      text: 'Existem dashboards ou relatórios regulares para manter a alta administração informada?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'mon_kpis',
      text: 'A empresa possui indicadores de cibersegurança (KPIs e relatórios executivos)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'mon_logs',
      text: 'Os logs são retidos, centralizados e monitorados para identificar atividades suspeitas?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  conformidade: [
    {
      id: 'conf_grc',
      text: 'A organização utiliza alguma plataforma de GRC?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conf_auditorias',
      text: 'A empresa realiza auditorias regulares de segurança da informação?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conf_normas',
      text: 'Existe conformidade com normas e regulamentações relevantes (ISO/IEC 27001, CIS, NIST)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conf_pentest',
      text: 'São realizados testes de penetração nas aplicações regularmente?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conf_phishing',
      text: 'São realizados testes de phishing simulados?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  lgpd: [
    {
      id: 'lgpd_conforme',
      text: 'A organização está em conformidade com os requisitos da LGPD?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'lgpd_riscos',
      text: 'Não estando em conformidade com a LGPD, a organização conhece os riscos e penalidades?',
      type: 'yes_no' as QuestionType,
      required: false
    },
    {
      id: 'lgpd_processos',
      text: 'Os processos de coleta, armazenamento e processamento de dados pessoais são documentados?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'lgpd_dpo',
      text: 'Existe um encarregado de proteção de dados (DPO) designado na organização?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'lgpd_titulares',
      text: 'Os titulares dos dados são informados sobre seus direitos?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  conscientizacao: [
    {
      id: 'conc_programa',
      text: 'Os funcionários participam de programas de conscientização sobre segurança da informação?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conc_treinamento',
      text: 'Existem treinamentos específicos para lidar com ameaças como phishing?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'conc_campanhas',
      text: 'São feitas campanhas de conscientização?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  fornecedores: [
    {
      id: 'forn_homologacao',
      text: 'Existe processo de homologação de fornecedores com avaliação de segurança?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'forn_contratos',
      text: 'Os contratos incluem cláusulas de confidencialidade e segurança?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'forn_monitoramento',
      text: 'Há monitoramento contínuo de fornecedores críticos?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'forn_mfa',
      text: 'Fornecedores com acesso remoto usam MFA e VPN segura?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  pam: [
    {
      id: 'pam_solucao',
      text: 'A empresa utiliza uma solução de PAM (Privileged Access Management)?',
      type: 'yes_no' as QuestionType,
      required: true
    },
    {
      id: 'pam_revogacao',
      text: 'Há processo formal para revogação de acessos de terceiros?',
      type: 'yes_no' as QuestionType,
      required: true
    }
  ],
  complementar: [
    {
      id: 'comp_tema',
      text: 'Há algum ponto ou tema que você considera importante incluir para complementar a análise?',
      type: 'text' as QuestionType,
      required: false
    }
  ]
};
