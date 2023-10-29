import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationUS from './translations/us.json';
import translationSK from './translations/sk.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationUS,
      },
      sk: {
        translation: translationSK,
      },
    },
    lng: 'sk',
    fallbackLng: 'en',
  });

export default i18n;
