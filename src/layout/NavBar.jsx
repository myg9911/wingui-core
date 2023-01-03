import React, { useState, useEffect } from "react";
import { useContentStore, useMenuStore } from '../store/contentStore'
import { Link } from 'react-router-dom';
import { transLangKey } from '../lang/i18n-func';
import { getPopupOption, isPopupWnd, showMessage } from '../utils/common';
import menu from '../service/Menu';
import { uiSettings } from "@wingui/common/uiSettings";
import settings from "@zionex/wingui-core/src/common/settings";
import { useUserStore } from "../store/userStore";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import languageData from '../lang/languageData';
import { useStyles } from "../common/imports";
import PageSetup from "../component/PageSetup";
import TopBar from "./TopBar";
import baseURI from "../utils/baseURI";

function NavBar() {
  const activeViewId = useContentStore(state => state.activeViewId)
  const menus = useMenuStore(state => state.menus)
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [displayName, doLogout] = useUserStore(state => [state.displayName, state.doLogout])
  const [menuType, menuCollapse, setMenuCollapse, languageCode] = useContentStore(state => [state.menuType, state.menuCollapse, state.setMenuCollapse, state.languageCode])
  const [navbarVisible] = useContentStore(state => [state.navbarVisible])
  const [langData, setLangData] = useState([]);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const classes = useStyles();

  let breadCrumbsArray = [];
  let appBarHidden = false;
  if ((isPopupWnd() && getPopupOption().showNavBar === false) || navbarVisible == false) {
    appBarHidden = true;
  }
  useEffect(() => {
    const langs = [];//['ko','en','jp','cn'];

    if (settings.languages) {
      var languages = settings.languages;
      for (var i = 0; i < languages.length; i++) {
        var lang = languages[i];
        langs.push(lang.substring(0, 2));
      }
      if (isDeepEqual(langs, langData) == false) {
        setLangData(langs)
      }
    }
  }, [settings.languages])
  useEffect(() => {
    $('[class *="component_ui"]').resize()
  }, [menuCollapse])
  useEffect(() => {
    // menu.deactivate();

    breadCrumbsArray = [];
    if (Object.keys(menu.navigateObject).indexOf(activeViewId) !== -1) {
      menu.navigateObject[activeViewId].map((m, inx) => {
        // menu.activate(m, inx, activeViewId)
        breadCrumbsArray.push(<li className="breadcrumb-item" key={m}><span>{transLangKey(m)}</span></li>);
      });
      if (JSON.stringify(breadCrumbsArray) !== JSON.stringify(breadCrumbs)) {
        setBreadCrumbs(breadCrumbsArray);
      }
    } else {
      if (JSON.stringify(breadCrumbsArray) !== JSON.stringify(breadCrumbs)) {
        setBreadCrumbs(breadCrumbsArray);
      }
    }
    feather.replace();
  }, [activeViewId]);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleLangMenu = (e) => {
    setAnchorElLang(null);
    const { langvalue } = e.currentTarget.dataset;
    lo.resetLang(langvalue);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  function showLogoutDialog(e) {
    e.preventDefault();
    showMessage(transLangKey('CONFIRMATION'), transLangKey("MSG_LOGOUT"), { close: false }, function (answer) {
      if (answer) {
        doLogout();
      }
    })
  }
  function goHome() {
    let home = ''
    if (settings.authentication != undefined) {
      let defaultUrl = settings.authentication.defaultUrl;
      if (defaultUrl.includes('home')) {
        home = '/home'
      } else {
        home = '/' + defaultUrl.replace(baseURI(), '')
      }
    }
    return home;
  }
  const toggleMenu = () => {
    setMenuCollapse(!menuCollapse);
  };
  function showBrandIcon() {
    if (menuType === 'topMenu' || uiSettings.useFloatMenuBar === 'Y') {
      return (
        <>
          <Link to={goHome}>
            <img alt="Home" src={baseURI() + "images/common/logo-white.png"} />
          </Link>
          <div style={{ width: "1px", height: '28px', backgroundColor: '#d7dadd', marginLeft: '12px', marginRight: '12px' }}></div>
        </>
      )
    }
  }
  function showSideBarMenuCollapseIcon() {
    if (menuType !== 'topMenu' && uiSettings.useFloatMenuBar !== 'Y') {
      return (<Box sx={{ flexGrow: 0, p: 2 }}>
        <IconButton size="small" aria-label="menu" style={{ margin: "0", padding: "0" }} onClick={toggleMenu} >
          <MenuIcon />
        </IconButton>
      </Box>)
    }
  }
  function showLanguageButton() {
    // if (uiSettings.showLanguageButton === 'Y') {
    return (<Box sx={{ flexGrow: 0 }}>
      <IconButton style={{ backgroundColor: 'transparent' }} className={classes.AppBarlanguageButton} onClick={handleOpenLangMenu} sx={{ m: 1 }}>
        <Typography textAlign="center">{languageCode + ' - ' + languageData[languageCode].name}</Typography>
      </IconButton>
      <Menu sx={{ mt: '25px' }} id="menu-language" anchorEl={anchorElLang} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorElLang)} onClose={handleCloseLangMenu}>
        {
          langData.map((lang) => (
            <MenuItem key={lang} data-langvalue={lang} onClick={handleLangMenu}>
              <Typography textAlign="center">{lang + ' - ' + languageData[lang].name}</Typography>
            </MenuItem>
          ))}
      </Menu>
    </Box>)
    // }
  }
  function showMenuTypeButton() {
    // if(settings.useFloatMenuBar !== 'Y') {
    return (<Box sx={{ flexGrow: 0 }}>
      <PageSetup placement={'bottom'} />
    </Box>)
  }
  // }
  return (
    <>
      <AppBar data-zlayout='navBar' position="static" hidden={appBarHidden} style={{ borderBottom: '1px solid lightgray', boxShadow: 'none' }}>
        <Toolbar variant="dense" sx={{ backgroundColor: 'white', minHeight: '38px' }} elevation={0}>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
            {showBrandIcon()}
            {showSideBarMenuCollapseIcon()}
          </Box>
          {showLanguageButton()}
          <Box sx={{ flexGrow: 0 }} style={{ paddingRight: 30 }} >
            <Button style={{ border: 0, color: '#000000' }} onClick={handleOpenUserMenu} startIcon={<AccountCircleIcon></AccountCircleIcon>}>
              <Typography textAlign="center">{displayName}</Typography>
            </Button>
            <Menu sx={{ mt: '25px' }} id="menu-user" anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={transLangKey("UI_AD_00")} onClick={handleCloseUserMenu}>
                <Link to="/system/profile" replace>
                  <Typography textAlign="center">{transLangKey("UI_AD_00")}</Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"Log out"} onClick={showLogoutDialog}>
                <Typography textAlign="center">Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
          {showMenuTypeButton()}
        </Toolbar>
        {appBarHidden === false && (<TopBar menus={menus} />)}
      </AppBar>
    </>
  )
}

export default NavBar