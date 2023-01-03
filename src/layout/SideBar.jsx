import React, { useState } from "react";
import { transLangKey } from '../lang/i18n-func';
import { Link } from 'react-router-dom';
import menu from '../service/Menu';
import { Box, Collapse, List, ListItem, ListItemText, Paper } from "@mui/material";
import { makeStyles } from '@mui/styles';
import appTheme from "../common/AppTheme";
import { getPopupOption, isPopupWnd } from "../utils/common";
import { useContentStore } from "../store/contentStore";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import baseURI from "../utils/baseURI";

const useSidebarStyles = makeStyles((theme) => ({
  ...appTheme.SideBar
}));

const useNoScrollbar = makeStyles((theme) => ({
  'noScrollBar': {
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
      width: 0,
      height: 0
    }
  }
}));

function SideBar(props) {
  const [menuCollapse, menuType, activeViewId] = useContentStore(state => [state.menuCollapse, state.menuType, state.activeViewId])
  const [menuBarHidden, setMenuBarHidden] = useState(false);
  const [collapse, setCollapse] = useState({});
  const classes = useSidebarStyles();
  const scrollClasses = useNoScrollbar();

  let menusItems = props.menus;

  if (isPopupWnd() && getPopupOption().showSideBar === false) {
    if (menuBarHidden === false) {
      setMenuBarHidden(true)
    }
  } else {
    if (menuType != 'topMenu' && menuBarHidden != menuCollapse) {
      setMenuBarHidden(menuCollapse);
    }
  }

  if (menuType == 'topMenu' && menuBarHidden != true) {
    setMenuBarHidden(true);
  }

  const handleCollapse = id => {
    return () => {
      let val = { ...collapse }
      val[id] = !val[id]
      setCollapse(val);
    }
  };

  function createMenuTree() {
    if (menusItems && menusItems.items) {
      let menuElem = renderTree(menusItems, 0);
      return menuElem;
    }
  }
  function createIcon(iconName) {
    let iconNode = <></>
    if (Icon[iconName] !== undefined) {
      iconNode = React.createElement(Icon[iconName], { size: "18" })
    }
    return iconNode
  }
  const renderTree = (nodes, depth) => {
    let id = nodes.id;
    let label = transLangKey(id)
    let parent = Array.isArray(nodes.items) && nodes.items.length > 0 ? true : false;
    let root = id == '' ? true : false;
    let plvalue = depth * 6
    if (nodes.usable) {
      if (root == true) {
        return (
          <div>
            {
              nodes.items.map((child) => {
                {
                  return (
                    <List key={child.id} className={classes.root} component="div" disablePadding>
                      {renderTree(child, depth + 1)}
                    </List>
                  )
                }
              })
            }
          </div>
        )
      } else if (parent) {
        return (
          <div key={id}>
            <ListItem key={id} sx={{ pl: plvalue }} className={depth == 1 ? classes.root : classes.item} button onClick={handleCollapse(id)} >
              {menu.getType(nodes) == 'large' && nodes.icon ? createIcon(nodes.icon) : collapse[id] ? (<Icon.MinusSquare size={12} />) : (<Icon.PlusSquare size={12} />)}
              <ListItemText sx={{ ml: 4 }} primary={label} />
              {collapse[id] ? (<ExpandLessIcon />) : (<ExpandMoreIcon />)}
            </ListItem>
            <Collapse key={`'Collapse'+ ${id}`} in={collapse[id]} timeout={500} unmountOnExit >
              <List className={depth == 1 ? classes.root : classes.item} component="div" disablePadding>
                {
                  nodes.items.map((child) => {
                    return renderTree(child, depth + 1)
                  })
                }
              </List>
            </Collapse>
          </div>
        )
      } else {
        let display = (nodes.id === 'UI_AD_00') ? 'none' : ''
        return (
          <div key={id} style={{ display: display }}>
            <ListItem key={id} sx={{ pl: plvalue }} className={depth == 1 ? classes.root : (activeViewId == id ? classes.selectedItem : classes.item)} button
              component={Link} to={nodes.path.toLowerCase()}>
              <ListItemText sx={{ ml: 4 }} primary={label} className={classes.span} />
            </ListItem>
          </div>
        )
      }
    }
  };
  return (
    <Box component="div" sx={{ height: '100vh', width: { sm: 260 }, flexShrink: { sm: 0 }, background: '#284461' }}
      aria-label="Menu"
      hidden={menuBarHidden}
      data-zlayout='SideBar'
    >
      <Paper sx={{ m: 0, p: 0, height: '100%', background: '#222E3C' }}>
        <Box style={{ display: 'inline' }}>
          <Link className="sidebar-brand" to={menu.goHome}><img alt="Home" src={baseURI() + "images/common/logo-default.png"} /></Link>
        </Box>
        <Paper className={scrollClasses.noScrollBar} sx={{ m: 0, p: 0, color: '#ebe9e9', background: '#222E3C' }}
          style={{ height: '90%' }}>
          {createMenuTree()}
        </Paper>
      </Paper>
    </Box>
  )
}

export default SideBar
