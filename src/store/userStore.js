import create from 'zustand';
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import produce from 'immer';
import authentication from '../service/Authentication';
import settings from '../common/settings';

const log = config => (set, get, api) => config(args => {
  console.log("  applying", args)
  set(args)
  console.log("  new state", get())
}, get, api)

const immer = config => (set, get, api) => config((partial, replace) => {
  const nextState = typeof partial === 'function'
    ? produce(partial)
    : partial
  return set(nextState, replace)
}, get, api)

let t3smartScmUserStore = (set, get, api) => ({
  username: '',
  displayName: '',
  uniqueValue: '',
  systemAdmin: false,
  setUserInfo: () => _getSessionInfo(set),
  doLogout: () => _doLogout(set),
})
t3smartScmUserStore = subscribeWithSelector(t3smartScmUserStore)

t3smartScmUserStore = immer(t3smartScmUserStore)
export const [useUserStore] = create(t3smartScmUserStore)

function _getSessionInfo(set) {
  $.ajax({
    url: baseURI() + 'session-info',
    headers: getHeaders(),
    async: false,
    dataType: 'json'
  }).done((data) => {
    if (data.username !== '' && data.username !== 'None') {
      set({ username: data.username, displayName: data.displayName, uniqueValue: data.uniqueValue, systemAdmin: data.systemAdmin })
      authentication.setUserInfo(data)
    } else {
      _doLogout(set)
    }
  }).fail((req, status, err) => {
    console.warn(`Failed to get session information: ${req.status} ${status} ${err}`);

    _reset(set)
    let loginUrl = settings.authentication.loginUrl;
    let start = loginUrl.indexOf('#');
    if (start === -1) {
      window.location.href = loginUrl;
    }
  });
};

function _doLogout(set) {
    if(com.active !== '') {
      vsm.get(com.active, "serviceManager").callService('/logout', 'get', {}).then(data => {
        _getSessionInfo(set);
      })
    }  else {
      authentication.evaluate();
    }
};

function _reset(set) {
  set({ username: '', displayName: '', uniqueValue: '' })
};