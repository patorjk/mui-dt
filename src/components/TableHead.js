import React from 'react';
import classNames from 'classnames';
import MuiTableHead from '@material-ui/core/TableHead';
import TableHeadRow from './TableHeadRow';
import TableHeadCell from './TableHeadCell';
import TableSelectCell from './TableSelectCell';
import { withStyles } from '@material-ui/core/styles';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  stacked: {
    display: 'none',
  },
});

class TableHead extends React.Component {
  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate('head', null);
  };

  render() {
    const { classes, columns, count, options, data, page, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    let isDeterminate = numSelected > 0 && numSelected < count;
    let isChecked = numSelected === count ? true : false;

    // When the disableSelectToolbar option is true, there can be
    // selected items that aren't visible, so we need to be more
    // precise when determining if the head checkbox should be checked.
    if (options.disableSelectToolbar === true) {
      if (isChecked) {
        for (let ii = 0; ii < data.length; ii++) {
          if (!selectedRows.lookup[data[ii].dataIndex]) {
            isChecked = false;
            isDeterminate = true;
            break;
          }
        }
      } else {
        if (numSelected > count) {
          isDeterminate = true;
        }
      }
    }
//onChange={this.handleRowSelect.bind(null)}
    return (
      <MuiTableHead
        className={classNames({ 
          [classes.responsiveStacked]: options.displayMode === 'responsiveStacked', 
          [classes.stacked]: options.displayMode === 'stacked', 
          [classes.main]: true,
        })}>
        <TableHeadRow>
          <TableSelectCell
            checkboxColor={options.checkboxColor}
            checked={isChecked}
            expandableOn={options.expandableRows}
            expandedRows={this.props.expandedRows}
            expandableRowsHeader={options.expandableRowsHeader}
            areAllRowsExpanded={this.props.areAllRowsExpanded}
            
            fixedHeader={options.fixedHeader}
            isHeaderCell={true}
            isRowSelectable={true}
            indeterminate={isDeterminate}
            
            handleRowSelect={this.handleRowSelect}
            toggleExpandRow={this.props.toggleAllExpandableRows}

            selectableOn={options.selectableRows}
            selectableRowsHeader={options.selectableRowsHeader}
            setCellRef={setCellRef} />
          {columns.map(
            (column, index) =>
              column.display === 'true' &&
              (column.customHeadRender ? (
                column.customHeadRender({ index, ...column }, this.handleToggleColumn)
              ) : (
                <TableHeadCell
                  key={index}
                  index={index}
                  type={'cell'}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  print={column.print}
                  label={column.label}
                  cellHeaderProps={
                    columns[index].setCellHeaderProps ? columns[index].setCellHeaderProps({ index, ...column }) : {}
                  }
                  options={options}
                  setCellRef={setCellRef}>
                  {column.customHeadLabelRender ? column.customHeadLabelRender({ index, ...column }) : column.label}
                </TableHeadCell>
              )),
          )}
        </TableHeadRow>
      </MuiTableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: 'MUIDataTableHead' })(TableHead);
