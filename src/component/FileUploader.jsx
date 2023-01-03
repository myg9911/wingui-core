import React, { useState, useEffect, useCallback  ,useRef,forwardRef} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Typography } from "@mui/material";
import PropTypes from 'prop-types';

/**
accept props

- 파일 확장자: 닷(.)으로 시작되는 파일 확장자
  ex) .png, .jpg, .pdf, .hwp

- audio/* :모든 타입의 오디오 파일이 허용됨.
- video/* :모든 타입의 비디오 파일이 허용됨.
- image/* :모든 타입의 이미지 파일이 허용됨.

- 미디어 타입	 	
  매개변수(parameter)를 가지지 않는 유효한 미디어 타입
  미디어 타입: http://www.iana.org/assignments/media-types/media-types.xhtml
*/

const FileUploadBox= {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    msFlexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}

const FileAttachLabel= {
    display: 'flex',    
    alignItems: 'center',
    justifyContent:'center',
    marginLeft:'1rem',
    width: '100px',
    height: '35px',
    border: '1px solid #93949e',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: '0.12s ease-in'
}

const DragDropFileDragOver= {
    ...FileAttachLabel,
    backgroundColor: 'black',
    color: 'white'
}

const DragDropFileList = {
    width: '100%',
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap:'wrap',
    overflow: 'auto',
  }

