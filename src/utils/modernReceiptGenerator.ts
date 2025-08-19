
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptData {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerBI: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  reservationDetails: {
    type: string;
    name: string;
    checkIn?: string;
    checkOut?: string;
    guests: number;
    location: string;
  };
  costs: {
    subtotal: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
  };
  paymentMethod: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'cancelled';
  qrCode?: string;
}

export const generateModernReceiptPDF = (receiptData: ReceiptData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-AO">
    <head>
      <meta charset="utf-8">
      <title>Recibo ${receiptData.receiptNumber} - Resort Paradise</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          color: #1a202c;
          background: #f7fafc;
          padding: 20px;
        }
        
        .receipt-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          color: white;
          padding: 40px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><pattern id="grain" width="100" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="5" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="15" r="0.3" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="8" r="0.4" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="20" fill="url(%23grain)"/></svg>') repeat;
        }
        
        .logo {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
        }
        
        .tagline {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        
        .qr-section {
          position: relative;
          z-index: 1;
        }
        
        .qr-code {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.95);
          border-radius: 8px;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #64748b;
          border: 2px solid rgba(255,255,255,0.3);
        }
        
        .receipt-title {
          background: #1e293b;
          color: white;
          padding: 25px 40px;
          text-align: center;
        }
        
        .receipt-title h1 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        
        .receipt-number {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 1.2rem;
          color: #f1f5f9;
          letter-spacing: 2px;
        }
        
        .content {
          padding: 40px;
        }
        
        .section {
          margin-bottom: 35px;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          background: #f8fafc;
        }
        
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-icon {
          width: 20px;
          height: 20px;
          background: #0ea5e9;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 500;
          color: #64748b;
        }
        
        .info-value {
          font-weight: 600;
          color: #1e293b;
          text-align: right;
        }
        
        .financial-summary {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #0ea5e9;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
        }
        
        .cost-breakdown {
          margin-bottom: 20px;
        }
        
        .cost-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 0.95rem;
        }
        
        .cost-item.discount {
          color: #16a34a;
          font-weight: 500;
        }
        
        .total-section {
          border-top: 2px solid #0ea5e9;
          padding-top: 15px;
          margin-top: 15px;
        }
        
        .total-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #0ea5e9;
          text-align: center;
        }
        
        .payment-status {
          text-align: center;
          margin: 20px 0;
        }
        
        .status-badge {
          display: inline-block;
          background: #dcfce7;
          color: #15803d;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid #bbf7d0;
        }
        
        .terms-section {
          background: #f1f5f9;
          padding: 25px;
          border-radius: 8px;
          margin-top: 30px;
          border: 1px solid #e2e8f0;
        }
        
        .terms-title {
          font-weight: 600;
          margin-bottom: 15px;
          color: #1e293b;
        }
        
        .terms-list {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
        }
        
        .footer {
          background: #1e293b;
          color: #cbd5e1;
          padding: 30px 40px;
          text-align: center;
        }
        
        .footer-content {
          margin-bottom: 20px;
        }
        
        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
          font-size: 0.9rem;
        }
        
        .footer-note {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 20px;
          border-top: 1px solid #334155;
          padding-top: 15px;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 4rem;
          font-weight: 100;
          color: rgba(14, 165, 233, 0.05);
          z-index: -1;
          pointer-events: none;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 0;
            background: white;
          }
          .receipt-container { 
            box-shadow: none; 
            border-radius: 0;
          }
          .section { 
            break-inside: avoid; 
          }
          .watermark {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark">RESORT PARADISE</div>
      
      <div class="receipt-container">
        <!-- Header with Logo and QR Code -->
        <header class="header">
          <div class="logo">Resort Paradise</div>
          <div class="tagline">Seu refúgio perfeito</div>
          <div class="qr-section">
            <div class="qr-code">
              QR Code<br>
              Verificação
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              Código: ${receiptData.id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </header>

        <!-- Receipt Title -->
        <div class="receipt-title">
          <h1>RECIBO DE PAGAMENTO</h1>
          <div class="receipt-number">${receiptData.receiptNumber}</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <!-- Customer Information -->
          <section class="section">
            <h2 class="section-title">
              <div class="section-icon">👤</div>
              Dados do Cliente
            </h2>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Nome Completo:</span>
                  <span class="info-value">${receiptData.customerName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Bilhete de Identidade:</span>
                  <span class="info-value">${receiptData.customerBI}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${receiptData.customerEmail}</span>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Telefone:</span>
                  <span class="info-value">${receiptData.customerPhone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Endereço:</span>
                  <span class="info-value">${receiptData.customerAddress}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Data de Emissão:</span>
                  <span class="info-value">${format(new Date(receiptData.paymentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Reservation Details -->
          <section class="section">
            <h2 class="section-title">
              <div class="section-icon">🏨</div>
              Detalhes da Reserva
            </h2>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Serviço:</span>
                  <span class="info-value">${receiptData.reservationDetails.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tipo:</span>
                  <span class="info-value">${receiptData.reservationDetails.type}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Localização:</span>
                  <span class="info-value">${receiptData.reservationDetails.location}</span>
                </div>
              </div>
              <div>
                ${receiptData.reservationDetails.checkIn ? `
                <div class="info-item">
                  <span class="info-label">Check-in:</span>
                  <span class="info-value">${format(new Date(receiptData.reservationDetails.checkIn), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                ` : ''}
                ${receiptData.reservationDetails.checkOut ? `
                <div class="info-item">
                  <span class="info-label">Check-out:</span>
                  <span class="info-value">${format(new Date(receiptData.reservationDetails.checkOut), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                ` : ''}
                <div class="info-item">
                  <span class="info-label">Nº de Pessoas:</span>
                  <span class="info-value">${receiptData.reservationDetails.guests}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Financial Summary -->
          <div class="financial-summary">
            <h2 class="section-title" style="margin-bottom: 20px;">
              <div class="section-icon">💳</div>
              Resumo Financeiro
            </h2>
            
            <div class="cost-breakdown">
              <div class="cost-item">
                <span>Subtotal dos Serviços:</span>
                <span>AOA ${receiptData.costs.subtotal.toLocaleString('pt-AO')}</span>
              </div>
              <div class="cost-item">
                <span>Impostos e Taxas (14% IVA):</span>
                <span>AOA ${receiptData.costs.taxes.toLocaleString('pt-AO')}</span>
              </div>
              <div class="cost-item">
                <span>Taxa de Serviço:</span>
                <span>AOA ${receiptData.costs.fees.toLocaleString('pt-AO')}</span>
              </div>
              ${receiptData.costs.discounts > 0 ? `
              <div class="cost-item discount">
                <span>Desconto Aplicado:</span>
                <span>-AOA ${receiptData.costs.discounts.toLocaleString('pt-AO')}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="total-section">
              <div class="total-amount">
                AOA ${receiptData.costs.total.toLocaleString('pt-AO')}
              </div>
              <div class="payment-status">
                <span class="status-badge">✓ PAGAMENTO CONFIRMADO</span>
              </div>
              <div style="text-align: center; margin-top: 10px; color: #64748b;">
                Método: ${receiptData.paymentMethod}
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="terms-section">
            <h3 class="terms-title">Termos e Condições Resumidos</h3>
            <div class="terms-list">
              • Este recibo confirma o pagamento integral dos serviços contratados<br>
              • Cancelamentos seguem a política específica de cada serviço<br>
              • Alterações estão sujeitas à disponibilidade e taxas adicionais<br>
              • Check-in: 15h00 | Check-out: 12h00 (salvo acordos específicos)<br>
              • Documento obrigatório com foto será solicitado no check-in<br>
              • Recibo válido por 12 meses a partir da data de emissão<br>
              • Para suporte: +244 912 345 678 ou reservas@resortparadise.ao
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;">
              Resort Paradise Angola
            </div>
            
            <div class="contact-info">
              <div>
                <strong>Reservas & Informações</strong><br>
                📞 +244 912 345 678<br>
                📱 WhatsApp: +244 923 456 789<br>
                ✉️ reservas@resortparadise.ao
              </div>
              <div>
                <strong>Localização</strong><br>
                🏨 Estrada do Paraíso, Km 15<br>
                Luanda Sul, Talatona<br>
                🌐 www.resortparadise.ao
              </div>
              <div>
                <strong>Licenças & Certificações</strong><br>
                INGT: 001/2024/LUANDA<br>
                NIF: 5000000000<br>
                Alvará Turístico: AT-001-2024
              </div>
            </div>
          </div>
          
          <div class="footer-note">
            <strong>Obrigado por escolher o Resort Paradise!</strong><br>
            Este documento tem valor legal e deve ser apresentado quando solicitado.<br>
            Gerado automaticamente em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
          </div>
        </footer>
      </div>
    </body>
    </html>
  `;

  // Criar janela para impressão/PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar carregamento e processar
    setTimeout(() => {
      printWindow.print();
      
      // Fechar janela após alguns segundos
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  }
};
