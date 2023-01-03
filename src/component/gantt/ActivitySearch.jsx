import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import './activitysearch.css';
import { Box, ClickAwayListener, Fade, Paper, Popper, TextField, Typography, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "../CommonStyle";
import { transLangKey } from '../../lang/i18n-func';

const styles = {
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    width: '340px',
    borderRadius: '40px',
    border: '1px solid #ced4da',
    '&:hover .MuiSvgIcon-root': { display: 'inline-block' }
  },
  text: {
    flex: 1,
    textAlign: 'left',
    color: '#8996a3',
    marginLeft: '0.6rem'
  },
  closeIcon: {
    display: 'none',
    mr: '0.6rem',
    cursor: 'pointer'
  },
  inputBox: {
    width: '340px',
    p: 7,
    '& div:first-of-type': {
      pb: 5,
      px: 5
    },
    '& > :last-child': {
      textAlign: 'right',
      pr: 5
    }
  }
}

function ActivitySearch(props, ref) {
  const classes = useStyles();
  const [orderItemSearchMsg, setOrderItemSearchMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { control, getValues, setValue, reset } = useForm({
    defaultValues: {
      order: '',
      item: ''
    }
  });
  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'activity-search-popper' : undefined;

  useImperativeHandle(ref, () => ({
    refresh: () => refreshSearch(),
    setValues: (value) => {
      setValue('order', value.order);
      setValue('item', value.item);
      const searchMsg = (value.order || value.item) ? `${value.order} / ${value.item}` : '';
      setOrderItemSearchMsg(searchMsg);
    }
  }));
  
  useEffect(() => {
    const box = document.getElementById('activitySearchBox');
    if (open) {
      box.classList.add('focused');
    } else {
      box.classList.remove('focused');
    }
  }, [open]);

  function searchActivity() {
    const order = getValues('order'), item = getValues('item');
    props.search({ order, item });
    setOrderItemSearchMsg(`${order} / ${item}`);
    setOpen(!open);
  }

  function refreshSearch(e) {
    if (e) e.stopPropagation();
    props.search({ order: '', item: '' });
    reset();
    setOrderItemSearchMsg('');
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      searchActivity();
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  
  const searchBox = (label, name) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
      <Typography variant="caption" sx={{ mr: 12, mb: 1 }}>{transLangKey(label)}</Typography>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value} }) => (
          <TextField
            sx={{ flex: 1 }}
            variant="standard"
            value={value}
            onChange={onChange}
            onKeyPress={handleKeyPress}
          />
        )}
      />
    </Box>
  );

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ my: 'auto' }}>
          <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper sx={styles.inputBox}>
                  <Box>
                    {searchBox('FP_ORDER', 'order')}
                    {searchBox('PRODUCT', 'item')}
                  </Box>
                  <Box>
                    <Button variant="contained" sx={classes.primaryButton} onClick={searchActivity}>{transLangKey("SEARCH")}</Button>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Box id="activitySearchBox" sx={{...styles.searchBox, ...props.style}} onClick={handleClick}>
            <Icon.Search color="#8996a3" style={{ marginLeft: '0.6rem' }} />
            <Box sx={styles.text}>
              {orderItemSearchMsg ? orderItemSearchMsg : transLangKey("FP_ACTIVITY_SEARCH")}
            </Box>
            <CloseIcon fontSize="small" sx={styles.closeIcon} onClick={refreshSearch} />
          </Box>
        </Box>        
      </ClickAwayListener>
    </>
  )
}

ActivitySearch = forwardRef(ActivitySearch);
export default ActivitySearch;
