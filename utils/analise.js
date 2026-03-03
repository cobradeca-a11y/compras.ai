/**
 * Sistema de Análise Inteligente de Aquisições
 * Analisa e enquadra aquisições nas normas vigentes
 */

export function analisarAquisicao(dados) {
  const {
    modalidade,
    tipo_contratacao,
    complexidade,
    valor_estimado,
    prazo
  } = dados;

  const analise = {
    justificativa_modalidade: gerarJustificativaModalidade(modalidade),
    justificativa_necessidade: gerarJustificativaNecessidade(dados),
    normas_aplicaveis: gerarNormasAplicaveis(modalidade),
    garantia_meses: calcularGarantia(tipo_contratacao),
    regras: {
      etp: verificarNecessidadeETP(dados),
      mapa_risco: verificarNecessidadeMapaRisco(dados)
    }
  };

  return analise;
}

function gerarJustificativaModalidade(modalidade) {
  const justificativas = {
    'DISPENSA': 'Contratação enquadrada nas hipóteses de dispensa de licitação previstas no art. 75 da Lei nº 14.133/2021, considerando o valor estimado e a natureza do objeto.',
    'INEXIGIBILIDADE': 'Contratação caracterizada pela inviabilidade de competição, conforme art. 74 da Lei nº 14.133/2021, devido à natureza singular do objeto ou exclusividade do fornecedor.',
    'PREGAO': 'Modalidade adequada para aquisição de bens e serviços comuns, conforme definido no art. 6º, XIII da Lei nº 14.133/2021, permitindo maior celeridade e economia processual.',
    'CONCORRENCIA': 'Modalidade necessária em razão do valor estimado ou da complexidade do objeto, conforme arts. 28 e 29 da Lei nº 14.133/2021, garantindo ampla competitividade.',
    'OUTRA': 'Modalidade definida conforme características específicas da contratação e legislação aplicável.'
  };

  return justificativas[modalidade] || justificativas['OUTRA'];
}

function gerarJustificativaNecessidade(dados) {
  const { tipo_contratacao, descricao } = dados;

  if (tipo_contratacao === 'CONTINUADA') {
    return `A contratação é necessária para garantir a continuidade dos serviços essenciais da unidade. ${descricao ? 'O objeto destina-se a: ' + descricao : ''}`;
  }

  return `A aquisição visa atender necessidade específica e pontual da unidade. ${descricao ? 'Especificamente: ' + descricao : ''}`;
}

function gerarNormasAplicaveis(modalidade) {
  const normas = [
    'Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos)',
    'Decreto nº 11.462/2023 (Regulamenta a Lei 14.133/2021)',
    'IN SEGES/ME nº 65/2021 (Contratação de soluções de TIC)',
  ];

  if (modalidade === 'PREGAO') {
    normas.push('Decreto nº 10.024/2019 (Pregão Eletrônico)');
  }

  return normas.join('; ');
}

function calcularGarantia(tipo_contratacao) {
  // Contratações continuadas geralmente exigem maior período de garantia
  return tipo_contratacao === 'CONTINUADA' ? 12 : 6;
}

function verificarNecessidadeETP(dados) {
  const { tipo_contratacao, complexidade, valor_estimado } = dados;

  // Regras para ETP (Estudo Técnico Preliminar)
  const valor = valor_estimado || 0;

  // ETP é obrigatório para:
  // 1. Contratações continuadas
  // 2. Contratações de alta complexidade
  // 3. Contratações acima de R$ 176.000,00

  if (tipo_contratacao === 'CONTINUADA') {
    return {
      gera: true,
      justificativa: 'ETP obrigatório para contratações continuadas (art. 18, §1º da Lei 14.133/2021)'
    };
  }

  if (complexidade === 'ALTA') {
    return {
      gera: true,
      justificativa: 'ETP necessário devido à alta complexidade da contratação'
    };
  }

  if (valor > 176000) {
    return {
      gera: true,
      justificativa: 'ETP obrigatório para contratações acima de R$ 176.000,00'
    };
  }

  return {
    gera: false,
    justificativa: 'ETP não obrigatório para esta contratação (valor, tipo e complexidade não exigem)'
  };
}

function verificarNecessidadeMapaRisco(dados) {
  const { tipo_contratacao, complexidade, valor_estimado } = dados;

  const valor = valor_estimado || 0;

  // Mapa de Risco é obrigatório para:
  // 1. Contratações continuadas
  // 2. Contratações de média ou alta complexidade
  // 3. Contratações acima de R$ 200.000,00

  if (tipo_contratacao === 'CONTINUADA') {
    return {
      gera: true,
      justificativa: 'Mapa de Riscos obrigatório para contratações continuadas (IN SEGES/ME nº 65/2021)'
    };
  }

  if (complexidade === 'MEDIA' || complexidade === 'ALTA') {
    return {
      gera: true,
      justificativa: 'Mapa de Riscos necessário devido à complexidade da contratação'
    };
  }

  if (valor > 200000) {
    return {
      gera: true,
      justificativa: 'Mapa de Riscos obrigatório para contratações de alto valor'
    };
  }

  return {
    gera: false,
    justificativa: 'Mapa de Riscos não obrigatório para esta contratação'
  };
}
