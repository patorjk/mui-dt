import React from 'react';
import PropTypes from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import TableHead from './TableHead';
import TablePagination from './TablePagination';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& tfoot td': {
      borderBottom: 'none'
    }
  }
});

function TableFooter(props) {
  const classes = useStyles();
  
  const { options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage } = props;

  return (
    <MuiTable className={classes.root}>
      {options.customFooter
        ? options.customFooter(
            rowCount,
            page,
            rowsPerPage,
            changeRowsPerPage,
            changePage,
            options.textLabels.pagination,
          )
        : options.pagination && (
            <TablePagination
              count={rowCount}
              page={page}
              rowsPerPage={rowsPerPage}
              changeRowsPerPage={changeRowsPerPage}
              changePage={changePage}
              component={'div'}
              options={options}
            />
          )}
    </MuiTable>
  );
}

export default TableFooter;
