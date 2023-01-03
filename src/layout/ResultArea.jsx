import React from "react";
import { Box } from "@mui/material";
import Split from 'react-split'
import { useStyles } from "../common/imports";
import { useContentStore } from "../store/contentStore";

export function ResultArea(props) {
  const classes = useStyles();
  const activeViewId = useContentStore(state => state.activeViewId)

  function makeResultArea() {
    if (Array.isArray(props.children)) {
      return (
        <>
          <Split
            sizes={props.sizes}
            style={{
              marginTop: "3px",
              width: "100%",
              height: "100%",
              display: props.direction === 'vertical' || !props.direction ? 'block' : 'flex',
            }}
            gutterSize={7}
            gutterAlign="center"
            direction={props.direction ? props.direction : 'vertical'}
          >
            {props.children}
          </Split>
          {React.createElement("style", null,
            `
            .gutter {
                position: relative;
                background-color: #eee;
                background-repeat: no-repeat;
                background-position: 50%;
            }
            
            .gutter.gutter-horizontal {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
                cursor: col-resize;
            }
            
            .gutter.gutter-vertical {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
                cursor: row-resize;
            }
            `
          )}
        </>
      )
    } else {
      return (
        <>
          <Box className={`${classes.resultAreaBox} ${'resultArea-'+ activeViewId}`}>
            {props.children}
          </Box>
        </>
      )
    }
  }
  return (
    <>
      {makeResultArea()}
    </>
  )
}

ResultArea.displayName = 'ResultArea'
