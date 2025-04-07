import { FiX } from 'react-icons/fi';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  padding: 4rem 1.5rem;
  backdrop-filter: blur(2px);
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;

  button {
    background-color: #f44336;
    color: #fff;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  button:hover {
    background-color: #d32f2f;
    transform: translateY(-1px);
  }
`;

const Title = styled.h2`
  font-size: 1.9rem;
  font-weight: 700;
  color: #1f1f1f;
  border-left: 5px solid #4caf50;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
`;

const Section = styled.div`
  border-left: 4px solid #e0e0e0;
  padding-left: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #4caf50;
  margin-bottom: 1rem;
`;

const Field = styled.div`
  margin-bottom: 0.75rem;

  label {
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 0.25rem;
  }

  span {
    display: inline-block;
    background-color: #f7f7f7;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    color: #444;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    font-size: 0.97rem;
  }
`;

const LinkAnexo = styled.a`
  color: #007bff;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`;

export default function ModalContrato({ close, conteudo }) {
  if (!conteudo) return null;

  const renderField = (label, value) => {
    if (!value) return null;

    const isLink = typeof value === 'string' && value.startsWith('http');
    return (
      <Field>
        <label>{label}</label>
        <span>
          {isLink ? (
            <LinkAnexo href={value} target="_blank" rel="noopener noreferrer">
              Ver Anexo
            </LinkAnexo>
          ) : value}
        </span>
      </Field>
    );
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <button onClick={close}>
            <FiX size={18} />
            Fechar
          </button>
        </ModalHeader>

        <Title>Detalhes do Contrato</Title>

        <Section>
          <SectionTitle>Informações do Contrato</SectionTitle>
          {renderField('Número do Contrato', conteudo.numeroContrato)}
          {renderField('Tipo de Contrato', conteudo.tipoContrato)}
          {renderField('Modalidade de Licitação', conteudo.modalidadeLicitacao)}
          {renderField('Número do Processo', conteudo.numeroProcesso)}
          {renderField('Objeto do Contrato', conteudo.objetoContrato)}
        </Section>

        <Section>
          <SectionTitle>Partes Envolvidas</SectionTitle>
          {renderField('Empresa Contratada', conteudo.empresaContratada)}
          {renderField('CNPJ', conteudo.cnpj)}
          {renderField('Representante Legal', conteudo.representanteLegal)}
          {renderField('Contato da Contratada', conteudo.contatoContratada)}
          {renderField('Empresa Contratante', conteudo.empresaContratante)}
          {renderField('Responsável pelo Contrato', conteudo.responsavelContrato)}
        </Section>

        <Section>
          <SectionTitle>Vigência e Prazos</SectionTitle>
          {renderField('Data de Assinatura', conteudo.dataAssinatura)}
          {renderField('Data de Início', conteudo.dataInicio)}
          {renderField('Data de Término', conteudo.dataFim)}
          {renderField('Duração Total (meses)', conteudo.duracao)}
          {renderField('Renovação Automática', conteudo.renovacaoAutomatica)}
          {renderField('Prazo para Renovação (dias)', conteudo.prazoRenovacao)}
        </Section>

        <Section>
          <SectionTitle>Valores e Condições Financeiras</SectionTitle>
          {renderField('Valor Total', conteudo.valorTotal)}
          {renderField('Forma de Pagamento', conteudo.formaPagamento)}
          {renderField('Valor das Parcelas', conteudo.valorParcelas)}
          {renderField('Vencimento das Parcelas', conteudo.vencimentoParcelas)}
          {renderField('Índice de Reajuste', conteudo.indiceReajuste)}
          {renderField('Multas e Penalidades', conteudo.multasPenalidades)}
        </Section>

        <Section>
          <SectionTitle>Garantias e SLA</SectionTitle>
          {renderField('Tempo de Resposta', conteudo.tempoResposta)}
          {renderField('Tempo de Resolução', conteudo.tempoResolucao)}
          {renderField('Cobertura do Suporte', conteudo.suporte)}
          {renderField('Possui Garantia?', conteudo.possuiGarantia)}
          {renderField('Prazo da Garantia', conteudo.prazoGarantia)}
        </Section>

        <Section>
          <SectionTitle>Status e Histórico</SectionTitle>
          {renderField('Status do Contrato', conteudo.status)}
          {renderField('Histórico de Alterações', conteudo.historico)}
          {renderField('Observações e Notas', conteudo.observacoes)}
        </Section>
      </ModalContainer>
    </ModalOverlay>
  );
}
