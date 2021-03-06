import React, {useCallback} from 'react';
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
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        height: props => 1/props.visibleColumnCount + '%',
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
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      height: props => 1/props.visibleColumnCount + '%',
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
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        height: props => 1/props.visibleColumnCount + '%',
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
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      height: props => 1/props.visibleColumnCount + '%',
      '&:last-child': {
        borderBottom: 'none'
      },
    },


  }),
  { name: 'MUIDataTableBodyCell' },
);

function TableBodyCell(props) {
  const classes = useStyles(props);
  const { children, className, colIndex, columnHeader, dataIndex, options, print, rowIndex, visibleColumnCount, ...otherProps } = props;
  const onCellClick = options.onCellClick;

  const handleClick = useCallback(event => {
    if (onCellClick) {
      onCellClick(children, { colIndex, rowIndex, dataIndex, event });
    }
  }, [onCellClick, children, colIndex, rowIndex, dataIndex]);

  return (
    <>
      {options.displayMode !== 'scroll' &&
        <TableCell
          className={classNames(
            {
              [classes.root]: true,
              [classes.cellHide]: true,
              [classes.cellHeaderResponsiveStacked]: options.displayMode === 'responsiveStacked',
              [classes.cellHeaderStacked]: options.displayMode === 'stacked',
              'datatables-noprint': !print,
            },
            className)}>
          {columnHeader}
        </TableCell>
      }
      <TableCell
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
        {typeof children === 'function' ? children(dataIndex, rowIndex) : children}
      </TableCell>
    </>
  );
}

export default TableBodyCell;
