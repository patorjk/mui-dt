import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import TableHeadCellLabel from './TableHeadCellLabel.js';
import { useDrop } from 'react-dnd';

const useStyles = makeStyles(theme => ({
  root: {},
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
  },
  tooltip: {
    cursor: 'pointer',
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
}), { name: 'MUIDataTableHeadCell' });

function TableHeadCell(props) {

  const { children, options, sortDirection, sort, hint, print } = props;
  const sortActive = sortDirection !== 'none' && sortDirection !== undefined ? true : false;
  const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;

  const classes = useStyles();

  const [{isOver}, drop] = useDrop({
    accept: 'TABLE_HEAD_CELL_LABEL',
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      console.log(delta, left, top);
      return undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  });

  // state
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

  const closeTooltips = () => {
    setIsSortTooltipOpen(false); 
    setIsHintTooltipOpen(false);
  };

  const sortLabelProps = {
    classes: { root: classes.sortLabelRoot },
    active: sortActive,
    hideSortIcon: true,
    ...(ariaSortDirection ? { direction: sortDirection } : {}),
  };

  const cellClass = classNames({
    [classes.root]: true,
    [classes.fixedHeader]: options.fixedHeader,
    'datatables-noprint': !print,
  });

  const attachRef = el => {
    drop(el);
    props.cellRef(el);
  };
console.log('isOver:'+isOver);
  return (
    <TableCell className={cellClass} scope={'col'} sortDirection={ariaSortDirection} ref={attachRef} style={{backgroundColor: isOver ? 'red' : 'white'}}>
      {options.sort && sort ? (
        <Tooltip
          title={options.textLabels.body.toolTip}
          placement={'bottom-start'}
          classes={{
            tooltip: classes.tooltip,
          }}
          enterDelay={300}
          classes={{ popper: classes.mypopper }}
          open={isSortTooltipOpen}
          onOpen={() =>
            isHintTooltipOpen
              ? setIsSortTooltipOpen(false)
              : setIsSortTooltipOpen(true)
          }
          onClose={() => setIsSortTooltipOpen(false)}>
          <span
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
              <TableHeadCellLabel>{children}</TableHeadCellLabel>
            </div>
            <div className={classes.sortAction}>
              <TableSortLabel {...sortLabelProps} />
              {hint && (
                <Tooltip
                  title={hint}
                  placement={'bottom-end'}
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                  enterDelay={300}
                  classes={{ popper: classes.mypopper }}
                  open={isHintTooltipOpen}
                  onOpen={() => closeTooltips()}
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
            <Tooltip
              title={hint}
              placement={'bottom-end'}
              classes={{
                tooltip: classes.tooltip,
              }}
              enterDelay={300}
              classes={{ popper: classes.mypopper }}>
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
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Current sort direction */
  sortDirection: PropTypes.oneOf(['asc', 'desc', 'none']),
  /** Callback to trigger column sort */
  toggleSort: PropTypes.func.isRequired,
  /** Sort enabled / disabled for this column **/
  sort: PropTypes.bool.isRequired,
  /** Hint tooltip text */
  hint: PropTypes.string,
  /** Column displayed in print */
  print: PropTypes.bool.isRequired,
};

export default TableHeadCell;
