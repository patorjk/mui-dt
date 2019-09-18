import React from 'react';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  theme => ({
    root: {},
    cellHide: {
      display: 'none',
    },
    cellHeaderResponsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
        fontSize: '16px',
        width: '50%',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        '&::after': {
          content: "'\xa0'"
        },
        '&:nth-last-child(2)': {
          borderBottom: 'none'
        },
      },
    },
    cellHeaderStacked: {
      display: 'inline-block',
      fontSize: '16px',
      width: '50%',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      '&::after': {
        content: "'\xa0'"
      },
      '&:nth-last-child(2)': {
        borderBottom: 'none'
      },
    },


    responsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
        fontSize: '16px',
        width: '50%',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        '&::after': {
          content: "'\xa0'"
        },
        '&:last-child': {
          borderBottom: 'none'
        },
      },
    },
    stacked: {
      display: 'inline-block',
      fontSize: '16px',
      width: '50%',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      '&::after': {
        content: "'\xa0'"
      },
      '&:last-child': {
        borderBottom: 'none'
      },
    },


  }),
  { name: 'MUIDataTableBodyCell' },
);

function TableBodyCell(props) {
  const classes = useStyles();
  const { children, className, colIndex, columnHeader, dataIndex, options, print, rowIndex, ...otherProps } = props;

  const handleClick = event => {
    const { colIndex, options, children, dataIndex, rowIndex } = props;
    if (options.onCellClick) {
      options.onCellClick(children, { colIndex, rowIndex, dataIndex, event });
    }
  };

  return [
    <TableCell
      key={1}
      className={classNames(
        {
          [classes.root]: true,
          [classes.cellHide]: true,
          [classes.cellHeaderResponsiveStacked]: options.displayMode === 'responsiveStacked',
          [classes.cellHeaderStacked]: options.displayMode === 'stacked',
          'datatables-noprint': !print,
        },
        className,
      )}>
      {columnHeader}
    </TableCell>,
    <TableCell
      key={2}
      onClick={handleClick}
      className={classNames(
        {
          [classes.root]: true,
          [classes.responsiveStacked]: options.displayMode === 'responsiveStacked',
          [classes.stacked]: options.displayMode === 'stacked',
          'datatables-noprint': !print,
        },
        className,
      )}
      {...otherProps}>
      {children}
    </TableCell>,
  ];
}

export default TableBodyCell;
