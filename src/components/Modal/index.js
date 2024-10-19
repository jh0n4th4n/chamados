import { FiX, FiPrinter } from 'react-icons/fi'; // Importando o ícone de impressão
import { jsPDF } from 'jspdf';
import './modal.css';
import Logo from '../../assets/testelogo.jpg'; // Certifique-se de que este caminho está correto

export default function Modal({ conteudo, close }) {
  // Função para gerar o PDF
  const handlePrint = () => {
    const doc = new jsPDF();
  
    // Criando uma nova imagem
    const logo = new Image();
    logo.src = Logo; // Use o caminho direto da imagem

    // Defina a função onload da imagem
    logo.onload = () => {
      // Adicionando a logo ao PDF
      doc.addImage(logo, 'JPEG', 10, 10, 50, 20); // Ajuste as coordenadas e tamanhos conforme necessário

      // Adicionando o conteúdo do modal
      doc.setFontSize(20);
      doc.text('Detalhes do Chamado', 10, 40);
      doc.setFontSize(12);
      doc.text(`Unidade: Hospital Regional Jesus Nazareno - FUSAM`, 10, 50);
      doc.text(`Cliente: ${conteudo.cliente}`, 10, 60);
      doc.text(`Usuário: ${conteudo.usuario}`, 10, 70);
      doc.text(`Assunto: ${conteudo.assunto}`, 10, 80);
      doc.text(`Cadastrado em: ${conteudo.createdFormat}`, 10, 90);
      doc.text(`Status: ${conteudo.status}`, 10, 100);
  
      if (conteudo.complemento) {
        doc.text(`Complemento: ${conteudo.complemento}`, 10, 110);
      }
  
      // Salvar o PDF
      doc.save('chamado.pdf');
    };
  
    // Caso a imagem não consiga ser carregada, podemos exibir uma mensagem de erro
    logo.onerror = () => {
      console.error('Erro ao carregar a logo.');
    };
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

            <div className="row">
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
                Usuário: <i>{conteudo.usuario}</i>
              </span>
            </div>

            <div className="row">
              <span>
                Assunto: <i>{conteudo.assunto}</i>
              </span>
              </div>
              
              <div className="row">
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

          {conteudo.complemento && (
            <>
              <h3>Complemento</h3>
              <p>{conteudo.complemento}</p>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
