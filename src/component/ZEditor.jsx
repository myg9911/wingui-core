import React, { useState, useEffect, useRef, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
import { Box } from "@mui/material";
import { useInputStyles } from "./CommonStyle";
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import { makeStyles, createStyles } from '@mui/styles';
import FileUploader from './FileUploader'

export const useStyles = makeStyles({
  root: {
    height: props => props.height ? props.height : '300px',
    width: props => props.width ? props.width : '300px',
    border: "1px solid #efefef",
  }
});

export const ZEditor = React.forwardRef((props, ref) => {

  const { value, onChange, height, width, locale, hideModeSwitch, ...other } = props
  const editorRef = useRef(null)
  const dragDropRef = useRef(null)

  const [dragdropElem, setDradDropElem] = useState(null)
  const [initialValue, setInitialValue] = useState(value)

  const classes = useInputStyles(props);
  const editorStyle = useStyles(props);

  const setRef = (elem) => {
    dragDropRef.current = elem;
    setDradDropElem(dragDropRef.current)
  }


  const onChangeEditor = () => {
    if (editorRef.current) {
      let val = editorRef.current.getInstance().getHTML()
      setInitialValue(val)
      if (onChange)
        onChange(val)
    }
  }

  /*
  useEffect(() => {
    if(editorRef.current) {
        // 전달받은 html값으로 초기화
        editorRef.current.getInstance().setHTML(value);

        // 기존 이미지 업로드 기능 제거
        editorRef.current.getInstance().removeHook('addImageBlobHook');
        // 이미지 서버로 데이터를 전달하는 기능 추가
        editorRef.current.getInstance().addHook('addImageBlobHook', (blob, callback) => {
            (async () => {
                const formData = new FormData();
                formData.append("multipartFiles", blob);

                const res = await axios.post('http://localhost:8080/uploadImage', formData);

                callback(res.data, "input alt text");
              })();
    
            return false;
        });
    }
    }, [])
    */

  useEffect(() => {
    if (onChange)
      onChange(initialValue)
  }, [])

  useEffect(() => {
    if (initialValue != value && value != undefined) {
      setInitialValue(value)
      if (editorRef.current && editorRef.current.getInstance()) {
        if (editorRef.current.getInstance().setHTML)
          editorRef.current.getInstance().setHTML(value);
        else {
          const preViewer = editorRef.current.getInstance();
          //console.log(preViewer)
          if (preViewer.preview)
            preViewer.preview.previewContent.innerHTML = '<div data-nodeid="1">' + value + '</div>';
        }
      }

    }
  }, [value])

  const MakeViewer = (pValue) => {

    return (<div style={{ height: '400px' }}>
      <Viewer initialValue={pValue} ref={editorRef}></Viewer>
    </div>)
  }

  return (
    <Box ref={setRef} dataRole='editorCont' style={{ width: width ? width : '100%', height: height ? height : '100%', overflow: 'auto' }}>
      {
        props.readonly ? (
          MakeViewer(initialValue)
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Editor
              placeholder="내용을 입력해주세요."
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              initialValue={initialValue}
              height='100%'
              onChange={onChangeEditor}
              hideModeSwitch={hideModeSwitch ? hideModeSwitch : true}
              ref={editorRef}
              plugins={[colorSyntax]}
            />
            {
              props.fileupload ? (
                <FileUploader style={{ height: '70px' }} dragdropElem={dragdropElem} onChange={props.handleFileUploaderChange} accept={props.accept} maxFileCount={props.maxFileCount} maxFileSize={props.maxFileSize}></FileUploader>
              )
                : null
            }
          </Box>
        )
      }
    </Box>
  )
});

ZEditor.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

ZEditor.displayName = 'ZEditor'