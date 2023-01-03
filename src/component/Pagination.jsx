import React, { useState, useEffect } from 'react';
import MuiPagination from '@mui/material/Pagination';

function Pagination(props) {
  const [page, setPage] = React.useState(props.settings.currentPage);
  const [totalPages, setTotalPages] = React.useState(props.settings.totalPages);
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(()=> {
    if(page) {
      props.onClick(page);
    }
  }, [page])
  useEffect(()=> {
    setPage(props.settings.currentPage);
    setTotalPages(props.settings.totalPages);
  }, [props])
  return (
    <div className='wingui-pagination'>
      <MuiPagination color="primary" defaultPage={1} count={totalPages} page={page} onChange={handleChange} showFirstButton showLastButton disabled={props.diabled} />
    </div>
  )
}

export default Pagination;