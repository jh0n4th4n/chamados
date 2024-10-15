import { FiX, FiPrinter } from 'react-icons/fi'; // Importando o ícone de impressão
import './modal.css';

export default function Modal({ conteudo, close }) {

  // Função para imprimir o conteúdo do modal
  const handlePrint = () => {
    window.print(); // Chama a função de impressão do navegador
  };

  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <button className="print" onClick={handlePrint}>
          <FiPrinter size={25} color="#FFF" />
          Imprimir
        </button>

        <main>
          <h2>Detalhes do chamado</h2>

          <div classname="row">
            <span>
              Unidade: <i> Hospital Regional Jesus Nazareno - FUSAM</i>
            </span>
          </div>

          <div className="row">
            <span>
              Cliente: <i>{conteudo.cliente}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Assunto: <i>{conteudo.assunto}</i>
            </span>
            <span>
              Cadastrado em: <i>{conteudo.createdFormat}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Status:
              <i className="status-badge" style={{ color: "#FFF", backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                {conteudo.status}
              </i>
            </span>
          </div>

          {conteudo.complemento !== '' && (
            <>
              <h3>Complemento</h3>
              <p>
                {conteudo.complemento}
              </p>
            </>
          )}

        </main>
      </div>
    </div>
  )
}
