import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Checkbox, Link, Grid, Breadcrumbs, Stack, Divider, IconButton, Avatar, Box } from '@mui/material';
import { useStyles } from "../component/CommonStyle";
import { useContentStore, useMenuStore } from "../store/contentStore";
import { PersonalButton, RefreshButton, SaveButton, SearchButton } from "../component/CommonButton";
import { useHistory, useLocation } from "react-router-dom";
import { grey, indigo } from "@mui/material/colors";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useViewStore } from "../store/viewStore";

export function ViewPath(props) {
  let history = useHistory();
  let location = useLocation();

  const [searchAreaExpanded, setSearchAreaExpanded, activeViewId] = useContentStore(state => [state.searchAreaExpanded, state.setSearchAreaExpanded, state.activeViewId]);
  const [addBookMark, deleteBookMark, isBookMarked] = useMenuStore(state => [state.addBookMark, state.deleteBookMark, state.isBookMarked])
  const [getViewIsUpdated] = useViewStore(state => [state.getViewIsUpdated])
  const [expandButton, setExpandButton] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    if (searchAreaExpanded == false) {
      setSearchAreaExpanded(true);
    };

    if (props.expandButton != undefined) {
      setExpandButton(props.expandButton)
    } else if (expandButton == false) {
      setExpandButton(true);
    }
  }, [])
  useEffect(() => {
    let exceptExpandButtonUIs = ['/system/profile', '/home']
    if (exceptExpandButtonUIs.includes(location.pathname)) {
      setExpandButton(false);
    } else {
      setExpandButton(true);
    }
  }, [location])

  function getButtonProp(name, type) {
    let returnValue;
    props.buttons.forEach(p => {
      if (p.name === name) {
        if (type === "action") {
          returnValue = p.action()
        } else {
          returnValue = p[type]
        }
      }
    })
    return returnValue
  }
  function existButtons() {
    return props.buttons.length > 0
  }

  const changeFavorite = (evt) => {
    if (evt.target.checked) {
      addBookMark(activeViewId);
    }
    else {
      deleteBookMark(activeViewId)
    }
  };
  const onSubmit = () => {
    if (getButtonProp('search', 'disable')) {
      return
    }
    if (getViewIsUpdated(vom.active)) {
      let msg = "변경된 데이타가 있습니다. 저장하지 않고 진행하시겠습니까?"
      showMessage(transLangKey('WARNING'), msg, function (answer) {
        if (answer) {
          getButtonProp('search', 'action')
        }
      });
    }
    else {
      getButtonProp('search', 'action')
    }
  }
  return (
    <Box className={classes.viewPath} >
      <Grid container direction="row" alignItems="center">
        <Grid item xs={6} >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Checkbox icon={<Icon.Star size={18} stroke="#404040" />} checkedIcon={<Icon.Star size={18} fill="#f1cc68" stroke="#f1cc68" />} checked={isBookMarked(activeViewId)} onChange={changeFavorite} />
            <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" onClick={() => { history.push('/home') }}>
              <Icon.Home size={18} stroke="#404040" />
            </Link>
            {props.breadCrumbs}
          </Breadcrumbs>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
            <SearchButton onClick={onSubmit} style={{ 'display': (getButtonProp('search', 'visible') ? "" : "none") }} disabled={getButtonProp('search', 'disable')} />
            <SaveButton type="icon" onClick={() => getButtonProp('save', 'action')} style={{ 'display': (getButtonProp('save', 'visible') ? "" : "none") }} disabled={getButtonProp('save', 'disable')}></SaveButton>
            <Divider orientation="vertical" style={{ height: "20px", width: "1px", backgroundColor: 'black', display: existButtons() ? "" : "none" }} />
            <RefreshButton onClick={() => getButtonProp('refresh', 'action')} style={{ 'display': (getButtonProp('refresh', 'visible') ? "" : "none") }} disabled={getButtonProp('refresh', 'disable')} />
            <PersonalButton onClick={() => getButtonProp('personalization', 'action')} style={{ 'display': (getButtonProp('personalization', 'visible') ? "" : "none") }} disabled={getButtonProp('personalization', 'disable')} />
            {expandButton && (
              <Avatar onClick={() => setSearchAreaExpanded(!searchAreaExpanded)} {...props} className={classes.viewPathIconButton} sx={{ bgcolor: props.disabled ? grey[200] : indigo[500] }} variant="square" >
                {searchAreaExpanded ?
                  <IconButton style={{ color: '#ffffff' }} title={transLangKey("CLOSE_SEARCH_CONDITION")}><FilterListOffIcon /></IconButton> :
                  <IconButton style={{ color: '#ffffff' }} title={transLangKey("OPEN_SEARCH_CONDITION")}><FilterListIcon /></IconButton>
                }
              </Avatar>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

ViewPath.propTypes = {
  newhandler: PropTypes.func,
  savehandler: PropTypes.func,
  deletehandler: PropTypes.func,
  printhandler: PropTypes.func,
  exceldownhandler: PropTypes.func,
  refreshhandler: PropTypes.func,
  settingBtn: PropTypes.object,
  grids: PropTypes.array,  //엑셀로 다운로드할 grid 목록, 이값이 설정되면 printhandler 무시
  exceloptions: PropTypes.object
};

ViewPath.displayName = 'ViewPath'