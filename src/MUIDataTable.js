import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import find from 'lodash.find';
import isUndefined from 'lodash.isundefined';
import merge from 'lodash.merge';
import assignwith from 'lodash.assignwith';
import PropTypes from 'prop-types';
import React from 'react';
import TableBody from './components/TableBody';
import TableFilterList from './components/TableFilterList';
import TableFooter from './components/TableFooter';
import TableHead from './components/TableHead';
import TableResize from './components/TableResize';
import TableToolbar from './components/TableToolbar';
import TableToolbarSelect from './components/TableToolbarSelect';
import textLabels from './textLabels';
import { buildMap, getCollatorComparator, sortCompare, getPageValue } from './utils';

const defaultTableStyles = theme => ({
  root: {},
  paper: {},
  tableRoot: {
    outline: 'none',
  },
  tableWrapper: {
    overflowX: 'auto',
    overflow: 'auto',
  },
  caption: {
    position: 'absolute',
    left: '-3000px',
  },
  liveAnnounce: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
  '@global': {
    '@media print': {
      '.datatables-noprint': {
        display: 'none',
      },
    },
  },
});

const TABLE_LOAD = {
  INITIAL: 1,
  UPDATE: 2,
};

// Populate this list with anything that might render in the toolbar to determine if we hide the toolbar
const TOOLBAR_ITEMS = ['title', 'filter', 'search', 'print', 'download', 'viewColumns', 'customToolbar'];

const hasToolbarItem = (options, title) => {
  options.title = title;

  return !isUndefined(find(TOOLBAR_ITEMS, i => options[i]));
};

