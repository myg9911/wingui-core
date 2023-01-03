
import React from "react";
import { Box } from '@mui/material';
import {  makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    block: {display: 'block',flexDirection: 'row', flexWrap:'wrap',padding: 0, margin: 0,  width: '100%'},
    flexT: {display: 'flex',flexDirection: 'row', flexWrap:'wrap',padding: 0, margin: 0,  width: '100%'},
    noWrapFlex: {display: 'flex',flexDirection: 'row', padding: 0, margin: 0,  width: '100%',overflow: 'hidden', flexWrap: 'nowrap'},
    grid: {display: 'grid',gridTemplateColumns: 'repeat(4, 364px)' , columnGap: '20px', padding: 0, margin: 0,  width: '100%'}
});


export function HLayoutBox(props) { 
    const classes = useStyles();
    const { sx, style, type, className,...other } = props;

    const getClassProp=()=> {
        if(className)
            return {className:className};
        else
           return { className : type ? classes[type] : classes.noWrapFlex}
    }

    return (
        <Box data-zlayout='HLayoutBox' {...getClassProp()} sx={sx} style={style} {...other} >
            {props.children}
        </Box>
    )
}