const FileUploader = forwardRef((props,ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false)
    const [fileSizeLimit, setFileSizeLimit] = useState(false)

    
    const MAX_FILE_COUNT= props.maxFileCount ? props.maxFileCount :  10 //10개
    const MAX_FILE_SIZE= props.maxFileSize ? props.maxFileSize :  100 * (1024 * 1000) //100 MB
    const accept = props.accept ? props.accept : ['*'] ; //배열이어야 함

    const dragRef = useRef(null);
    const fileId = useRef(0);

    function getExtension(filename) {
      let fileLen = filename.length;
      let lastDot = filename.lastIndexOf('.');
      let fileExt = filename.substring(lastDot, fileLen).toLowerCase();
      return fileExt;
  }

  
    function verifyAccept(file, allowed) {
      
      let type = file.type;
      let ext = getExtension(file.name)
      let extAccept = false;
      for(let i=0; i < allowed.length; i++) {
        const act = allowed[i].toLowerCase();
        if(act == ext || act =='*') {
          extAccept=true;
          break;
        }
      }
      
      return allowed.includes(type) || allowed.includes(type.split('/')[0] + '/*') || extAccept;
    }

    const setNewFiles=(tempFiles) => {
        let limitSizeExceeded = false;
        let fileSumSize = 0;
        let acceptedFile= true;
        tempFiles.map(file => {
            const f = file.object;
            fileSumSize += f.size;

            if(verifyAccept(f, accept)==false) {
              acceptedFile=false;
            }
        })

        if(fileSumSize > MAX_FILE_SIZE) {
            setFileSizeLimit(true)
            limitSizeExceeded=true;
        }
        else if(limitSizeExceeded != fileSizeLimit){
            setFileSizeLimit(limitSizeExceeded)
        }
  
        let limitExceeded = false;
        if(tempFiles.length > MAX_FILE_COUNT) {
            setFileLimit(true)
            limitExceeded = true;
        }
        else if(limitExceeded != fileLimit) {
            setFileLimit(limitExceeded)
        }

        if(limitExceeded ) {
            showMessage(transLangKey('WARNING'),'최대 업로드 파일 개수를 넘겼습니다.',{close:false});
            return;
        }

        if(limitSizeExceeded) {
            showMessage(transLangKey('WARNING'),'최대 업로드 파일 용량을 초과했습니다.',{close:false});
            return;
        }
        if(acceptedFile==false) {
          showMessage(transLangKey('WARNING'),'이 형식의 파일은 업로드할 수 없습니다.',{close:false});
          return;
        }

        setFiles(tempFiles);
        if(props.onChange) {
          let filesTmp=[]
          tempFiles.map( fo => {filesTmp.push(fo.object)})
          props.onChange(filesTmp)
        }
    }

    const onChangeFiles = useCallback((e) => {
        let selectFiles = [];
        let tempFiles = files;
  
        if (e.type === "drop") {
          selectFiles = e.dataTransfer.files;
        } else {
          selectFiles = e.target.files;
        }

        for (const file of selectFiles) {
            console.log(file)
          tempFiles = [
            ...tempFiles,
            {
              id: fileId.current++,
              object: file
            }
          ];
        }

        setNewFiles(tempFiles)
      },
      [files]
    );
  
    const handleFilterFile = useCallback((id)=> {
        let tempFiles =files.filter((file) => file.id !== id)
        setNewFiles(tempFiles)
      },
      [files]
    );
  
    const handleDragIn = useCallback((e)=> {
      e.preventDefault();
      e.stopPropagation();
    }, []);
  
    const handleDragOut = useCallback((e)=> {
      e.preventDefault();
      e.stopPropagation();
  
      setIsDragging(false);
    }, []);
  
    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
  
      if (e.dataTransfer && e.dataTransfer.files) {
        setIsDragging(true);
      }
    }, []);
  
    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        onChangeFiles(e);
        setIsDragging(false);
      },
      [onChangeFiles]
    );
  
    const initDragEvents = useCallback(() => {
      if (dragRef.current !== null) {
        dragRef.current.addEventListener("dragenter", handleDragIn);
        dragRef.current.addEventListener("dragleave", handleDragOut);
        dragRef.current.addEventListener("dragover", handleDragOver);
        dragRef.current.addEventListener("drop", handleDrop);
      }
      
      if(props.dragdropElem) {
        props.dragdropElem.addEventListener("dragenter", handleDragIn);
        props.dragdropElem.addEventListener("dragleave", handleDragOut);
        props.dragdropElem.addEventListener("dragover", handleDragOver);
        props.dragdropElem.addEventListener("drop", handleDrop);
      }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop,props.dragdropElem]);
  
    const resetDragEvents = useCallback(()=> {
      if (dragRef.current !== null) {
        dragRef.current.removeEventListener("dragenter", handleDragIn);
        dragRef.current.removeEventListener("dragleave", handleDragOut);
        dragRef.current.removeEventListener("dragover", handleDragOver);
        dragRef.current.removeEventListener("drop", handleDrop);
      }

      if (props.dragdropElem) {
        props.dragdropElem.removeEventListener("dragenter", handleDragIn);
        props.dragdropElem.removeEventListener("dragleave", handleDragOut);
        props.dragdropElem.removeEventListener("dragover", handleDragOver);
        props.dragdropElem.removeEventListener("drop", handleDrop);
      }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop,props.dragdropElem]);
  
    useEffect(() => {
      initDragEvents();
  
      return () => resetDragEvents();
    }, [initDragEvents, resetDragEvents]);
  
    return (
      <div style={FileUploadBox}>
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          multiple={true}
          onChange={onChangeFiles}
          accept={"".concat(accept)}
        />
        <label htmlFor="fileUpload"  ref={dragRef} style={ isDragging ? DragDropFileDragOver : FileAttachLabel}>
          <div >파일 첨부</div>
        </label>
  
        <div style={DragDropFileList}>
          {files.length > 0 &&
            files.map((file) => {
              const {
                id,
                object: { name }
              } = file;
  
              return (
                <div key={id} style={{marginRight: '20px', display: 'inline-flex', alignItems:'center'}}>                  
                  <span style={{marginRight: '5px'}}> {name} </span>
                  <div> 
                        <IconButton key={`IconButton_${id}`} edge="end" aria-label="delete" onClick={() => { handleFilterFile(id) }}>
                            <DeleteIcon key={`DeleteIcon_${id}`}  size='small' />
                        </IconButton>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  });



  FileUploader.propTypes = {
    accept:PropTypes.array,
    onChange: PropTypes.func,
    maxFileCount :  PropTypes.number,
    maxFileSize : PropTypes.number,
  };

  export default FileUploader;