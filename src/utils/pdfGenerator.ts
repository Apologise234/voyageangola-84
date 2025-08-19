// Função para gerar PDF da reserva
export const generateReservationPDF = (reservationData: any) => {
  // Criar conteúdo HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Comprovante de Reserva - Resort Paradise</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 1.2em;
          opacity: 0.9;
        }
        .reservation-id {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: center;
        }
        .reservation-id h2 {
          margin: 0 0 10px 0;
          color: #1e293b;
          font-size: 1.8em;
        }
        .reservation-id .id {
          font-family: 'Courier New', monospace;
          font-size: 1.5em;
          font-weight: bold;
          color: #0ea5e9;
          letter-spacing: 2px;
        }
        .section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section h3 {
          margin: 0 0 20px 0;
          color: #1e293b;
          font-size: 1.4em;
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #64748b;
        }
        .info-value {
          font-weight: 500;
          color: #1e293b;
          text-align: right;
        }
        .total-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #0ea5e9;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
        }
        .total-amount {
          font-size: 2.5em;
          font-weight: bold;
          color: #0ea5e9;
          margin: 10px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        .qr-placeholder {
          width: 100px;
          height: 100px;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #64748b;
        }
        .contact-info {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .contact-info h4 {
          margin: 0 0 15px 0;
          color: #1e293b;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        @media print {
          body { margin: 0; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Resort Paradise</h1>
        <p>Comprovante de Reserva Confirmada</p>
      </div>

      <div class="reservation-id">
        <h2>Número da Reserva</h2>
        <div class="id">${reservationData.id}</div>
      </div>

      <div class="section">
        <h3>Dados do Hóspede</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">${reservationData.guestName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">E-mail:</span>
              <span class="info-value">${reservationData.guestEmail}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Telefone:</span>
              <span class="info-value">${reservationData.guestPhone}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nº de Hóspedes:</span>
              <span class="info-value">${reservationData.guests} pessoa(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Detalhes da Reserva</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Acomodação:</span>
              <span class="info-value">${reservationData.room}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo:</span>
              <span class="info-value">${reservationData.roomType}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Check-in:</span>
              <span class="info-value">${new Date(reservationData.checkIn).toLocaleDateString('pt-BR')} - 15:00</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Check-out:</span>
              <span class="info-value">${new Date(reservationData.checkOut).toLocaleDateString('pt-BR')} - 12:00</span>
            </div>
            <div class="info-item">
              <span class="info-label">Noites:</span>
              <span class="info-value">${reservationData.nights}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value" style="color: #16a34a; font-weight: bold;">CONFIRMADA</span>
            </div>
          </div>
        </div>
        
        ${reservationData.specialRequests ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <div class="info-item">
            <span class="info-label">Observações:</span>
            <span class="info-value">${reservationData.specialRequests}</span>
          </div>
        </div>
        ` : ''}
      </div>

      <div class="total-section">
        <h3 style="margin: 0 0 10px 0; color: #0ea5e9;">Valor Total Pago</h3>
        <div class="total-amount">R$ ${reservationData.total.toFixed(2).replace('.', ',')}</div>
        <p style="margin: 10px 0 0 0; color: #64748b;">Pagamento processado com sucesso</p>
      </div>

      <div class="contact-info">
        <h4>Informações de Contato do Resort</h4>
        <div class="contact-grid">
          <div>
            <strong>Telefone:</strong> (11) 9999-8888<br>
            <strong>WhatsApp:</strong> (11) 9999-8888<br>
            <strong>E-mail:</strong> reservas@resortparadise.com
          </div>
          <div>
            <strong>Endereço:</strong><br>
            Estrada do Paradise, 1000<br>
            São Paulo - SP, Brasil
          </div>
        </div>
        
        <div class="qr-placeholder">
          QR Code<br>Verificação
        </div>
      </div>

      <div class="footer">
        <p><strong>Resort Paradise</strong> - Seu refúgio perfeito</p>
        <p>Este documento comprova sua reserva confirmada. Guarde-o para apresentar no check-in.</p>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;

  // Criar um novo documento HTML
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar carregamento e imprimir/salvar como PDF
    setTimeout(() => {
      printWindow.print();
      
      // Fechar janela após alguns segundos
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  }
};