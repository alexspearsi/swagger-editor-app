const React = require('react');
const messages = require('../../messages/en.json');

function getNested(namespace, key) {
  let node = messages[namespace];

  for (const part of key.split('.')) {
    node = node?.[part];
  }

  return node;
}

function interpolate(template, values) {
  if (!values || typeof template !== 'string') {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
  );
}

function createTranslator(namespace) {
  function t(key, values) {
    const template = getNested(namespace, key);

    return interpolate(template ?? key, values);
  }

  t.rich = function rich(key, handlers) {
    const template = getNested(namespace, key);

    if (typeof template !== 'string') {
      return template;
    }

    const match = template.match(/^(.*?)<(\w+)>(.*?)<\/\2>(.*)$/s);

    if (!match) {
      return template;
    }

    const [, before, tag, inner, after] = match;
    const renderTag = handlers?.[tag];
    const rendered = renderTag ? renderTag(inner) : inner;

    return React.createElement(React.Fragment, null, before, rendered, after);
  };

  return t;
}

function useTranslations(namespace) {
  return createTranslator(namespace);
}

function useLocale() {
  return 'en';
}

function NextIntlClientProvider({ children }) {
  return children;
}

module.exports = {
  useTranslations,
  useLocale,
  NextIntlClientProvider,
  __createTranslator: createTranslator,
};
