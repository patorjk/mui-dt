import React, { useState } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    fixedHeader: {
      position: 'sticky',
      top: '0px',
      //left: '0px',
      zIndex: 100,
      backgroundColor: theme.palette.background.paper,
    },
    mypopper: {
      '&[data-x-out-of-boundaries]': {
        display: 'none',
      },
    },
    data: {
      display: 'inline-block',
    },
    sortAction: {
      display: 'flex',
      verticalAlign: 'top',
      cursor: 'pointer',
    },
    sortLabelRoot: {
      height: '10px',
    },
    sortActive: {
      color: theme.palette.text.primary,
    },
    toolButton: {
      display: 'flex',
      outline: 'none',
      cursor: 'pointer',
    },
    hintIconAlone: {
      marginTop: '-3px',
      marginLeft: '3px',
    },
    hintIconWithSortIcon: {
      marginTop: '-3px',
    },
  }),
  { name: 'MUIDataTableHeadCell' },
);

function TableHeadCell(props) {
  const [isSortTooltipOpen, setIsSortTooltipOpen] = useState(false);
  const [isHintTooltipOpen, setIsHintTooltipOpen] = useState(false);

  const handleKeyboardSortinput = e => {
    if (e.key === 'Enter') {
      props.toggleSort(props.index);
    }

    return false;
  };

  const handleSortClick = () => {
    props.toggleSort(props.index);
  };

  const classes = useStyles();
  const { cellHeaderProps, children, hint, index, label, options, print, setCellRef, sort, sortDirection } = props;
  const { className, ...otherProps } = cellHeaderProps ? cellHeaderProps : {};
  const sortActive = sortDirection !== 'none' && sortDirection !== undefined ? true : false;
  const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;

  const sortLabelProps = {
    classes: { root: classes.sortLabelRoot },
    active: sortActive,
    hideSortIcon: true,
    ...(ariaSortDirection ? { direction: sortDirection } : {}),
  };

  const cellClass = classNames(
    {
      [classes.root]: true,
      [classes.fixedHeader]: options.fixedHeader,
      'datatables-noprint': !print,
    },
    className,
  );

  const showHintTooltip = () => {
    setIsSortTooltipOpen(false);
    setIsHintTooltipOpen(true);
  };

  let refProp = {};
  if (setCellRef) {
    refProp.ref = el => setCellRef(index + 1, findDOMNode(el));
  }

  return (
    <TableCell className={cellClass} scope={'col'} {...refProp} sortDirection={ariaSortDirection} {...otherProps}>
      {options.sort && sort ? (
        <Tooltip
          title={
            options.textLabels.body.columnHeaderTooltip ? options.textLabels.body.columnHeaderTooltip(label) : 'Sort'
          }
          placement={'bottom-start'}
          enterDelay={300}
          classes={{ popper: classes.mypopper }}
          open={isSortTooltipOpen}
          onOpen={() => (isHintTooltipOpen ? setIsSortTooltipOpen(false) : setIsSortTooltipOpen(true))}
          onClose={() => setIsSortTooltipOpen(false)}>
          <span
            data-column-label="true"
            role="button"
            onKeyUp={handleKeyboardSortinput}
            onClick={handleSortClick}
            className={classes.toolButton}
            tabIndex={0}>
            <div
              className={classNames({
                [classes.data]: true,
                [classes.sortActive]: sortActive,
              })}>
              {children}
            </div>
            <div className={classes.sortAction}>
              <TableSortLabel {...sortLabelProps} />
              {hint && (
                <Tooltip
                  title={hint}
                  placement={'bottom-end'}
                  enterDelay={300}
                  classes={{ popper: classes.mypopper }}
                  open={isHintTooltipOpen}
                  onOpen={() => showHintTooltip()}
                  onClose={() => setIsHintTooltipOpen(false)}>
                  <HelpIcon
                    className={!sortActive ? classes.hintIconAlone : classes.hintIconWithSortIcon}
                    fontSize="small"
                  />
                </Tooltip>
              )}
            </div>
          </span>
        </Tooltip>
      ) : (
        <div className={classes.sortAction}>
          {children}
          {hint && (
            <Tooltip title={hint} placement={'bottom-end'} enterDelay={300} classes={{ popper: classes.mypopper }}>
              <HelpIcon className={classes.hintIconAlone} fontSize="small" />
            </Tooltip>
          )}
        </div>
      )}
    </TableCell>
  );
}

TableHeadCell.propTypes = {
  /** Extend the style applied to components */
  classes: PropTypes.object,
  /** Hint tooltip text */
  hint: PropTypes.string,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Column displayed in print */
  print: PropTypes.bool.isRequired,
  /** Sort enabled / disabled for this column **/
  sort: PropTypes.bool.isRequired,
  /** Current sort direction */
  sortDirection: PropTypes.oneOf(['asc', 'desc', 'none']),
  /** Callback to trigger column sort */
  toggleSort: PropTypes.func.isRequired,
};

export default TableHeadCell;
