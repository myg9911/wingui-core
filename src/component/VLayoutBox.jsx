
import React from "react";
import { Box } from '@mui/material';
import {  makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    block: {display: 'block',flexDirection: 'column', flexWrap:'wrap',padding: 0, margin: 0,  width: '100%'},
    flex: {display: 'flex',flexDirection: 'column', flexWrap:'wrap',padding: 0, margin: 0,  width: '100%'},
    noWrapFlex: {display: 'flex',flexDirection: 'column', padding: 0, margin: 0,  width: '100%',overflow: 'hidden', flexWrap: 'nowrap'},
});


export function VLayoutBox(props) { 
    const classes = useStyles();
    const { sx, style, type, className,...other } = props;

    const getClassProp=()=> {
        if(className)
            return {className:className};
        else
           return { className : type ? classes[type] : classes.noWrapFlex}
    }
    
    return (
        <Box data-zlayout='VLayoutBox' {...getClassProp()} sx={sx} style={style} {...other} >
            {props.children}
        </Box>
    )
}