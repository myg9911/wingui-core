import React, { useState, useEffect } from "react";
import { useContentStore } from '../store/contentStore'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ClickAwayListener from '@mui/base/ClickAwayListener';

const styles = {
  position: 'absolute',
  top: 23,
  with: '300px',
  right: 0,
  zIndex: 9999999,
  p: 1,
};

export default function PaeSetup(props) {
  const [menuLayout, setMenuLayout, menuType, setMenuType] = useContentStore(state => [state.menuLayout, state.setMenuLayout, state.menuType, state.setMenuType])
  const [open, setOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setOpen((previousOpen) => !previousOpen);
  };
  
  useEffect(() => {
    $('[class *="component_ui"]').resize()
  }, [menuType])
  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton aria-label="pageSetup" sx={{ p: 0 }} onClick={handleClick}>
          <MoreVertOutlinedIcon />
        </IconButton>
        {open ? (
          <Box sx={styles} >
            <Paper sx={{ m: 1, p: 1 }}>
              <Box sx={{ display: 'block', width: '100%' }}>
                <Typography sx={{ p: 2 }}>Menu Type</Typography>
                <Box sx={{ display: 'inline-flex', justifyContent: 'flex-end' }}>
                  <FormControlLabel
                    sx={{ display: 'inline', ml: 11 }}
                    control={
                      <Switch
                        checked={menuType == 'defaultMenu' ? true : false}
                        onChange={() => setMenuType(menuType == 'defaultMenu' ? 'topMenu' : 'defaultMenu')}
                        name="menuTypeDefault"
                        color="primary"
                      />
                    }
                    label="Default"
                  />
                  <FormControlLabel
                    sx={{ display: 'inline', ml: 11 }}
                    control={
                      <Switch
                        checked={menuType == 'topMenu' ? true : false}
                        onChange={() => setMenuType(menuType == 'defaultMenu' ? 'topMenu' : 'defaultMenu')}
                        name="menuTypeTop"
                        color="primary"
                      />
                    }
                    label="Top"
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : null}

      </Box>
    </ClickAwayListener>
  );
}

PaeSetup.displayName = 'PaeSetup'
