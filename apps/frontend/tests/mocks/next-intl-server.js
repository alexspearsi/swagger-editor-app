const { __createTranslator } = require('./next-intl');
const messages = require('../../messages/en.json');

async function getTranslations(namespace) {
  return __createTranslator(namespace);
}

async function getLocale() {
  return 'en';
}

async function getMessages() {
  return messages;
}

module.exports = { getTranslations, getLocale, getMessages };
