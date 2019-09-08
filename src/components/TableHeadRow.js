import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    root: {},
  },
  { name: 'MUIDataTableHeadRow' },
);

function TableHeadRow(props) {
  const classes = useStyles();

  return (
    <TableRow
      className={classNames({
        [classes.root]: true,
      })}>
      {props.children}
    </TableRow>
  );
}

TableHeadRow.propTypes = {
  /** Extend the style applied to components */
  classes: PropTypes.object,
};

export default TableHeadRow;
