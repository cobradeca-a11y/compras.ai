import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'documentos');

// Garantir que o diretório existe
if (!existsSync(DOCS_DIR)) {
  mkdirSync(DOCS_DIR, { recursive: true });
}

/**
 * Gera todos os documentos necessários para uma aquisição
 */
export async function gerarDocumentos(aquisicao, usuario) {
  const documentos = [];

  // Sempre gerar DFD e TR
  documentos.push(await gerarDFD(aquisicao, usuario));
  documentos.push(await gerarTR(aquisicao, usuario));

  // Gerar ETP se necessário
  if (aquisicao.gera_etp === 'SIM') {
    documentos.push(await gerarETP(aquisicao, usuario));
  }

  // Gerar Mapa de Risco se necessário
  if (aquisicao.gera_mapa_risco === 'SIM') {
    documentos.push(await gerarMapaRisco(aquisicao, usuario));
  }

  return documentos;
}

/**
 * Gera DFD (Documento de Formalização da Demanda)
 */
async function gerarDFD(aquisicao, usuario) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Cabeçalho
        new Paragraph({
          text: 'DOCUMENTO DE FORMALIZAÇÃO DA DEMANDA - DFD',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Identificação
        new Paragraph({
          text: '1. IDENTIFICAÇÃO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Unidade Demandante: ', bold: true }),
            new TextRun(usuario.nome || 'Não informado')
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Email: ', bold: true }),
            new TextRun(usuario.email || 'Não informado')
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Data: ', bold: true }),
            new TextRun(new Date().toLocaleDateString('pt-BR'))
          ],
          spacing: { after: 200 }
        }),

        // Objeto
        new Paragraph({
          text: '2. OBJETO DA CONTRATAÇÃO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.descricao || 'Não informado',
          spacing: { after: 200 }
        }),

        // Justificativa
        new Paragraph({
          text: '3. JUSTIFICATIVA DA NECESSIDADE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.justificativa_necessidade || 'Justificativa a ser preenchida',
          spacing: { after: 200 }
        }),

        // Modalidade
        new Paragraph({
          text: '4. MODALIDADE DE CONTRATAÇÃO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Modalidade: ', bold: true }),
            new TextRun(aquisicao.modalidade || 'Não informado')
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: aquisicao.justificativa_modalidade || '',
          spacing: { after: 200 }
        }),

        // Estimativa de valor
        new Paragraph({
          text: '5. ESTIMATIVA DE VALOR',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Valor Estimado: ', bold: true }),
            new TextRun(aquisicao.valor_estimado ? 
              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aquisicao.valor_estimado) : 
              'A definir')
          ],
          spacing: { after: 200 }
        }),

        // Normas aplicáveis
        new Paragraph({
          text: '6. NORMAS APLICÁVEIS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.normas_aplicaveis || 'Lei nº 14.133/2021',
          spacing: { after: 200 }
        }),

        // Assinatura
        new Paragraph({
          text: '7. RESPONSÁVEL PELA DEMANDA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: '_'.repeat(50),
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 }
        }),

        new Paragraph({
          text: usuario.nome || 'Nome do Responsável',
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 }
        }),

        new Paragraph({
          text: usuario.email || 'Email',
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const nomeArquivo = `DFD_${aquisicao.id}_${Date.now()}.docx`;
  const caminhoCompleto = join(DOCS_DIR, nomeArquivo);
  
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(caminhoCompleto, buffer);

  return {
    tipo: 'DFD',
    nome: nomeArquivo,
    path: caminhoCompleto
  };
}

/**
 * Gera TR (Termo de Referência)
 */
async function gerarTR(aquisicao, usuario) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Cabeçalho
        new Paragraph({
          text: 'TERMO DE REFERÊNCIA',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // 1. Objeto
        new Paragraph({
          text: '1. DO OBJETO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.descricao || 'Descrição do objeto',
          spacing: { after: 200 }
        }),

        // 2. Justificativa
        new Paragraph({
          text: '2. DA JUSTIFICATIVA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.justificativa_necessidade || 'Justificativa da necessidade',
          spacing: { after: 200 }
        }),

        // 3. Especificações
        new Paragraph({
          text: '3. DAS ESPECIFICAÇÕES',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Quantidade: ', bold: true }),
            new TextRun(aquisicao.quantidade || 'Conforme demanda')
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Especificações: ', bold: true }),
            new TextRun(aquisicao.descricao || 'Conforme objeto')
          ],
          spacing: { after: 200 }
        }),

        // 4. Prazo de entrega
        new Paragraph({
          text: '4. DO PRAZO DE ENTREGA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.prazo ? 
            `Prazo de entrega: ${aquisicao.prazo} dias corridos a partir da assinatura do contrato.` : 
            'Prazo a ser definido conforme negociação.',
          spacing: { after: 200 }
        }),

        // 5. Garantia
        new Paragraph({
          text: '5. DA GARANTIA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: `Período mínimo de garantia: ${aquisicao.garantia_meses || 12} meses.`,
          spacing: { after: 200 }
        }),

        // 6. Valor estimado
        new Paragraph({
          text: '6. DO VALOR ESTIMADO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.valor_estimado ? 
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aquisicao.valor_estimado) : 
            'Valor a ser definido mediante pesquisa de preços.',
          spacing: { after: 200 }
        }),

        // 7. Obrigações
        new Paragraph({
          text: '7. DAS OBRIGAÇÕES DA CONTRATADA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: '• Entregar o objeto conforme especificações;',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Cumprir os prazos estabelecidos;',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Prestar garantia conforme especificado;',
          bullet: { level: 0 },
          spacing: { after: 200 }
        }),

        // Responsável
        new Paragraph({
          text: '_'.repeat(50),
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 }
        }),

        new Paragraph({
          text: usuario.nome || 'Responsável Técnico',
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 }
        }),

        new Paragraph({
          text: new Date().toLocaleDateString('pt-BR'),
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const nomeArquivo = `TR_${aquisicao.id}_${Date.now()}.docx`;
  const caminhoCompleto = join(DOCS_DIR, nomeArquivo);
  
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(caminhoCompleto, buffer);

  return {
    tipo: 'TR',
    nome: nomeArquivo,
    path: caminhoCompleto
  };
}

/**
 * Gera ETP (Estudo Técnico Preliminar)
 */
async function gerarETP(aquisicao, usuario) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'ESTUDO TÉCNICO PRELIMINAR - ETP',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '1. DESCRIÇÃO DA NECESSIDADE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.descricao || 'Descrição da necessidade',
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '2. ANÁLISE DE MERCADO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: 'A análise de mercado será realizada mediante pesquisa de preços e consulta a fornecedores habilitados.',
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '3. ANÁLISE DE RISCOS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.motivo_etp || 'Análise de riscos conforme complexidade da contratação.',
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '4. ESTIMATIVA DE CUSTO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: aquisicao.valor_estimado ? 
            `Valor estimado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aquisicao.valor_estimado)}` : 
            'Valor a ser definido mediante pesquisa de mercado.',
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '_'.repeat(50),
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 }
        }),

        new Paragraph({
          text: usuario.nome || 'Responsável pelo ETP',
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const nomeArquivo = `ETP_${aquisicao.id}_${Date.now()}.docx`;
  const caminhoCompleto = join(DOCS_DIR, nomeArquivo);
  
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(caminhoCompleto, buffer);

  return {
    tipo: 'ETP',
    nome: nomeArquivo,
    path: caminhoCompleto
  };
}

/**
 * Gera Mapa de Risco
 */
async function gerarMapaRisco(aquisicao, usuario) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'MAPA DE RISCOS',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '1. IDENTIFICAÇÃO',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Objeto: ', bold: true }),
            new TextRun(aquisicao.descricao || 'Não informado')
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Modalidade: ', bold: true }),
            new TextRun(aquisicao.modalidade || 'Não informado')
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '2. RISCOS IDENTIFICADOS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: '• Risco de não entrega no prazo',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Risco de não conformidade com especificações',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Risco de descontinuidade do fornecedor',
          bullet: { level: 0 },
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '3. MEDIDAS MITIGADORAS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        }),

        new Paragraph({
          text: '• Estabelecimento de prazos com margem de segurança',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Fiscalização rigorosa da execução contratual',
          bullet: { level: 0 }
        }),
        new Paragraph({
          text: '• Pesquisa de idoneidade do fornecedor',
          bullet: { level: 0 },
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '_'.repeat(50),
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 }
        }),

        new Paragraph({
          text: usuario.nome || 'Responsável',
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const nomeArquivo = `MAPA_RISCO_${aquisicao.id}_${Date.now()}.docx`;
  const caminhoCompleto = join(DOCS_DIR, nomeArquivo);
  
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(caminhoCompleto, buffer);

  return {
    tipo: 'MAPA_RISCO',
    nome: nomeArquivo,
    path: caminhoCompleto
  };
}
