import countryData from '../data/countryData';
import { initI18n } from './i18n-func';
import languageData from './languageData';
import { useContentStore } from '../store/contentStore'

class LanguageObject {
  constructor() {
    this.defaultCountries = {};
  }

  getLanguageCode() {
    return this.languageCode;
  }

  getCountryCode() {
    return this.countryCode;
  }

  getCurrencyCode() {
    return this.currencyCode;
  }

  getFontFamily() {
    if (window.settings.style && window.settings.style.fontFaces) {
      let fontFace = window.settings.style.fontFaces[this.languageCode];
      if (fontFace) {
        return fontFace.split(',')[0];
      }
    }
    return 'Noto Sans KR';
  }

  getFontSize() {
    if (window.settings.style && window.settings.style.fontFaces) {
      let fontFace = window.settings.style.fontFaces[this.languageCode];
      if (fontFace) {
        let fontStyles = fontFace.split(',');
        if (fontStyles.length > 1) {
          return parseInt(fontStyles[1]);
        }
      }
    }
    return 13;
  }

  init() {
    const storeState = useContentStore.getState();

    const setLanguageCode = storeState.setLanguageCode;
    const setCountryCode = storeState.setCountryCode;
    const setCurrencyCode = storeState.setCurrencyCode;

    let languageCode = localStorage.getItem('languageCode');
    let countryCode = localStorage.getItem('countryCode');

    for (let language in this.defaultCountries) {
      delete this.defaultCountries[language];
    }

    for (let i = 0, n = window.settings.languages.length; i < n; i++) {
      let language = window.settings.languages[i];
      this.defaultCountries[language.substr(0, 2)] = language.substr(3);
    }

    if (!languageCode || !countryCode) {
      let language;
      if (navigator.language) {
        language = navigator.language;
      } else if (navigator.browserLanguage) {
        language = navigator.browserLanguage;
      } else if (navigator.systemLanguage) {
        language = navigator.systemLanguage;
      } else if (navigator.userLanguage) {
        language = navigator.userLanguage;
      } else {
        language = 'en-US';
      }

      if (language.length == 2) {
        this.languageCode = language;

        let countryCode = this.defaultCountries[language];
        if (countryCode) {
          this.countryCode = countryCode;
        } else {
          this.countryCode = 'None';
          console.error(`Set the country code for the '${language}' language code in the application.yaml file.`);
        }
      } else {
        this.languageCode = language.substr(0, 2);
        this.countryCode = language.substr(3);
      }

      localStorage.setItem('languageCode', this.languageCode);
      localStorage.setItem('countryCode', this.countryCode);

      this.currencyCode = countryData[this.countryCode].currency;
      localStorage.setItem('currencyCode', this.currencyCode);
    } else {
      this.languageCode = languageCode;
      this.countryCode = countryCode;
      this.currencyCode = countryData[this.countryCode].currency;

      localStorage.setItem('currencyCode', this.currencyCode);
    }
    setLanguageCode(this.languageCode);
    setCountryCode(this.countryCode);
    setCurrencyCode(this.currencyCode);

    let langpack = localStorage.getItem('langpack');

    if (!langpack) {
      getLangpackData(this.languageCode);
    } else {
      initI18n(languageCode, JSON.parse(langpack))
    }
  }
  resetLang(lang) {
    var storeState = useContentStore.getState();

    const setLanguageCode = storeState.setLanguageCode;
    const setCountryCode = storeState.setCountryCode;
    const setCurrencyCode = storeState.setCurrencyCode;
    const setResetLangEvent = storeState.setResetLangEvent;

    this.languageCode = lang;
    setLanguageCode(this.languageCode);
    localStorage.setItem('languageCode', this.languageCode);
    getLangpackData(this.languageCode);
    this.setKendoLanguage(this.languageCode)

    let countryCode = this.defaultCountries[this.languageCode];
    if (countryCode) {
      this.countryCode = countryCode;
      this.currencyCode = countryData[this.countryCode].currency;

      localStorage.setItem('countryCode', this.countryCode);
      localStorage.setItem('currencyCode', this.currencyCode);

      setCountryCode(this.countryCode);
      setCurrencyCode(this.currencyCode)
    }
    window.location.reload();
  }

  toggleLocaleSelector() {
    this.langElement.classList.toggle('localeSelShow');
  }

  toggleCountrySelector() {
    if (this.countryElement) {
      this.countryElement.classList.toggle('countrySelShow');
    }
  }

  closeSelector() {
    if (this.langElement.classList.contains('localeSelShow')) {
      this.langElement.classList.remove('localeSelShow');
    }

    if (this.countryElement && this.countryElement.classList.contains('countrySelShow')) {
      this.countryElement.classList.remove('countrySelShow');
    }
  }

  setKendoLanguage(langCode = 'en') {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = 'js/kendo/js/cultures/kendo.culture.' + langCode + '.min.js';

    head.appendChild(script);
  }

}

const lo = new LanguageObject();

export default lo;
