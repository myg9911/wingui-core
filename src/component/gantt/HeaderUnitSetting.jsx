import React, { useEffect, useRef, useState } from "react";
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, IconButton, Tooltip } from "@mui/material";
import { transLangKey } from "../../lang/i18n-func";

function HeaderUnitSetting (props) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (props.value) {
      setSelected(props.value);
      props.change(props.value);
    }
  }, [props.value]);

  const handleUnitClick = (event, value) => {
    props.change(value);
    setSelected(value);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={transLangKey("FP_HEADER_UNIT")} placement='bottom' arrow>
        <IconButton ref={anchorRef}
                    sx={{ m: '2px 0', mr: '1rem', p: 4  }}
                    aria-controls={open ? 'headerUnitMenu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="menu"
                    onClick={handleToggle}
        >
          <Icon.Calendar />
        </IconButton>
      </Tooltip>
      <Popper
        sx={{ zIndex: 1000 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="headerUnitMenu" autoFocusItem>
                  {props.units.map(unit => (
                    <MenuItem
                      sx={{ px: 10 }}
                      key={unit}
                      selected={unit === selected}
                      onClick={(event) => handleUnitClick(event, unit)}
                    >
                      {unit}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default HeaderUnitSetting;
