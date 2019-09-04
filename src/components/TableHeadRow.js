import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/styles';
import { useDrop } from 'react-dnd';

const useStyles = makeStyles(
  theme => ({
    root: {},
  }),
  { name: 'MUIDataTableHeadRow' },
);

function TableHeadRow(props) {
  const classes = useStyles();

  const [, drop] = useDrop({
    accept: 'TABLE_HEAD_CELL_LABEL',
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      console.log(delta, left, top);
      return undefined;
    },
  });

  return (
    <TableRow
      className={classNames({
        [classes.root]: true,
      })}>
      {this.props.children}
    </TableRow>
  );
}

TableHeadRow.propTypes = {
  /** Extend the style applied to components */
  classes: PropTypes.object,
};

export default TableHeadRow;
