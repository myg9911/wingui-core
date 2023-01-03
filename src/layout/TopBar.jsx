import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import menu from '../service/Menu';
import './TopBar.css';
import { createUniqueKey } from "../utils/common";
import { useContentStore } from "../store/contentStore";

function TopBar(props) {
  const [menuType] = useContentStore(state => [state.menuType])

  const [menuBarHidden, setMenuBarHidden] = useState(true);

  if (menuType == 'topMenu') {
    if (menuBarHidden != false)
      setMenuBarHidden(false);
  }
  else {
    if (menuBarHidden != true)
      setMenuBarHidden(true);
  }

  function makeMenuTree(menus) {
    let node =
      <ul id={menus.id + "-topTemplate"} className={menus.id === "" ? "sidebar-nav" : "dropdownMenu-list sidebar-dropdown list-unstyled collapse"} >
        {
          menus.items.map(i => {
            let display = i.id === 'UI_AD_00' ? 'none' : ''
            return <li key={createUniqueKey()} className="sidebar-item sub-menu" style={{ display: display }}>
              {
                i.items.length > 0 ?
                  <a data-toggle="collapse" className={menu.getType(i) === "medium" ? "sidebar-middle dropdown-sidebar-link sidebar-link collapsed top-link" : "sidebar-link collapsed"}>
                    <span className="align-middle">{transLangKey(i.id)}</span>
                    <span className={"sidebar-badge badge bg-danger " + i.id} ></span>
                  </a>
                  :
                  <NavLink key={createUniqueKey()} to={i.path.toLowerCase()} className="dropdown-sidebar-link sidebar-link top-link">
                    {transLangKey(i.id)}
                    <span className={"sidebar-badge badge bg-danger " + i.id}></span>
                  </NavLink>
              }
              {
                makeMenuTree(i)
              }
            </li>
          })
        }
      </ul>;
    if (menu.getType(menus) === "large") {
      node = React.cloneElement(node, { "data-parent": "#sidebar" });
    }
    return node;
  }

  function makeMenuTreeInit(menus) {
    if (!menus)
      return null;

    if (Object.keys(menus).length !== 0) {
      let node =
        <ul id={menus.id + "-topTemplate"} className="navbar-nav">{
          menus.items.map(i => {
            let display = i.id === 'UI_AD_00' ? 'none' : ''
            return <li key={createUniqueKey()} className="topMenuGroup-sidebar-item" style={{ display: display }}>{
              i.items.length > 0 ?
                <a className={menu.getType(i) === "medium" ? "sidebar-middle dropdown-sidebar-link sidebar-link collapsed" : "dropdown-sidebar-link sidebar-link collapsed"}>
                  <span className="align-middle font-weight-bold top-menu-title">{transLangKey(i.id)}</span>
                  <span className={"sidebar-badge badge bg-danger " + i.id} ></span>
                </a>
                :
                <NavLink key={createUniqueKey()} to={i.path} className="sidebar-link">
                  {transLangKey(i.id)}
                  <span className={"sidebar-badge badge bg-danger " + i.id}></span>
                </NavLink>
            }{
                makeMenuTree(i)
              }
            </li>
          })
        }
        </ul>
      if (menu.getType(menus) === "large") {
        node = React.cloneElement(node, { "data-parent": "#sidebar" })
      }
      return node;
    }
  }
  return (
    <div data-zlayout='TopBar' id="topMenu" className={"topmenu-bar"} hidden={menuBarHidden}>
      {makeMenuTreeInit(props.menus)}
    </div>
  )
}

export default TopBar
