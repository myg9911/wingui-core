import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { FormControl, MenuItem, Select, Autocomplete, TextField, Chip, Box, Checkbox, RadioGroup, Radio, ListItemIcon, ListItemText, FormControlLabel, InputLabel, InputAdornment, FilledInput, Tooltip, IconButton, FormGroup, FormLabel } from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TimePicker } from "@mui/lab";
import { Cancel } from "@mui/icons-material";
import { ko, enGB, ja, zhCN } from "date-fns/locale";
import { useContentStore } from '../store/contentStore'
import PropTypes from 'prop-types';
import { useInputStyles } from "./CommonStyle";
import { getAppSettings } from "../utils/common";
import { ZDateTimePicker } from "./ZDateTimePicker";
import { ZDateTimeRange } from "./ZDateTimeRange";
import { ZEditor } from './ZEditor'

const localeMap = {
  en: enGB,
  ko: ko,
  ja: ja,
  zh: zhCN,
};

export function InputField(props) {
  const [inputValue, setInputValue] = React.useState('');

  const languageCode = useContentStore(state => state.languageCode);
  const classes = useInputStyles()
  const getViews = (dateformat) => {
    let dateformatLowwer = dateformat.toLowerCase();
    let views = [];
    if (dateformatLowwer.indexOf("yyyy") > -1) {
      views.push("year")
    }
    if (dateformatLowwer.indexOf("mm") > -1) {
      views.push("month")
    }
    if (dateformatLowwer.indexOf("dd") > -1) {
      views.push("day")
    }
    if (dateformatLowwer.indexOf("hh") > -1) {
      views.push("hours")
    }
    if (dateformatLowwer.indexOf(":mm") > -1) {
      views.push("minutes")
    }
    if (dateformatLowwer.indexOf("ss") > -1) {
      views.push("seconds")
    }
    return views;
  };


  let datetimeSettings = getAppSettings('component').datetime
  if (datetimeSettings.weekStartsOn !== undefined) {
    localeMap[languageCode].options.weekStartsOn = datetimeSettings.weekStartsOn
  }

  function setInputField() {
    switch (props.type) {
      case 'autocomplete':
        return (
          <Controller name={props.name} control={props.control} defaultValue={props.defaultValue || props.value} rules={props.rules} render={({ field: { onChange, value } }) => (
            <Autocomplete
              autoHighlight
              name={props.name}
              control={props.control}
              onChange={(event, newValue) => {
                onChange(newValue ? newValue.value : '')
              }}
              value={(props.options && value) ? props.options.find((v) => v.value === value) : ''}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={props.options}
              getOptionLabel={(option) => `${option.label ? transLangKey(option.label) : ''}`}
              renderInput={(params) => <TextField {...params} label={props.label} />}
              readOnly={props.readonly ? props.readonly : false}
            >
            </Autocomplete>
          )}
          />
        )
      case 'select':
        return (
          <Controller
            rules={props.rules}
            render={({ field: { onChange, value } }) => (
              <FormControl className={`${classes.root} ${classes.select}`} variant="filled" size="small" fullWidth disabled={props.disabled ? props.disabled : false} >
                <InputLabel>{props.label}</InputLabel>
                <Select
                  // className={classes.select}
                  displayEmpty
                  onChange={onChange}
                  value={(value && props.options.findIndex(option => option.value === value) !== -1) ? value : ''}
                  label={props.label}
                  defaultValue={''}
                  disableUnderline
                  readOnly={props.readonly ? props.readonly : false}
                  style={props.style}
                  renderValue={props.renderValue}
                >
                  {props.options.length > 0 && (props.options).map((option) => {
                    return (
                      <MenuItem key={option.value} value={option.value} >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
            control={props.control}
            name={props.name}
          />
        )
      case 'multiSelect':
        const isChecked = (value, name) => {
          value = value ? value : [];
          return value.indexOf(name) > -1
        }
        const handleToggle = (onChange, value, name) => {
          value = value ? value : [];
          if (isChecked(value, name)) {
            onChange(value.filter(i => i !== name));
          } else {
            onChange([...value, name])
          }
        }
        const handleAllToggle = () => {
          document.getElementById('check-all').click();
        }

        return (

          <Controller rules={props.rules} render={({ field: { onChange, value } }) => (
            <FormControl
              variant="filled"
              size={"small"}
              fullWidth
              disabled={props.disabled ? props.disabled : false}
              className={classes.select}
            >
              <InputLabel>{props.label}</InputLabel>
              <Select displayEmpty multiple disableUnderline
                readOnly={props.readonly ? props.readonly : false}
                value={value ? value : []}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "center"
                  },
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selected.map((val) => (
                      <Chip
                        clickable
                        size="small"
                        key={'chip-' + val}
                        label={props.options[props.options.findIndex(v => v.value === val)].label}
                        onDelete={(e) => onChange(value.filter((v) => v !== val))}
                        deleteIcon={
                          <Cancel onMouseDown={(event) => event.stopPropagation()} />
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="ALL">
                  <ListItemIcon>
                    <Checkbox
                      id="check-all"
                      checked={value && value.length > 0 && value.length === props.options.length}
                      indeterminate={value && value.length > 0 && value.length === props.options.length}
                      onChange={(event, checked) => {
                        if (checked) {
                          $.map(props.options, function (option) {
                            if (typeof value === 'undefined') {
                              value = [];
                            }
                            if (value && !value.includes(option.value)) {
                              if (option.value !== '') {
                                value.push(option.value);
                              }
                            }
                          });
                        } else {
                          value.splice(0);
                        }
                        onChange(value);
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    onClick={(e) => handleAllToggle()}
                    primary={transLangKey("ALL")}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                    }}
                  />
                </MenuItem>
                {(props.options).map((option, index) => {
                  return (
                    <MenuItem key={option.value} value={option.value} onClick={(e) => handleToggle(onChange, value, option.value)}>
                      <ListItemIcon>
                        <Checkbox
                          key={'check-' + option.value}
                          label={option.value}
                          /* checked={isChecked(option.value)} */
                          checked={value && value.indexOf(option.value) > -1}
                          onChange={(event, checked) => {
                            if (checked) {
                              onChange([...value, option.value]);
                            } else {
                              onChange(value.filter((value) => value !== option.value));
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
            control={props.control}
            name={props.name}
          />
        )
      case 'check':
        return (
          <Controller name={props.name} rules={props.rules} readOnly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled : false}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => {
              return (
                <FormControl className={classes.expandableRoot}
                  style={props.inputStyle}
                  component="fieldset"
                  variant="filled"
                  size={"small"}
                  error={!!error}
                  fullWidth
                  disabled={props.disabled ? props.disabled : false}>
                  <FormLabel sx={{ marginLeft: '10px', visibility: !props.label ? 'hidden' : 'visible' }} id='CheckboxGroup'>
                    {props.label ? props.label : 'HIDDEN'}
                  </FormLabel>
                  <FormGroup aria-labelledby="CheckboxGroup" row={true}>
                    {
                      props.options.map((option, index) => {
                        return (
                          <FormControlLabel key={option.value} label={option.label}
                            control={
                              <Checkbox
                                readOnly={props.readonly ? props.readonly : false}
                                disabled={props.disabled ? props.disabled : false}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                checked={value && value.includes(option.value) ? true : false}
                                inputProps={{ readOnly: props.readonly ? props.readonly : false }}
                                value={option.value}
                                onChange={(event, checked) => {
                                  if (event.target.readOnly) {
                                    return false;
                                  } else {
                                    if (checked) {
                                      onChange([...(value || []), event.target.value]);
                                    } else {
                                      if (value)
                                        onChange(value.filter((val) => val !== event.target.value));
                                    }
                                  }
                                }}
                              />
                            }
                          />
                        ) //return
                      }
                      )
                    }
                  </FormGroup>
                </FormControl>
              )
            }}
          />
        )
      case 'radio':
        return (
          <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
              <FormControl
                component="fieldset"
                error={error}
                disabled={props.disabled ? props.disabled : false}
              >
                <RadioGroup
                  value={value || ''}
                  onChange={onChange}
                  style={{ display: 'flex', flexDirection: 'row' }}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                    },
                  }}>
                  {(props.options).map((option, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        value={option.value}
                        label={option.label}
                        control={<Radio />}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            )}
          />
        )
      case 'datetime':
        return (
          <Controller
            name={props.name}
            defaultValue={props.defaultValue || props.value}
            control={props.control}
            render={({ field: { onChange, value, ...params } }) => (
              <ZDateTimePicker {...params} {...props} variant="filled" value={value} onChange={onChange} locale={localeMap[languageCode]} />
            )}
          />
        )
      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[languageCode]}  >
            <Controller
              name={props.name}
              control={props.control}
              render={({ field: { onChange, value, params } }) => (
                <TimePicker
                  mask={props.dateformat ? "____-__-__" : "____-__-__ __:__"}
                  label={props.label}
                  inputFormat={props.dateformat ? props.dateformat : "HH:mm"}
                  InputProps={{ disableUnderline: true }}
                  onChange={onChange}
                  value={value}
                  minTime={props.min && props.min}
                  maxTime={props.max && props.max}
                  readOnly={props.readonly ? props.readonly : false}
                  disabled={props.disabled ? props.disabled : false}
                  renderInput={(params) => <TextField {...params} size="small" className={`${classes.root} ${classes.datetime}`} style={props.style} variant="filled" />}
                />
              )}
            />
          </LocalizationProvider>
        )
      case 'dateRange':
        return (
          <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue || props.value}
            render={({ field: { onChange, value, ...params } }) => (
              <ZDateTimeRange {...params} {...props} variant="filled" value={value} onChange={onChange} locale={localeMap[languageCode]} />
            )}
          />
        )
      case 'editor':

        return (
          <Controller
            name={props.name}
            defaultValue={props.defaultValue || props.value}
            control={props.control}
            render={({ field: { onChange, value, ...params } }) => (
              <ZEditor {...params} {...props} {...labelProps} value={value} onChange={onChange} locale={languageCode} />
            )}
          />
        )
      case 'textarea':
        return (
          <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={({
              field: { onChange, value },
              fieldState: { error },
              formState,
            }) => (
              <TextareaAutosize
                maxRows={props.maxRows || 2}
                minRows={props.minRows || 2}
                style={props.style}
                disabled={props.disabled ? props.disabled : false}
                onChange={onChange}
                defaultValue={value}
                onKeyPress={props.onKeyPress}
              />
            )}
          />
        )
      case 'action':
        return (
          <Controller name={props.name} control={props.control} rules={props.rules}
            render={({
              field: { onChange, value },
              fieldState: { error },
              formState,
            }) => (
              <FormControl className={classes.root} style={props.style} variant="filled" size={"small"} >
                <InputLabel htmlFor={props.label}>{props.label}</InputLabel>
                <FilledInput
                  id={props.name}
                  type="text"
                  className={`${classes.action}`}
                  value={value || ''}
                  onChange={onChange}
                  disableUnderline={true}
                  disabled={props.disabled ? props.disabled : false}
                  readOnly={props.readonly ? props.readonly : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={props.title ?? transLangKey('SEARCH')} placement='bottom' arrow>
                        <IconButton disabled={props.disabled ? props.disabled : false} onClick={props.onClick}>
                          {props.children}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )
            }
          />
        )
      default:
        let rules = props.rules;
        if (!rules && props.dataType === "number" && (props.min !== undefined || props.max !== undefined)) {
          rules = {}
          if (props.min !== undefined) {
            rules.minLength = { value: props.min, message: transLangKey('MSG_CHECK_VALID_004', { headerText: '', valid: props.min }) }
          } else if (props.max !== undefined) {
            rules.maxLength = { value: props.max, message: transLangKey('MSG_CHECK_VALID_003', { headerText: '', valid: props.max }) }
          }
        }
        return (
          <Controller name={props.name} control={props.control} rules={rules}
            render={({
              field: { onChange, value },
              fieldState: { error },
              formState,
            }) => (
              <TextField variant="filled" size={"small"} className={`${classes.root} ${classes.textfield}`} fullWidth hiddenLabel={true} label={props.label} value={value || ''} id={props.name}
                inputProps={{
                  readOnly: props.readonly ? props.readonly : false,
                  inputMode: props.dataType === "number" ? 'numeric' : '',
                  pattern: props.dataType === "number" ? '[0-9]*' : '',
                  min: props.dataType === "number" && props.min !== undefined ? props.min : null,
                  max: props.dataType === "number" && props.max !== undefined ? props.max : null
                }}
                type={props.dataType ? props.dataType : 'text'}
                style={props.style}
                InputProps={{ disableUnderline: true }}
                disabled={props.disabled ? props.disabled : false}
                error={!!error || (props.dataType === "number" && props.min > value || props.max < value)}
                onChange={onChange}
                onKeyPress={props.onKeyPress}
              >{props.children}</TextField>
            )}
          />
        )
    }
  }

  return (
    <>
      {
        <Box className={classes.div} style={props.style}>
          {setInputField()}
          {props.button && (<div style={{ display: "inline-block", position: "absolute" }}>{props.button}</div>)}
        </Box>
      }
    </>
  );
}

InputField.propTypes = {
  type: PropTypes.oneOf(['text', 'select', 'multiSelect', 'action', 'check', 'radio', 'datetime', 'time', 'dateRange', 'textarea', 'editor', 'autocomplete']),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  readonly: PropTypes.bool,
  disabled: PropTypes.bool,
  rules: PropTypes.object
};

export default InputField;
