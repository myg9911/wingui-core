import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, Button, Collapse } from "@mui/material";
import { useStyles } from "../component/CommonStyle";
import { useContentStore } from "../store/contentStore";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        fontSize: '13px',
        fontFamily: 'Noto Sans KR',
        fontWeight: '400',
        padding: '2px',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export function SearchArea(props) {
  const [searchAreaExpanded, activeViewId] = useContentStore(state => [state.searchAreaExpanded, state.activeViewId]);
  const [expandButton, setExpandButton] = useState(true);
  const [searchButton, setSearchButton] = useState(false);
  const classes = useStyles();
  
  useEffect(() => {
    if (props.expandButton != undefined) {
      setExpandButton(props.expandButton)
    } else if (expandButton == false) {
      setExpandButton(true);
    }

    if (props.searchButton != undefined) {
      setSearchButton(props.searchButton)
    } else {
      setSearchButton(false);
    }
  }, [])

  return (
    <div zlayout={"searchArea"}>
      <Collapse in={searchAreaExpanded} timeout={{ appear: 8, enter: 2, exit: 2 }} style={{ minHeight: "fit-content" }}>
        <Box id='searchArea' sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          border: "1px solid #dde1ee",
          backgroundColor: "white", //#f4f6fb
          padding: 0, margin: 0
        }}
        >
          <Item id='searchAreaItem' sx={{ gridRow: '1', gridColumn: 'span 2', padding: "0px 0px 0px 0px", margin: "0px 0px 0px 0px" }}>
            <Box id='searchAreaChildren' sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: "0px 0px 0px 0px", margin: "0px 0px 0px 0px", backgroundColor: "white", }}>
              {props.children}
            </Box>
          </Item>
          {searchButton && (
            <Item sx={{ gridRow: '1', gridColumn: '4 / 5', display: 'flex', flexGrow: 0, flexShrink: 0 }}>
              <Box sx={{ flexGrow: 0, flexShrink: 0, alignSelf: 'flex-end' }}>
                <Button onClick={props.submit} className={classes.searchAreaButton}>{transLangKey('SEARCH')}</Button>
              </Box>
            </Item>
          )
          }
        </Box>
      </Collapse>
    </div>
  )
}

SearchArea.propTypes = {
  submit: PropTypes.func,
  expandButton: PropTypes.bool,
  searchButton: PropTypes.bool,
};

SearchArea.displayName = 'SearchArea'
