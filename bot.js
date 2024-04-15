const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client'); // Importe o PrismaClient

const token = '6728662795:AAE-QzTMBGGEci2FnOClfHnIdjRkrkFe3C0'; // Substitua pelo seu token

const prisma = new PrismaClient(); // Inicialize o PrismaClient

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 9 && hour < 18) {
        bot.sendMessage(chatId, 'Bom dia! estamos em horário comercial! Confira o link: https://uvv.br');
    } else {
        bot.sendMessage(chatId, 'Desculpe estamos fora do horário comercial. Por favor, informe seu e-mail:');
    }
});

bot.onText(/\/email (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const email = match[1];

    bot.sendMessage(chatId, `E-mail recebido: ${email}. A empresa entrará em contato em breve!`);

    await prisma.email.create({
        data: {
            email: email,
        },
    });
});

bot.on('polling_error', (error) => {
    console.error('Erro no polling:', error);
});