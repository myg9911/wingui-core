import baseURI from '../utils/baseURI';
import {
  PERMISSION_TYPE_PREFIX
} from '../common/const';
import getHeaders from '../utils/getHeaders';
import authentication from './Authentication';

function Permission () {
  this.permissions = [];

  const remove = (viewId) => {
    let index = this.permissions.findIndex(element => element.menuCd === viewId);
    if(index !== -1) {
      this.permissions.splice(index, 1)
    }
  }

  const get = () => {
    this.permissions.map(function (permission) {
      if(permission.menuCd === vom.active) { 
        return permission;
      }
    });
  };

  const getPermissions = () => {
    return this.permissions;
  };

  const valueOf = (permissionType) => {
    if (this.permissions.length != 0) {
      let value;

      this.permissions.map(function (permission) {
        if(permission.menuCd === vom.active) {
          value = permission[permissionType];
        }
      })

      if (value === undefined) {
        return true;
      }
      return value;
    }
    return false;
  };

  const check = (componentId, eventType, viewId) => {
    let activeId = viewId === undefined ? vom.active : viewId; 
    if (!eventType) {
      return true;
    }

    let permissionType = vom.get(activeId).getActionPermissionType(componentId, eventType);
    if (!permissionType) {
      return true;
    }

    return getValue(PERMISSION_TYPE_PREFIX + permissionType);
  };

  const load = (viewId) => {
    let permission = null;

    if (viewId === 'home') {
      permission = {
        PERMISSION_TYPE_CREATE: true,
        PERMISSION_TYPE_READ: true,
        PERMISSION_TYPE_UPDATE: true,
        PERMISSION_TYPE_DELETE: true,
        PERMISSION_TYPE_IMPORT: true
      };

      this.permissions.push(permission);
      return;
    }
    let that = this
    $.ajax({
      url: baseURI() + 'system/users/' + authentication.getSessionInfo().username + '/permissions/' + viewId,
      headers: getHeaders(),
      async: false
    }).done(function (data) {

      if (data) {
        that.permissions.push(data);
      }
    }).fail(function (request, statusText, error) {
      console.error('Failed to load permission data.');
    });
  };

  return {
    get: get,
    remove: remove,
    valueOf: valueOf,
    check: check,
    load: load,
    getPermissions: getPermissions
  };
};

const permission = new Permission();

export default permission;
