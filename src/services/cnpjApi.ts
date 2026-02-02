// Serviço de consulta de CNPJ usando BrasilAPI
// API gratuita e pública: https://brasilapi.com.br

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  cnae_fiscal_descricao: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  qtd_funcionarios: number | null;
}

export async function consultarCnpj(cnpj: string): Promise<CnpjData | null> {
  // Remove caracteres não numéricos
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }

  try {
    // Usando BrasilAPI - API pública e gratuita
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado');
      }
      throw new Error(`Erro na consulta: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      cnpj: data.cnpj,
      razao_social: data.razao_social,
      nome_fantasia: data.nome_fantasia,
      data_inicio_atividade: data.data_inicio_atividade,
      descricao_situacao_cadastral: data.descricao_situacao_cadastral,
      cnae_fiscal_descricao: data.cnae_fiscal_descricao,
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
      },
      qtd_funcionarios: data.qtd_funcionarios,
    };
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw error;
  }
}

// Função para validar CNPJ
export function validarCnpj(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
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
}

// Formatar CNPJ
export function formatarCnpj(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
