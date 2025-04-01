import { FiX, FiPrinter } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './modal.css';
import Logo from '../../assets/Logo HRJN.png';

export default function Modal({ conteudo, close }) {
  const finalizadoEm = conteudo.finalizadoEm?.toDate?.() || conteudo.finalizadoEm || null;
  const criadoEm = conteudo.created?.toDate?.() || conteudo.created || new Date();

  const finalizadoFormat = finalizadoEm
    ? new Date(finalizadoEm).toLocaleString()
    : '—';

  const duracao = finalizadoEm
    ? formatDistanceStrict(criadoEm, finalizadoEm, { locale: ptBR })
    : 'Em andamento';

  const handlePrint = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = Logo;

    logo.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const rowHeight = 10;
      let currentY = 10;

      const logoWidth = 50;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logo, 'JPEG', logoX, currentY, logoWidth, 20);
      currentY += 30;

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text('Relatório de Chamado', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      doc.setFontSize(12);
      const fields = [
        ["Unidade:", "Hospital Regional Jesus Nazareno - FUSAM"],
        ["Cliente:", conteudo.cliente || 'N/A'],
        ["Usuário:", conteudo.usuario || 'N/A'],
        ["Assunto:", conteudo.assunto || 'N/A'],
        ["Cadastrado em:", conteudo.createdFormat || 'N/A'],
        ["Encerrado em:", finalizadoFormat],
        ["Duração do chamado:", duracao],
        ["Status:", conteudo.status || 'N/A'],
      ];

      fields.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, currentY);
        doc.setFont("helvetica", "normal");
        const textLines = doc.splitTextToSize(value, pageWidth - margin * 2 - 50);
        doc.text(textLines, margin + 50, currentY);
        const height = textLines.length * 6;
        currentY += height;

        if (currentY + rowHeight > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
      });

      if (conteudo.historicoStatus?.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Histórico de Status:", margin, currentY);
        currentY += rowHeight;

        doc.setFont("helvetica", "normal");
        conteudo.historicoStatus.forEach((item) => {
          const data = item.data?.seconds
            ? new Date(item.data.seconds * 1000).toLocaleString()
            : 'Data inválida';
          const linha = `- ${item.status} (${data}) por ${item.usuario || 'N/A'}`;
          const lines = doc.splitTextToSize(linha, pageWidth - margin * 2);
          doc.text(lines, margin, currentY);
          currentY += lines.length * 6;

          if (currentY + rowHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
        });
      }

      if (conteudo.complemento) {
        doc.setFont("helvetica", "bold");
        doc.text("Complemento:", margin, currentY);
        currentY += rowHeight;

        doc.setFont("helvetica", "normal");
        const complementoLines = doc.splitTextToSize(conteudo.complemento, pageWidth - margin * 2);
        doc.text(complementoLines, margin, currentY);
        currentY += complementoLines.length * 6;

        if (currentY + rowHeight > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
      }

      doc.setFontSize(10);
      const footerY = pageHeight - 10;
      const currentDate = new Date().toLocaleString();
      doc.text(`Relatório impresso em: ${currentDate}`, margin, footerY);
      doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - margin, footerY, { align: 'right' });

      doc.save('O.S (TI) HRJN.pdf');
    };

    logo.onerror = () => {
      console.error('Erro ao carregar a logo.');
    };
  };

  return (
    <div className="modal">
      <div className="container">
        <div className="modal-buttons modal-buttons-left">
          <button className="close" onClick={close}>
            <FiX size={20} color="#FFF" />
            Fechar
          </button>
          <button className="print" onClick={handlePrint}>
            <FiPrinter size={20} color="#FFF" />
            Imprimir
          </button>
        </div>

        <main>
          <h2>Detalhes do chamado</h2>

          <div className="row"><span>Unidade: <i>Hospital Regional Jesus Nazareno - FUSAM</i></span></div>
          <div className="row"><span>Cliente: <i>{conteudo.cliente}</i></span></div>
          <div className="row"><span>Usuário: <i>{conteudo.usuario || 'Usuário não informado'}</i></span></div>
          <div className="row"><span>Assunto: <i>{conteudo.assunto}</i></span></div>
          <div className="row"><span>Cadastrado em: <i>{conteudo.createdFormat}</i></span></div>
          <div className="row"><span>Encerrado em: <i>{finalizadoFormat}</i></span></div>
          <div className="row"><span>Duração do chamado: <i>{duracao}</i></span></div>

          <div className="row">
            <span>Status:
              <i className="status-badge" style={{ backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                {conteudo.status}
              </i>
            </span>
          </div>

          {conteudo.historicoStatus?.length > 0 && (
            <div className="modal-section">
              <h3>Histórico de Status</h3>
              <ul className="status-history">
                {conteudo.historicoStatus.map((item, index) => {
                  const data = item.data?.seconds
                    ? new Date(item.data.seconds * 1000).toLocaleString()
                    : 'Data inválida';
                  return (
                    <li key={index}>
                      <strong>{item.status}</strong> – {data}<br />
                      <small>por {item.usuario || '—'}</small>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {conteudo.complemento && (
            <div className="modal-section">
              <h3>Complemento</h3>
              <p>{conteudo.complemento}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}