import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import 'intl-pluralrules';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import tr from '../locales/tr.json';
import zh from '../locales/zh.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import uk from '../locales/uk.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  tr: { translation: tr },
  zh: { translation: zh },
  pt: { translation: pt },
  ru: { translation: ru },
  uk: { translation: uk },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
