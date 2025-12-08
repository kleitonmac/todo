import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let whatsappClient = null;
let isReady = false;

export const initWhatsApp = () => {
  if (process.env.WHATSAPP_ENABLED !== 'true') {
    console.log('⚠️ WhatsApp desabilitado. Configure WHATSAPP_ENABLED=true no .env');
    return null;
  }

  try {
    whatsappClient = new Client({
      authStrategy: new LocalAuth({
        clientId: 'todolist-client'
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    whatsappClient.on('qr', (qr) => {
      console.log('📱 Escaneie este QR Code com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    whatsappClient.on('ready', () => {
      console.log('✅ WhatsApp conectado e pronto!');
      isReady = true;
    });

    whatsappClient.on('authenticated', () => {
      console.log('✅ WhatsApp autenticado!');
    });

    whatsappClient.on('auth_failure', (msg) => {
      console.error('❌ Falha na autenticação WhatsApp:', msg);
      isReady = false;
    });

    whatsappClient.on('disconnected', (reason) => {
      console.log('⚠️ WhatsApp desconectado:', reason);
      isReady = false;
    });

    whatsappClient.initialize();
    return whatsappClient;
  } catch (error) {
    console.error('❌ Erro ao inicializar WhatsApp:', error);
    return null;
  }
};

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!whatsappClient || !isReady) {
    console.log('⚠️ WhatsApp não está pronto. Usando link direto.');
    // Retornar URL do WhatsApp Web como fallback
    const encodedMessage = encodeURIComponent(message);
    return {
      success: false,
      url: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      message: 'WhatsApp não conectado. Use o link fornecido.'
    };
  }

  try {
    // Formatar número (remover caracteres especiais)
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const chatId = `${formattedNumber}@c.us`;

    await whatsappClient.sendMessage(chatId, message);
    console.log(`✅ Mensagem enviada para ${phoneNumber}`);
    
    return {
      success: true,
      message: 'Mensagem enviada com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem WhatsApp:', error);
    
    // Fallback para link direto
    const encodedMessage = encodeURIComponent(message);
    return {
      success: false,
      url: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      message: 'Erro ao enviar. Use o link fornecido.',
      error: error.message
    };
  }
};

export const getWhatsAppStatus = () => {
  return {
    enabled: process.env.WHATSAPP_ENABLED === 'true',
    ready: isReady,
    client: whatsappClient !== null
  };
};