class MUIDataTable extends React.Component {
  static propTypes = {
    /** Title of the table */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string,
          name: PropTypes.string.isRequired,
          options: PropTypes.shape({
            customBodyRender: PropTypes.func,
            customFilterListRender: PropTypes.func,
            customHeadRender: PropTypes.func,
            display: PropTypes.oneOf(['true', 'false', 'excluded']),
            download: PropTypes.bool,
            empty: PropTypes.bool,
            filter: PropTypes.bool,
            filterList: PropTypes.array,
            filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField', 'custom']),
            filterOptions: PropTypes.oneOfType([
              PropTypes.array,
              PropTypes.shape({
                names: PropTypes.array,
                logic: PropTypes.func,
                display: PropTypes.func,
              }),
            ]),
            print: PropTypes.bool,
            searchable: PropTypes.bool,
            setCellProps: PropTypes.func,
            setCellHeaderProps: PropTypes.func,
            sort: PropTypes.bool,
            viewColumns: PropTypes.bool,
          }),
        }),
      ]),
    ).isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      caseSensitive: PropTypes.bool,
      checkboxColor: PropTypes.string,
      count: PropTypes.number,
      customFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customSearchRender: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customRowRender: PropTypes.func,
      customSearch: PropTypes.func,
      customSort: PropTypes.func,
      customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customSelectToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      disableSelectToolbar: PropTypes.bool,
      download: PropTypes.bool,
      downloadOptions: PropTypes.shape({
        filename: PropTypes.string,
        separator: PropTypes.string,
        filterOptions: PropTypes.shape({
          useDisplayedColumnsOnly: PropTypes.bool,
          useDisplayedRowsOnly: PropTypes.bool,
        }),
      }),
      expandableRows: PropTypes.bool,
      expandableRowsHeader: PropTypes.bool,
      expandableRowsOnClick: PropTypes.bool,
      filter: PropTypes.bool,
      filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField', 'custom']),
      filterPopoverOptions: PropTypes.shape({
        mustConfirm: PropTypes.bool,
        confirmButtonLabel: PropTypes.string,
      }),
      fixedHeader: PropTypes.bool,
      isRowExpandable: PropTypes.func,
      isRowSelectable: PropTypes.func,
      onDownload: PropTypes.func,
      onRowClick: PropTypes.func,
      onRowExpansionChange: PropTypes.func,
      onRowSelectionChange: PropTypes.func,
      onTableChange: PropTypes.func,
      onTableInit: PropTypes.func,
      page: PropTypes.number,
      pagination: PropTypes.bool,
      print: PropTypes.bool,
      renderExpandableRow: PropTypes.func,
      resizableColumns: PropTypes.bool,
      displayMode: PropTypes.oneOf(['stacked', 'scroll', 'responsiveStacked']),
      rowHover: PropTypes.bool,
      rowsExpanded: PropTypes.array,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      rowsSelected: PropTypes.array,
      search: PropTypes.bool,
      searchPlaceholder: PropTypes.string,
      searchProps: PropTypes.object,
      searchText: PropTypes.string,
      selectableRows: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['none', 'single', 'multiple'])]),
      selectableRowsHeader: PropTypes.bool,
      selectableRowsOnClick: PropTypes.bool,
      serverSide: PropTypes.bool,
      setRowProps: PropTypes.func,
      sort: PropTypes.bool,
      sortOrder: PropTypes.object,
      tableBodyHeight: PropTypes.string,
      tableProps: PropTypes.object,
      textLabels: PropTypes.object,
      viewColumns: PropTypes.bool,
    }),
    /** Pass and use className to style MUIDataTable as desired */
    className: PropTypes.string,
  };

  static defaultProps = {
    columns: [],
    data: [],
    options: {},
    title: '',
  };

  state = {
    announceText: null,
    activeColumn: null,
    columns: [],
    count: 0,
    expandedRows: {
      data: [],
      lookup: {},
    },
    data: [],
    displayData: [],
    filterData: [],
    filterList: [],
    page: 0,
    previousSelectedRow: null,
    rowsPerPage: 0,
    selectedRows: {
      data: [],
      lookup: {},
    },
    searchText: null,
    sortOrder: {},
  };

  constructor() {
    super();
    this.tableRef = false;
    this.tableContent = React.createRef();
    this.headCellRefs = {};
    this.setHeadResizeable = () => {};
    this.updateDividers = () => {};
  }

  UNSAFE_componentWillMount() {
    this.initializeTable(this.props);
  }

  componentDidMount() {
    this.setHeadResizeable(this.headCellRefs, this.tableRef);

    // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
    if (this.props.options.searchText && !this.props.options.serverSide) this.setState({ page: 0 });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data || this.props.columns !== prevProps.columns || this.props.options !== prevProps.options) {
      this.updateOptions(this.options, this.props);

      var didDataUpdate = this.props.data !== prevProps.data;
      if ( this.props.data && prevProps.data ) {
        didDataUpdate = didDataUpdate && (this.props.data.length === prevProps.data.length);
      }

      this.setTableData(this.props, TABLE_LOAD.INITIAL, didDataUpdate, () => {
        this.setTableAction('propsUpdate');
      });
    }

    if (this.props.options.searchText !== prevProps.options.searchText && !this.props.options.serverSide) {
      // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
      this.setState({ page: 0 });
    }

    // TODO: page is described as the "starting" page. Should this prop be
    // rename? It's confusing. The below code would make it so options.page
    // controls the current page
    /*else if (typeof this.options.page !== 'undefined' && this.state.page !== this.options.page) {
      this.setState({ page: this.options.page });
    }*/

    if (this.options.resizableColumns) {
      this.setHeadResizeable(this.headCellRefs, this.tableRef);
      this.updateDividers();
    }
  }

  updateOptions(options, props) {
    this.options = assignwith(options, props.options, (objValue, srcValue, key) => {
      // Merge any default options that are objects, as they will be overwritten otherwise
      if (key === 'textLabels' || key === 'downloadOptions' || key === 'filterPopoverOptions') return merge(objValue, srcValue);
      return;
    });

    this.handleOptionDeprecation();
  }

  initializeTable(props) {
    this.mergeDefaultOptions(props);
    this.setTableOptions();
    this.setTableData(props, TABLE_LOAD.INITIAL, true, () => {
      this.setTableInit('tableInitialized');
    });
  }

  getDefaultOptions = () => ({
    caseSensitive: false,
    checkboxColor: 'primary',
    disableSelectToolbar: false,
    displayMode: 'scroll',
    download: true,
    downloadOptions: {
      filename: 'tableDownload.csv',
      separator: ',',
    },
    elevation: 4,
    expandableRows: false,
    expandableRowsHeader: true,
    expandableRowsOnClick: false,
    filter: true,
    filterType: 'dropdown',
    filterPopoverOptions: {
      mustConfirm: false,
      confirmButtonLabel: 'Submit',
    },
    fixedHeader: true,
    resizableColumns: false,
    rowHover: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 100],
    search: true,
    searchProps: {},
    selectableRows: 'multiple',
    selectableRowsHeader: true,
    selectableRowsOnClick: false,
    serverSide: false,
    sort: true,
    sortOrder: {},
    sortFilterList: true,
    pagination: true,
    print: true,
    tableBodyHeight: 'none',
    textLabels,
    viewColumns: true,
  });

  handleOptionDeprecation = () => {
    if (typeof this.options.selectableRows === 'boolean') {
      console.error(
        'Using a boolean for selectableRows has been deprecated. Please use string option: multiple | single | none',
      );
      this.options.selectableRows = this.options.selectableRows ? 'multiple' : 'none';
    }
    if (typeof this.options.searchPlaceholder === 'string' && this.options.searchPlaceholder) {
      console.warn(
        'options.searchPlaceholder is superfluous. Please use options.searchProps.placeholder to set the placeholder text.',
      );
    }
    if (['scroll', 'stacked', 'responsiveStacked'].indexOf(this.options.displayMode) === -1) {
      console.error(`Invalid option value of ${this.options.displayMode} for displayMode.`);
    }
  };

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  mergeDefaultOptions(props) {
    const defaultOptions = this.getDefaultOptions();

    this.updateOptions(defaultOptions, this.props);
  }

  validateOptions(options) {
    if (options.serverSide && options.onTableChange === undefined) {
      throw Error('onTableChange callback must be provided when using serverSide option');
    }
    if (options.expandableRows && options.renderExpandableRow === undefined) {
      throw Error('renderExpandableRow must be provided when using expandableRows option');
    }
    if (this.props.options.filterList) {
      console.error(
        'Deprecated: filterList must now be provided under each column option. see https://github.com/patorjk/mui-dt/tree/master/examples/column-filters example',
      );
    }
  }

  setTableAction = action => {
    if (typeof this.options.onTableChange === 'function') {
      this.options.onTableChange(action, this.state);
    }
  };

  setTableInit = action => {
    if (typeof this.options.onTableInit === 'function') {
      this.options.onTableInit(action, this.state);
    }
  };

  setTableOptions() {
    const optionNames = ['rowsPerPage', 'page', 'rowsSelected', 'rowsPerPageOptions'];
    const optState = optionNames.reduce((acc, cur) => {
      if (this.options[cur] !== undefined) {
        acc[cur] = this.options[cur];
      }
      return acc;
    }, {});

    this.validateOptions(optState);
    this.setState(optState);
  }

  setHeadCellRef = (index, el) => {
    this.headCellRefs[index] = el;
  };

  // must be arrow function on local field to refer to the correct instance when passed around
  // assigning it as arrow function in the JSX would cause hard to track re-render errors
  getTableContentRef = () => this.tableContent.current;

  /*
   *  Build the source table data
   */

  buildColumns = (newColumns, prevColumns) => {
    let columnData = [];
    let filterData = [];
    let filterList = [];

    newColumns.forEach((column, colIndex) => {
      let columnOptions = {
        display: 'true',
        empty: false,
        filter: true,
        sort: true,
        print: true,
        searchable: true,
        download: true,
        viewColumns: true,
      };

      if (typeof column === 'object') {
        const options = { ...column.options };
        if (options) {
          if (options.display !== undefined) {
            options.display = options.display.toString();
          } else if (prevColumns[colIndex] && prevColumns[colIndex].name === column.name && prevColumns[colIndex].display) {
            options.display = prevColumns[colIndex].display;
          }
        }

        columnOptions = {
          name: column.name,
          label: column.label ? column.label : column.name,
          ...columnOptions,
          ...options,
        };
      } else {
        columnOptions = { ...columnOptions, name: column, label: column };
      }

      columnData.push(columnOptions);

      filterData[colIndex] = [];
      filterList[colIndex] = [];
    });

    return { columns: columnData, filterData, filterList };
  };

  transformData = (columns, data) => {
    const leaf = (obj, path) => path.split('.').reduce((value, el) => (value ? value[el] : undefined), obj);

    return Array.isArray(data[0])
      ? data.map(row => {
          let i = -1;

          return columns.map(col => {
            if (!col.empty) i++;
            return col.empty ? undefined : row[i];
          });
        })
      : data.map(row => {
          let ret = columns.map(col => leaf(row, col.name));
          ret.originalObjectData = row;
          return ret;
        });
  };

  setTableData(props, status, dataUpdated, callback = () => {}) {
    let tableData = [];
    let { columns, filterData, filterList } = this.buildColumns(props.columns, this.state.columns);
    let sortIndex = null;
    let sortDirection = 'none';
    let tableMeta;
    let sortOrder;
    if (this.options.sortOrder) {
      sortOrder = Object.assign({}, this.options.sortOrder);
    } else {
      sortOrder = Object.assign({}, this.state.sortOrder);
    }

    const data = status === TABLE_LOAD.INITIAL ? this.transformData(columns, props.data) : props.data;
    let searchText = status === TABLE_LOAD.INITIAL ? this.options.searchText : null;

    if (typeof this.options.searchText === 'undefined' && typeof this.state.searchText !== 'undefined') {
      searchText = this.state.searchText;
    }

    columns.forEach((column, colIndex) => {
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let value = status === TABLE_LOAD.INITIAL ? data[rowIndex][colIndex] : data[rowIndex].data[colIndex];

        if (typeof tableData[rowIndex] === 'undefined') {
          tableData.push({
            index: status === TABLE_LOAD.INITIAL ? rowIndex : data[rowIndex].index,
            data: status === TABLE_LOAD.INITIAL ? data[rowIndex] : data[rowIndex].data,
          });
        }

        if (column.filter !== false) {
          if (typeof column.customBodyRender === 'function' && column.filterWithRenderData !== false) {
            const rowData = tableData[rowIndex].data;
            tableMeta = this.getTableMeta(rowIndex, colIndex, rowData, column, data, this.state);
            const funcResult = column.customBodyRender(value, tableMeta);

            if (React.isValidElement(funcResult) && funcResult.props.value) {
              value = funcResult.props.value;
            } else if (typeof funcResult === 'string') {
              value = funcResult;
            }
          }

          if (filterData[colIndex].indexOf(value) < 0 && !Array.isArray(value)) {
            filterData[colIndex].push(value);
          } else if (Array.isArray(value)) {
            value.forEach(element => {
              if (filterData[colIndex].indexOf(element) < 0) {
                filterData[colIndex].push(element);
              }
            });
          }
        }
      }

      if (column.filterOptions) {
        if (Array.isArray(column.filterOptions.names)) {
          filterData[colIndex] = cloneDeep(column.filterOptions.names);
        }
      }

      if (column.filterList) {
        filterList[colIndex] = cloneDeep(column.filterList);
      } else if ( this.state.filterList && this.state.filterList[colIndex] && this.state.filterList[colIndex].length > 0) {
        filterList[colIndex] = cloneDeep(this.state.filterList[colIndex]);
      }

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[colIndex].sort(comparator);
      }

      if (column.name === sortOrder.columnName) {
        sortDirection = sortOrder.sortDirection;
        sortIndex = colIndex;
      }
    });

    let selectedRowsData = {
      data: [],
      lookup: {},
    };

    let expandedRowsData = {
      data: [],
      lookup: {},
    };

    if (TABLE_LOAD.INITIAL) {
      // Multiple row selection customization
      if (this.options.rowsSelected && this.options.rowsSelected.length && this.options.selectableRows === 'multiple') {
        this.options.rowsSelected.forEach(row => {
          let rowPos = row;

          for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
            if (this.state.displayData[cIndex].dataIndex === row) {
              rowPos = cIndex;
              break;
            }
          }

          selectedRowsData.data.push({ index: rowPos, dataIndex: row });
          selectedRowsData.lookup[row] = true;
        });

      // Single row selection customization
      } else if (
        this.options.rowsSelected &&
        this.options.rowsSelected.length === 1 &&
        this.options.selectableRows === 'single'
      ) {

        let rowPos = this.options.rowsSelected[0];

        for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
          if (this.state.displayData[cIndex].dataIndex === this.options.rowsSelected[0]) {
            rowPos = cIndex;
            break;
          }
        }

        selectedRowsData.data.push({ index: rowPos, dataIndex: this.options.rowsSelected[0] });
        selectedRowsData.lookup[this.options.rowsSelected[0]] = true;
      } else if (
        this.options.rowsSelected &&
        this.options.rowsSelected.length > 1 &&
        this.options.selectableRows === 'single'
      ) {
        console.error(
          'Multiple values provided for selectableRows, but selectableRows set to "single". Either supply only a single value or use "multiple".',
        );
      } else if (typeof this.options.rowsSelected === 'undefined' && dataUpdated === false) {
        if (this.state.selectedRows) {
          selectedRowsData = Object.assign({}, this.state.selectedRows);
        }
      }

      if (this.options.rowsExpanded && this.options.rowsExpanded.length && this.options.expandableRows) {
        this.options.rowsExpanded.forEach(row => {
          let rowPos = row;

          for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
            if (this.state.displayData[cIndex].dataIndex === row) {
              rowPos = cIndex;
              break;
            }
          }

          expandedRowsData.data.push({ index: rowPos, dataIndex: row });
          expandedRowsData.lookup[row] = true;
        });
      } else if (typeof this.options.rowsExpanded === 'undefined' && dataUpdated === false &&  this.state.expandedRows) {
        expandedRowsData = Object.assign({}, this.state.expandedRows);
      }
    }

    if (!this.options.serverSide && sortIndex !== null) {
      const sortedData = this.sortTable(tableData, sortIndex, sortDirection);
      tableData = sortedData.data;
    }

    /* set source data and display Data set source set */
    this.setState(
      {
        columns: columns,
        filterData: filterData,
        filterList: filterList,
        searchText: searchText,
        selectedRows: selectedRowsData,
        expandedRows: expandedRowsData,
        count: this.options.count,
        data: tableData,
        sortOrder: sortOrder,
        displayData: this.getDisplayData(columns, tableData, filterList, searchText, tableMeta),
      },
      callback,
    );
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */
  computeDisplayRow(columns, row, rowIndex, filterList, searchText, dataForTableMeta) {
    let isFiltered = false;
    let isSearchFound = false;
    let displayRow = [];

    for (let index = 0; index < row.length; index++) {
      let columnDisplay = row[index];
      let columnValue = row[index];
      let column = columns[index];

      if (column.customBodyRender) {
        const tableMeta = this.getTableMeta(rowIndex, index, row, column, dataForTableMeta, {
          ...this.state,
          filterList: filterList,
          searchText: searchText,
        });

        const funcResult = column.customBodyRender(
          columnValue,
          tableMeta,
          this.updateDataCol.bind(null, rowIndex, index),
        );
        columnDisplay = funcResult;

        // drill down to get the value of a cell
        if (column.filterWithRenderData !== false) {
          columnValue =
            typeof funcResult === 'string' || !funcResult
              ? funcResult
              : funcResult.props && funcResult.props.value
              ? funcResult.props.value
              : columnValue;
          }
      }

      displayRow.push(columnDisplay);

      const columnVal = columnValue === null || columnValue === undefined ? '' : columnValue.toString();

      const filterVal = filterList[index];
      const caseSensitive = this.options.caseSensitive;
      const filterType = column.filterType || this.options.filterType;
      if (filterVal.length || filterType === 'custom') {
        if (column.filterOptions && column.filterOptions.logic) {
          if (column.filterOptions.logic(columnValue, filterVal)) isFiltered = true;
        } else if (filterType === 'textField' && !this.hasSearchText(columnVal, filterVal, caseSensitive)) {
          isFiltered = true;
        } else if (
          filterType !== 'textField' &&
          Array.isArray(columnValue) === false &&
          filterVal.indexOf(columnValue) < 0
        ) {
          isFiltered = true;
        } else if (filterType !== 'textField' && Array.isArray(columnValue)) {
          //true if every filterVal exists in columnVal, false otherwise
          const isFullMatch = filterVal.every(el => {
            return columnValue.indexOf(el) >= 0;
          });
          //if it is not a fullMatch, filter row out
          if (!isFullMatch) {
            isFiltered = true;
          }
        }
      }

      if (
        searchText &&
        this.hasSearchText(columnVal, searchText, caseSensitive) &&
        column.display !== 'false' &&
        column.searchable
      ) {
        isSearchFound = true;
      }
    }

    const { customSearch } = this.props.options;

    if (searchText && customSearch) {
      const customSearchResult = customSearch(searchText, row, columns);
      if (typeof customSearchResult !== 'boolean') {
        console.error('customSearch must return a boolean');
      } else {
        isSearchFound = customSearchResult;
      }
    }

    if (this.options.serverSide) {
      if (customSearch) {
        console.warn('Server-side filtering is enabled, hence custom search will be ignored.');
      }

      return displayRow;
    }

    if (isFiltered || (searchText && !isSearchFound)) return null;
    else return displayRow;
  }

  hasSearchText = (toSearch, toFind, caseSensitive) => {
    let stack = toSearch.toString();
    let needle = toFind.toString();

    if (!caseSensitive) {
      needle = needle.toLowerCase();
      stack = stack.toLowerCase();
    }

    return stack.indexOf(needle) >= 0;
  };

  updateDataCol = (row, index, value) => {
    this.setState(prevState => {
      let changedData = cloneDeep(prevState.data);
      let filterData = cloneDeep(prevState.filterData);

      const tableMeta = this.getTableMeta(row, index, row, prevState.columns[index], prevState.data, prevState);
      const funcResult = prevState.columns[index].customBodyRender(value, tableMeta);

      const filterValue =
        React.isValidElement(funcResult) && funcResult.props.value
          ? funcResult.props.value
          : prevState['data'][row][index];

      const prevFilterIndex = filterData[index].indexOf(filterValue);
      filterData[index].splice(prevFilterIndex, 1, filterValue);

      changedData[row].data[index] = value;

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[index].sort(comparator);
      }

      return {
        data: changedData,
        filterData: filterData,
        displayData: this.getDisplayData(prevState.columns, changedData, prevState.filterList, prevState.searchText),
      };
    });
  };

  getTableMeta = (rowIndex, colIndex, rowData, columnData, tableData, curState) => {
    const { columns, data, displayData, filterData, ...tableState } = curState;

    return {
      rowIndex: rowIndex,
      columnIndex: colIndex,
      columnData: columnData,
      rowData: rowData,
      tableData: tableData,
      tableState: tableState,
    };
  };

  getDisplayData(columns, data, filterList, searchText, tableMeta) {
    let newRows = [];
    const dataForTableMeta = tableMeta ? tableMeta.tableData : this.props.data;

    for (let index = 0; index < data.length; index++) {
      const value = data[index].data;
      const displayRow = this.computeDisplayRow(columns, value, index, filterList, searchText, dataForTableMeta);

      if (displayRow) {
        newRows.push({
          data: displayRow,
          dataIndex: data[index].index,
        });
      }
    }
    return newRows;
  }

  toggleViewColumn = index => {
    this.setState(
      prevState => {
        const columns = cloneDeep(prevState.columns);
        columns[index].display = columns[index].display === 'true' ? 'false' : 'true';
        return {
          columns: columns,
        };
      },
      () => {
        this.setTableAction('columnViewChange');
        if (this.options.onColumnViewChange) {
          this.options.onColumnViewChange(
            this.state.columns[index].name,
            this.state.columns[index].display === 'true' ? 'add' : 'remove',
          );
        }
      },
    );
  };

  getSortDirection(column) {
    if (column.name === this.state.sortOrder.columnName) {
      return this.state.sortOrder.sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return null;
  }

  toggleSortColumn = index => {
    this.setState(
      prevState => {
        let columns = cloneDeep(prevState.columns);
        let data = prevState.data;
        const newOrder = (columns[index].name === this.state.sortOrder.columnName && 
          this.state.sortOrder.sortDirection === 'desc') ? 'asc' : 'desc';
        const newSortOrder = {
          columnName: columns[index].name,
          sortDirection: newOrder,
        };

        const orderLabel = this.getSortDirection(columns[index]);
        const announceText = `Table now sorted by ${columns[index].name} : ${orderLabel}`;

        let newState = {
          columns: columns,
          announceText: announceText,
          activeColumn: index,
        };

        if (this.options.serverSide) {
          newState = {
            ...newState,
            data: prevState.data,
            displayData: prevState.displayData,
            selectedRows: prevState.selectedRows,
            sortOrder: newSortOrder,
          };
        } else {
          const sortedData = this.sortTable(data, index, newOrder);

          newState = {
            ...newState,
            data: sortedData.data,
            displayData: this.getDisplayData(columns, sortedData.data, prevState.filterList, prevState.searchText),
            selectedRows: sortedData.selectedRows,
            sortOrder: newSortOrder,
            previousSelectedRow: null,
          };
        }

        return newState;
      },
      () => {
        this.setTableAction('sort');
        if (this.options.onColumnSortChange) {
          this.options.onColumnSortChange(
            this.state.columns[index].name,
            this.getSortDirection(this.state.columns[index]),
          );
        }
      },
    );
  };

  changeRowsPerPage = rows => {
    const rowCount = this.options.count || this.state.displayData.length;

    this.setState(
      () => ({
        rowsPerPage: rows,
        page: getPageValue(rowCount, rows, this.state.page),
      }),
      () => {
        this.setTableAction('changeRowsPerPage');

        if (this.options.onChangeRowsPerPage) {
          this.options.onChangeRowsPerPage(this.state.rowsPerPage);
        }
      },
    );
  };

  searchClose = () => {
    this.setState(
      prevState => ({
        searchText: null,
        displayData: this.options.serverSide
          ? prevState.displayData
          : this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, null),
      }),
      () => {
        this.setTableAction('search');
        if (this.options.onSearchChange) {
          this.options.onSearchChange(this.state.searchText);
        }
      },
    );
  };

  changePage = page => {
    this.setState(
      () => ({
        page: page,
      }),
      () => {
        this.setTableAction('changePage');
        if (this.options.onChangePage) {
          this.options.onChangePage(this.state.page);
        }
      },
    );
  };

  searchTextUpdate = text => {
    this.setState(
      prevState => ({
        searchText: text && text.length ? text : null,
        page: 0,
        displayData: this.options.serverSide
          ? prevState.displayData
          : this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, text),
      }),
      () => {
        this.setTableAction('search');
        if (this.options.onSearchChange) {
          this.options.onSearchChange(this.state.searchText);
        }
      },
    );
  };

  clearFilters = () => {
    this.setState(
      prevState => {
        const filterList = prevState.columns.map(() => []);

        return {
          filterList: filterList,
          displayData: this.options.serverSide
            ? prevState.displayData
            : this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
        };
      },
      () => {
        this.setTableAction('clearFilters');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(null, this.state.filterList);
        }
      },
    );
  };

  updateFilterByType = (filterList, index, value, type) => {
    const filterPos = filterList[index].indexOf(value);

    switch (type) {
      case 'checkbox':
        filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(value);
        break;
      case 'multiselect':
      case 'dropdown':
      case 'custom':
        if (!Array.isArray(value)) {
          console.warn('filterUpdate: Invalid value for filter.');
        }
        filterList[index] = value;
        break;
      default:
        filterList[index] = filterPos >= 0 || value === '' ? [] : [value];
    }
  }

  filterUpdate = (index, value, type, next) => {
    this.setState(
      prevState => {
        const filterList = prevState.filterList.slice(0);
        this.updateFilterByType(filterList, index, value, type);

        return {
          page: 0,
          filterList: filterList,
          displayData: this.options.serverSide
            ? prevState.displayData
            : this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
          previousSelectedRow: null,
        };
      },
      () => {
        this.setTableAction('filterChange');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(index, this.state.filterList);
        }
        next && next(this.state.filterList);
      },
    );
  };

  selectRowDelete = () => {
    const { selectedRows, data, filterList } = this.state;

    const selectedMap = buildMap(selectedRows.data);
    const cleanRows = data.filter(({ index }) => !selectedMap[index]);

    if (this.options.onRowsDelete) {
      if (this.options.onRowsDelete(selectedRows) === false) return;
    }

    this.setTableData(
      {
        columns: this.props.columns,
        data: cleanRows,
        options: {
          filterList: filterList,
        },
      },
      TABLE_LOAD.UPDATE,
      true,
      () => {
        this.setTableAction('rowDelete');
      },
    );
  };

  toggleExpandRow = row => {
    const { dataIndex } = row;
    let removedRow;
    const { isRowExpandable } = this.options;
    let { expandedRows } = this.state;
    const expandedRowsData = [...expandedRows.data];
    let shouldCollapseExpandedRow = false;

    for (var cIndex = 0; cIndex < expandedRowsData.length; cIndex++) {
      if (expandedRowsData[cIndex].dataIndex === dataIndex) {
        shouldCollapseExpandedRow = true;
        break;
      }
    }

    if (shouldCollapseExpandedRow) {
      if (!isRowExpandable || (isRowExpandable && isRowExpandable(dataIndex, expandedRows))) {
        removedRow = expandedRowsData.splice(cIndex, 1);
      }
    } else {
      if (!isRowExpandable || (isRowExpandable && isRowExpandable(dataIndex, expandedRows))) {
        expandedRowsData.push(row);
      }
    }
    let curExpandedRows = removedRow ? removedRow : [row];

    this.setState(
      {
        expandedRows: {
          lookup: buildMap(expandedRowsData),
          data: expandedRowsData,
        },
      },
      () => {
        this.setTableAction('expandRow');
        if (this.options.onRowExpansionChange) {
          this.options.onRowExpansionChange(
            curExpandedRows,
            this.state.expandedRows.data,
            this.state.expandedRows.data.map(item => item.dataIndex),
          );
        }
      },
    );
  };

  // Collapses or expands all expanded rows
  toggleAllExpandableRows = () => {
    let expandedRowsData = [...this.state.expandedRows.data];
    const { isRowExpandable } = this.options;
    let affecttedRows = [];

    if (expandedRowsData.length > 0) {
      // collapse all
      
      for (let ii = expandedRowsData.length - 1; ii >= 0; ii--) {
        let item = expandedRowsData[ii];
        if (!isRowExpandable || (isRowExpandable && isRowExpandable(item.dataIndex, this.state.expandedRows))) {
          affecttedRows.push(expandedRowsData.splice(ii, 1));
        }
      }

    } else {
      // expand all

      for (let ii = 0; ii < this.state.data.length; ii++) {
        let item = this.state.data[ii];
        if (!isRowExpandable || (isRowExpandable && isRowExpandable(item.dataIndex, this.state.expandedRows))) {
          if ( this.state.expandedRows.lookup[item.index] !== true ) {
            let newItem = {
              index: ii,
              dataIndex: item.index
            };
            expandedRowsData.push(newItem);
            affecttedRows.push(newItem);
          }
        }
      }
    }

    this.setState(
      {
        expandedRows: {
          lookup: buildMap(expandedRowsData),
          data: expandedRowsData,
        },
      },
      () => {
        this.setTableAction('expandRow');
        if (this.options.onRowExpansionChange) {
          this.options.onRowExpansionChange(
            affecttedRows,
            this.state.expandedRows.data,
            this.state.expandedRows.data.map(item => item.dataIndex),
          );
        }
      },
    );
  }

  areAllRowsExpanded = () => {
    return this.state.expandedRows.data.length === this.state.data.length;
  }

  selectRowUpdate = (type, value, shiftAdjacentRows = []) => {
    // safety check
    const { selectableRows } = this.options;
    if (selectableRows === 'none') {
      return;
    }

    if (type === 'head') {
      const { isRowSelectable } = this.options;
      this.setState(
        prevState => {
          const { displayData, selectedRows: prevSelectedRows } = prevState;
          const selectedRowsLen = prevState.selectedRows.data.length;
          let isDeselect =
            selectedRowsLen === displayData.length || (selectedRowsLen < displayData.length && selectedRowsLen > 0);

          let selectedRows = displayData.reduce((arr, d, i) => {
            const selected = isRowSelectable ? isRowSelectable(displayData[i].dataIndex, prevSelectedRows) : true;
            selected && arr.push({ index: i, dataIndex: displayData[i].dataIndex });
            return arr;
          }, []);

          let newRows = [...selectedRows];
          let selectedMap = buildMap(newRows);

          // if the select toolbar is disabled, the rules are a little different
          if (this.options.disableSelectToolbar === true) {
            if (selectedRowsLen > displayData.length) {
              isDeselect = true;
            } else {
              for (let ii = 0; ii < displayData.length; ii++) {
                if (!selectedMap[displayData[ii].dataIndex]) {
                  isDeselect = true;
                }
              }
            }
          }

          if (isDeselect) {
            newRows = prevState.selectedRows.data.filter(({ dataIndex }) => !selectedMap[dataIndex]);
            selectedMap = buildMap(newRows);
          }

          return {
            curSelectedRows: newRows,
            selectedRows: {
              data: newRows,
              lookup: selectedMap,
            },
            previousSelectedRow: null,
          };
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              this.state.curSelectedRows,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          }
        },
      );
    } else if (type === 'cell') {
      this.setState(
        prevState => {
          const { dataIndex } = value;
          let selectedRows = [...prevState.selectedRows.data];
          let rowPos = -1;

          for (let cIndex = 0; cIndex < selectedRows.length; cIndex++) {
            if (selectedRows[cIndex].dataIndex === dataIndex) {
              rowPos = cIndex;
              break;
            }
          }

          if (rowPos >= 0) {
            selectedRows.splice(rowPos, 1);

            // handle rows affected by shift+click
            if (shiftAdjacentRows.length > 0) {
              let shiftAdjacentMap = buildMap(shiftAdjacentRows);
              for (let cIndex = selectedRows.length - 1; cIndex >= 0; cIndex--) {
                if (shiftAdjacentMap[selectedRows[cIndex].dataIndex]) {
                  selectedRows.splice(cIndex, 1);
                }
              }
            }
          } else if (selectableRows === 'single') {
            selectedRows = [value];
          } else {
            // multiple
            selectedRows.push(value);

            // handle rows affected by shift+click
            if (shiftAdjacentRows.length > 0) {
              let selectedMap = buildMap(selectedRows);
              shiftAdjacentRows.forEach(aRow => {
                if (!selectedMap[aRow.dataIndex]) {
                  selectedRows.push(aRow);
                }
              });
            }
          }

          return {
            selectedRows: {
              lookup: buildMap(selectedRows),
              data: selectedRows,
            },
            previousSelectedRow: value,
          };
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              [value],
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          }
        },
      );
    } else if (type === 'custom') {
      const { displayData } = this.state;

      const data = value.map(row => ({ index: row, dataIndex: displayData[row].dataIndex }));
      const lookup = buildMap(data);

      this.setState(
        {
          selectedRows: { data, lookup },
          previousSelectedRow: null,
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              this.state.selectedRows.data,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          }
        },
      );
    }
  };

  sortTable(data, col, order) {
    let dataSrc = this.options.customSort ? this.options.customSort(data, col, order || 'desc') : data;

    let sortedData = dataSrc.map((row, sIndex) => ({
      data: row.data[col],
      rowData: row.data,
      position: sIndex,
      rowSelected: this.state.selectedRows.lookup[row.index] ? true : false,
    }));

    if (!this.options.customSort) {
      sortedData.sort(sortCompare(order));
    }

    let tableData = [];
    let selectedRows = [];

    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      tableData.push(dataSrc[row.position]);
      if (row.rowSelected) {
        selectedRows.push({ index: i, dataIndex: dataSrc[row.position].index });
      }
    }

    return {
      data: tableData,
      selectedRows: {
        lookup: buildMap(selectedRows),
        data: selectedRows,
      },
    };
  }

  setTableRef = (el) => (this.tableRef = el)
  handleHeadUpdateRef = (fn) => (this.updateToolbarSelect = fn)

  render() {
    const { classes, className, title } = this.props;
    const {
      announceText,
      activeColumn,
      data,
      displayData,
      columns,
      page,
      filterData,
      filterList,
      selectedRows,
      previousSelectedRow,
      expandedRows,
      searchText,
      sortOrder,
    } = this.state;

    const rowCount = this.state.count || displayData.length;
    const rowsPerPage = this.options.pagination ? this.state.rowsPerPage : displayData.length;
    const showToolbar = hasToolbarItem(this.options, title);
    const columnNames = columns.map(column => ({ name: column.name, filterType: column.filterType }));

    let tableProps = Object.assign({}, this.options.tableProps);
    let tableClassNames = classnames(classes.tableRoot, tableProps.className);
    delete tableProps.className; // remove className from props to avoid the className being applied twice

    return (
      <Paper
        elevation={this.options.elevation}
        ref={this.tableContent}
        className={classnames(classes.paper, className)}>
        {selectedRows.data.length && this.options.disableSelectToolbar !== true ? (
          <TableToolbarSelect
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
            displayData={displayData}
            selectRowUpdate={this.selectRowUpdate} />
        ) : (
          showToolbar && (
            <TableToolbar
              columns={columns}
              displayData={displayData}
              data={data}
              filterData={filterData}
              filterList={filterList}
              filterPopoverOptions={this.options.filterPopoverOptions}
              filterUpdate={this.filterUpdate}
              options={this.options}
              clearFilters={this.clearFilters}
              searchText={searchText}
              searchTextUpdate={this.searchTextUpdate}
              searchClose={this.searchClose}
              setTableAction={this.setTableAction}
              tableRef={this.getTableContentRef}
              title={title}
              toggleViewColumn={this.toggleViewColumn} 
              updateFilterByType={this.updateFilterByType} />
          )
        )}
        <TableFilterList
          options={this.options}
          filterListRenderers={columns.map(c => {
            return c.customFilterListRender ? c.customFilterListRender : f => f;
          })}
          filterList={filterList}
          filterUpdate={this.filterUpdate}
          columnNames={columnNames} />
        <div style={{ 
            position: 'relative', 
            height: this.options.tableBodyHeight,
          }} 
          className={classes.tableWrapper}>
          {this.options.resizableColumns && (
            <TableResize
              key={rowCount}
              updateDividers={fn => (this.updateDividers = fn)}
              setResizeable={fn => (this.setHeadResizeable = fn)} />
          )}
          <MuiTable
            ref={this.setTableRef}
            tabIndex={'0'}
            role={'grid'}
            className={tableClassNames}
            {...tableProps}>
            <caption className={classes.caption}>{title}</caption>
            <TableHead
              columns={columns}
              activeColumn={activeColumn}
              data={displayData}
              count={rowCount}
              page={page}
              rowsPerPage={rowsPerPage}
              handleHeadUpdateRef={this.handleHeadUpdateRef}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              toggleSort={this.toggleSortColumn}
              setCellRef={this.setHeadCellRef}
              expandedRows={expandedRows}
              toggleAllExpandableRows={this.toggleAllExpandableRows}
              areAllRowsExpanded={this.areAllRowsExpanded}
              sortOrder={sortOrder}
              options={this.options} />
            <TableBody
              data={displayData}
              count={rowCount}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              previousSelectedRow={previousSelectedRow}
              expandedRows={expandedRows}
              toggleExpandRow={this.toggleExpandRow}
              options={this.options}
              filterList={filterList} />
          </MuiTable>
        </div>
        <TableFooter
          options={this.options}
          page={page}
          rowCount={rowCount}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={this.changeRowsPerPage}
          changePage={this.changePage} />
        <div className={classes.liveAnnounce} aria-live={'polite'}>
          {announceText}
        </div>
      </Paper>
    );
  }
}

export default withStyles(defaultTableStyles, { name: 'MUIDataTable' })(MUIDataTable);
