import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  theme => ({
    root: {
      '&.MuiTableRow-root.Mui-selected': {
        '& td': {
          backgroundColor: '#ededed',
        }        
      }
    },
    hover: {
      '&:hover': {
        '& td': {
          backgroundColor: '#ededed',
        }
      }
    },
    hoverCursor: { cursor: 'pointer' },
    responsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        border: 'solid 2px rgba(0, 0, 0, 0.15)',
      },
    },
  }),
  { name: 'MUIDataTableBodyRow' },
);

function TableBodyRow(props) {
  const classes = useStyles();
  const { options, rowSelected, onClick, className, ...rest } = props;

  return (
    <TableRow
      hover={options.rowHover ? true : false}
      onClick={onClick}
      style={{overflow:'auto'}}
      className={classNames(
        {
          [classes.root]: true,
          [classes.hover]: options.rowHover,
          [classes.hoverCursor]: options.selectableRowsOnClick || options.expandableRowsOnClick,
          [classes.responsiveStacked]: options.responsive === 'stacked',
        },
        className,
      )}
      selected={rowSelected}
      {...rest}>
      {props.children}
    </TableRow>
  );
}

TableBodyRow.propTypes = {
  /** Extend the style applied to components */
  classes: PropTypes.object,
  /** Callback to execute when row is clicked */
  onClick: PropTypes.func,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Current row selected or not */
  rowSelected: PropTypes.bool,
};

export default TableBodyRow;
