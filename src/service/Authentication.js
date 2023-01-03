import baseURI from '../utils/baseURI';
import settings from '../common/settings';
import getHeaders from '../utils/getHeaders';

function Authentication () {
  this.username = '';
  this.displayName = '';
  this.uniqueValue = '';
  this.systemAdmin = false;

  const getUsernameFromJwtToken = () => {
    let token = localStorage.getItem('X-AUTH-TOKEN');
    if (token) {
      token = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
      token = window.atob(token);
      return JSON.parse(token).sub;
    }

    return '';
  };

  const checkSystemAdminFromJwtToken = () => {
    let token = localStorage.getItem('X-AUTH-TOKEN');
    if (token) {
      token = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
      token = window.atob(token);
      return JSON.parse(token).roles.includes('ADMIN');
    }

    return false;
  };

  const getUsername = () => {
    if (!this.username || this.username === '') {
      return getUsernameFromJwtToken();
    }
    return this.username;
  };

  const getDisplayName = () => {
    if (!this.displayName || this.displayName === '') {
      return getUsernameFromJwtToken();
    }
    return this.displayName;
  };

  const getUniqueValue = () => {
    if (!uniqueValue || uniqueValue === '') {
      return '';
    }
    return uniqueValue;
  };

  const isSystemAdmin = () => {
    if (!this.username || this.username === '') {
      return checkSystemAdminFromJwtToken();
    }
    return this.systemAdmin;
  };

  const getCountryCode = () => {
    return window.lo.getCountryCode();
  };

  const getCurrencyCode = () => {
    return window.lo.getCurrencyCode();
  };

  const reset = () => {
    this.username = '';
    this.displayName = '';
    this.uniqueValue = '';

    window.sessionStorage.clear();
  };

  const evaluate = () => {
    if (isLogin()) {
      let viewId;
      if (window.location.hash) {
        viewId = window.location.hash.slice(1);
      } else {
        viewId = localStorage.getItem('lastViewId');
        if (!viewId) {
          let defaultUrl = settings.authentication.defaultUrl;

          let start = defaultUrl.indexOf('#');
          if (start === -1) {
            console.warn('The view id is not set in the URL. (sample: http://localhost/t3series/index.html#home)');
          } else {
            viewId = defaultUrl.slice(start + 1);
          }
        }
      }
    } else {
      reset();

      let loginUrl = settings.authentication.loginUrl;

      let start = loginUrl.indexOf('#');
      if (start === -1) {
        window.location.href = loginUrl;
      }
    }
  };
  const setUserInfo = (data) => {
    this.username = data.username;
    this.displayName = data.displayName;
    this.uniqueValue = data.uniqueValue;
    this.systemAdmin = data.systemAdmin;
  }
  const isLogin = () => {
    let sessionInfo = getSessionInfo();
    if (!sessionInfo) {
      return false;
    }

    this.username = sessionInfo.username;
    this.displayName = sessionInfo.displayName;
    this.uniqueValue = sessionInfo.uniqueValue;
    this.systemAdmin = sessionInfo.systemAdmin;

    let countryCode = localStorage.getItem('countryCode');
    let currencyCode = localStorage.getItem('currencyCode');

    return this.username && this.username !== '' && this.username !== 'None';
  };

  const doLogout = () => {
    vsm.get(com.active, "serviceManager").callService('/logout', 'get', {}).then(data => {
      evaluate();
    });
  };

  const getSessionInfo = () => {
    let sessionInfo;

    $.ajax({
      url: baseURI() + 'session-info',
      headers: getHeaders(),
      async: false,
      dataType: 'json'
    }).done((data) => {
      sessionInfo = data;
    }).fail((req, status, err) => {
      console.warn(`Failed to get session information: ${req.status} ${status} ${err}`);
    });

    return sessionInfo;
  };

  return {
    getUsername: getUsername,
    getDisplayName: getDisplayName,
    getUniqueValue: getUniqueValue,
    isSystemAdmin: isSystemAdmin,
    getCountryCode: getCountryCode,
    getCurrencyCode: getCurrencyCode,
    evaluate: evaluate,
    doLogout: doLogout,
    getSessionInfo: getSessionInfo,
    setUserInfo: setUserInfo
  };
};

const authentication = new Authentication();

export default authentication;
