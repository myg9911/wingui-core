import React from "react";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import { useStyles, useIconStyles } from "./CommonStyle";
import { transLangKey } from "../lang/i18n-func";
import { indigo, grey } from "@mui/material/colors";
import { getAppSettings } from "../utils/common";

let component = getAppSettings('component');

export function CommonButton(props) {
  let type = '';
  if (props.type !== undefined) {
    type = props.type
  } else {
    type = component.button
  }
  let btnClass = (type === 'icon') ? useIconStyles() : useStyles();
  const { title, ...otherProps } = props;
  return (
    <Tooltip title={props.title ?? ''} placement='bottom' arrow>
      {type === 'text' ?
        <Button props={{ ...props }} variant="outlined" className={btnClass.useIconStyles} style={props.style} onClick={props.onClick} >{props.title ?? props.children}</Button> :
        <IconButton className={btnClass.gridIconButton} {...otherProps} >{React.cloneElement(props.children, { size: 20 })}</IconButton>
      }
    </Tooltip>
  )
}

CommonButton.displayName = 'CommonButton';

export function SearchButton(props) {
  const classes = useStyles();
  return (
    <Avatar {...props} className={classes.viewPathIconButton} sx={{ bgcolor: props.disabled ? grey[200] : indigo[500] }} variant="square" >
      <IconButton title={transLangKey("SEARCH")}><Icon.Search stroke={props.disabled ? "#e2e2e1" : "#fff"} size={16} /></IconButton>
    </Avatar>
  )
}

SearchButton.displayName = 'SearchButton';

export function SaveButton(props) {
  const classes = useStyles();
  return (
    <Avatar {...props} className={classes.viewPathIconButton} sx={{ bgcolor: props.disabled ? grey[200] : indigo[500] }} variant="square" >
      <IconButton title={transLangKey("SAVE")}><Icon.Save stroke={props.disabled ? "#e2e2e1" : "#fff"} size={16} /></IconButton>
    </Avatar>
  )
}

SaveButton.displayName = 'SaveButton';

export function RefreshButton(props) {
  const classes = useStyles();
  return (
    <Avatar  {...props} className={classes.viewPathIconButton} sx={{ bgcolor: props.disabled ? grey[200] : "#fff" }} variant="square" ><IconButton title={transLangKey("REFRESH")}>
      <Icon.RefreshCcw stroke={props.disabled ? "#e2e2e1" : "#696969"} size={16} /></IconButton>
    </Avatar>
  )
}

RefreshButton.displayName = 'RefreshButton';

export function PersonalButton(props) {
  const classes = useStyles();
  return (
    <Avatar  {...props} className={classes.viewPathIconButton} sx={{ bgcolor: props.disabled ? grey[200] : "#fff" }} variant="square" ><IconButton title={transLangKey("PSNZ")}>
      <Icon.Columns stroke={props.disabled ? "#e2e2e1" : "#696969"} size={16} /></IconButton>
    </Avatar>
  )
}

PersonalButton.displayName = 'PersonalButton';
