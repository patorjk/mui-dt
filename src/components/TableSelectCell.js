import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Remove from '@material-ui/icons/Remove';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    fixedHeader: {
      position: 'sticky',
      top: '0px',
      left: '0px',
      zIndex: 100,
    },
    fixedLeft: {
      position: 'sticky',
      left: '0px',
      zIndex: 100,
    },
    icon: {
      cursor: 'pointer',
      transition: 'transform 0.25s',
    },
    expanded: {
      transform: 'rotate(90deg)',
    },
    hide: {
      visibility: 'hidden',
    },
    headerCell: {
      zIndex: 110,
      backgroundColor: theme.palette.background.paper,
    },
    checkboxRoot: {},
    checked: {},
    disabled: {},
  }),
  { name: 'MUIDataTableSelectCell' },
);

function TableSelectCell(props) {
  const classes = useStyles();

  const {
    checkboxColor,
    expandableOn = false,
    fixedHeader,
    isHeaderCell = false,
    isRowExpanded = false,
    isRowSelectable,
    selectableOn = 'none',
    selectableRowsHeader,
    setCellRef,
    expandableRowsHeader,
    expandedRows,
    areAllRowsExpanded = () => (false),
    onChange,
    handleRowSelect,
    toggleExpandRow,
    dataIndex,
    rowIndex,
    ...otherProps
  } = props;

  if (!expandableOn && selectableOn === 'none') return false;

  const cellClass = classNames({
    [classes.root]: true,
    [classes.fixedHeader]: fixedHeader && isHeaderCell,
    [classes.fixedLeft]: fixedHeader && !isHeaderCell,
    [classes.headerCell]: isHeaderCell,
  });

  const iconClass = classNames({
    [classes.icon]: true,
    [classes.hide]: isHeaderCell && !expandableRowsHeader,
    [classes.expanded]: isRowExpanded || (isHeaderCell && areAllRowsExpanded()),
  });
  const iconIndeterminateClass = classNames({
    [classes.icon]: true,
    [classes.hide]: isHeaderCell && !expandableRowsHeader,
  });

  const checkboxChange = (event) => {
    handleRowSelect({
      index: props.rowIndex,
      dataIndex: props.dataIndex,
    }, event);
  };

  const onExpand = () => {
    toggleExpandRow({
      index: props.rowIndex,
      dataIndex: props.dataIndex,
    });
  };

  const renderCheckBox = () => {
    if (isHeaderCell && (selectableOn !== 'multiple' || selectableRowsHeader === false)) {
      // only display the header checkbox for multiple selection.
      return null;
    }
    return (
      <Checkbox
        classes={{
          root: classes.checkboxRoot,
          checked: classes.checked,
          disabled: classes.disabled,
        }}
        color={checkboxColor}
        disabled={!isRowSelectable}
        onChange={checkboxChange}
        {...otherProps}
      />
    );
  };

  let refProp = {};
  if (isHeaderCell) {
    refProp.ref = el => setCellRef(0, findDOMNode(el));
  }

  return (
    <TableCell className={cellClass} padding="checkbox" {...refProp}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {expandableOn && <>
          {(isHeaderCell && !areAllRowsExpanded() && props.expandedRows.data.length > 0 ) ?
            <IconButton onClick={onExpand} style={{padding:0}}><Remove id="expandable-button" className={iconIndeterminateClass} /></IconButton>
            :
            <IconButton onClick={onExpand} style={{padding:0}}><KeyboardArrowRight id="expandable-button" className={iconClass} /></IconButton>
          }
          </>}
        {selectableOn !== 'none' && renderCheckBox()}
      </div>
    </TableCell>
  );
}

TableSelectCell.propTypes = {
  /** Select cell checked on/off */
  checked: PropTypes.bool.isRequired,
  /** Extend the style applied to components */
  classes: PropTypes.object,
  /** Is expandable option enabled */
  expandableOn: PropTypes.bool,
  /** Select cell part of fixed header */
  fixedHeader: PropTypes.bool.isRequired,
  /** Is selectable option enabled */
  selectableOn: PropTypes.string,
  /** If there should be a select-all checkbox */
  selectableRowsHeader: PropTypes.bool,
};

export default React.memo(TableSelectCell);
