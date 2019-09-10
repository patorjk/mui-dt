<div align="center">  
  <img src="https://user-images.githubusercontent.com/19170080/34070522-e15d32e2-e235-11e7-8af5-fa704cdcad56.png" />  
</div>

# MUI-DT - Datatables for Material-UI

[![Build Status](https://travis-ci.org/patorjk/mui-dt.svg?branch=master)](https://travis-ci.org/patorjk/mui-dt)
[![Coverage Status](https://coveralls.io/repos/github/patorjk/mui-dt/badge.svg?branch=master)](https://coveralls.io/github/patorjk/mui-dt?branch=master)
[![npm version](https://badge.fury.io/js/mui-dt.svg)](https://badge.fury.io/js/mui-dt)

MUI-DT is a data tables component built on [Material-UI](https://www.material-ui.com).  It comes with features like responsive modes for mobile/tablet devices, filtering, resizable + view/hide columns, search, export to CSV download, printing, selectable rows, expandable rows, pagination, and sorting. 

You can try the table out live in a CodeSandbox here: https://codesandbox.io/s/github/patorjk/mui-dt

<div align="center">
	<img src="https://user-images.githubusercontent.com/19170080/38026128-eac9d506-3258-11e8-92a7-b0d06e5faa82.gif" />
</div>

## Install

`npm install mui-dt --save`

## Usage

For a simple table:

```js

import MuiDt from "mui-dt";

const columns = ["Name", "Company", "City", "State"];

const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT"],
 ["Bob Herm", "Test Corp", "Tampa", "FL"],
 ["James Houston", "Test Corp", "Dallas", "TX"],
];

const options = {
  filterType: 'checkbox',
};

<MuiDt
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>

```

Or customize columns:

```js

import MuiDt from "mui-dt";

const columns = [
 {
  name: "name",
  label: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "company",
  label: "Company",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "city",
  label: "City",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "state",
  label: "State",
  options: {
   filter: true,
   sort: false,
  }
 },
];

const data = [
 { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
 { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
 { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
 { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
];

const options = {
  filterType: 'checkbox',
};

<MuiDt
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>

```

## API


#### &lt;MUIDT />

The component accepts the following props:

|Name|Type|Description
|:--:|:-----|:-----|
|**`columns`**|array|Columns used to describe table. Must be either an array of simple strings or objects describing a column
|**`data`**|array|Data used to describe table. Must be an array containing objects. (Arrays containing just strings or numbers also supported)
|**`options`**|object|Options used to describe table
|**`title`**|array|Title used to caption table

#### Options:
|Name|Type|Default|Description
|:--:|:-----|:--|:-----|
|**`caseSensitive `**|boolean|false|Enable/disable case sensitivity for search.
|**`checkboxColor `**|string|'primary'|Color of the checkbox. Options are: 'primary', 'secondary', 'default'.
|**`customFooter`**|function||Render a custom table footer. `function(count, page, rowsPerPage, changeRowsPerPage, changePage, `[`textLabels: object`](https://github.com/patorjk/mui-dt/blob/master/src/textLabels.js)`) => string`&#124;` React Component` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-footer/index.js)
|**`customRowRender `**|function||Override default row rendering with custom function. `customRowRender(data, dataIndex, rowIndex) => React Component`
|**`customSearch `**|function||Override default search with custom function. `customSearch(searchQuery: string, currentRow: array, columns: array) => boolean`
|**`customSearchRender `**|function||Render a custom table search. `customSearchRender(searchText: string, handleSearch, hideSearch, options) => React Component`
|**`customSort`**|function||Override default sorting with custom function. `function(data: array, colIndex: number, order: string) => array`
|**`customToolbar`**|function||Render a custom toolbar.
|**`customToolbarSelect`**|function||Render a custom selected rows toolbar. `function(selectedRows, displayData, setSelectedRows) => void`
|**`count`**|number||User provided override for total number of rows.
|**`disableToolbarSelect`**|boolean|false|Enable/disable the Select Toolbar that appears when a row is selected.
|**`download`**|boolean|true|Show/hide download icon from toolbar.
|**`downloadOptions`**|object|`{filename: 'tableDownload.csv', separator: ','}`|Options to change the output of the CSV file: `filename`: string, `separator`: string, `filterOptions`: object(`useDisplayedColumnsOnly`: boolean, `useDisplayedRowsOnly`: boolean)
|**`elevation`**|number|4|Shadow depth applied to Paper component.
|**`expandableRows`**|boolean|false|Enable/disable expandable rows.
|**`expandableRowsOnClick`**|boolean|false|Enable/disable expand trigger when row is clicked. When False, only expand icon will trigger this action.
|**`filter`**|boolean|true|Show/hide filter icon from toolbar.
|**`filterType `**|string||Choice of filtering view. `enum('checkbox', 'dropdown', 'multiselect', 'textField')`
|**`filterPopoverOptions`**|object|`{mustConfirm: false, confirmButtonLabel: 'Submit'}`|Options to change the filter popover. Can be useful for serverSide filtering where you want to confirm the filters before applying them. Options: `mustConfirm`: boolean, `confirmButtonLabel`: string
|**`fixedHeader`**|boolean|true|Enable/disable fixed header columns.
|**`isRowExpandable`**|function||Enable/disable expansion or collapse on certain expandable rows with custom function. Will be considered true if not provided. `function(dataIndex: number, expandedRows: object(lookup: {dataIndex: number}, data: arrayOfObjects: {index: number, dataIndex: number})) => bool`.
|**`isRowSelectable`**|function||Enable/disable selection on certain rows with custom function. Returns true if not provided. `function(dataIndex: number, selectedRows: object(lookup: {[dataIndex]: boolean}, data: arrayOfObjects: {index: number, dataIndex: number})) => boolean`.
|**`onCellClick`**|function||Callback function that triggers when a cell is clicked. `function(colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => void`
|**`onChangePage`**|function||Callback function that triggers when a page has changed. `function(currentPage: number) => void`
|**`onChangeRowsPerPage`**|function||Callback function that triggers when the number of rows per page has changed. `function(numberOfRows: number) => void`
|**`onColumnSortChange`**|function||Callback function that triggers when a column has been sorted. `function(changedColumn: string, direction: string) => void`
|**`onColumnViewChange`**|function||Callback function that triggers when a column view has been changed. `function(changedColumn: string, action: string) => void`
|**`onDownload`**|function||A callback function that triggers when the user downloads the CSV file. In the callback, you can control what is written to the CSV file. `function(buildHead: (columns) => string, buildBody: (data) => string, columns, data) => string`. Return `false` to cancel download of file.
|**`onFilterChange`**|function||Callback function that triggers when filters have changed. `function(changedColumnName: string, filterList: array, changedColumnIndex: number) => void`
|**`onFilterConfirm`**|function||Callback function that is triggered when a user presses the "confirm" button on the filter popover. This occurs only if you've set filterPopoverOptions.mustConfirm option to true. `function(filterList: array) => void`
|**`onRowClick`**|function||Callback function that triggers when a row is clicked. `function(rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => void`
|**`onRowsDelete`**|function||Callback function that triggers when row(s) are deleted. `function(rowsDeleted: object(lookup: {[dataIndex]: boolean}, data: arrayOfObjects: {index: number, dataIndex: number})) => void OR false` (Returning `false` prevents row deletion.)
|**`onRowsExpand`**|function||Callback function that triggers when a row is expanded or collapsed. The rowsExpanded parameter can be used to save off the value for options.rowsExpanded for state changes. `function(affectedRows: array, allRowsExpanded: array, rowsExpanded: array) => void` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/expandable-rows/index.js)
|**`onRowsSelect`**|function||Callback function that triggers when row(s) are selected. If setting state, the rowsSelected parameter can be used to set options.rowsSelected. `function(newRowsSelected: array, allRowsSelected: array, rowsSelected: rowsSelected) => void` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/selectable-rows/index.js)
|**`onSearchChange`**|function||Callback function that triggers when the search text value has changed. `function(searchText: string) => void`
|**`onSearchClose`**|function||Callback function that triggers when the searchbox closes. `function() => void`
|**`onSearchOpen`**|function||Callback function that triggers when the searchbox opens. `function() => void`
|**`onTableChange`**|function||Callback function that triggers when table state has changed. `function(action: string, tableState: object) => void`
|**`onTableInit`**|function||Callback function that triggers when table state has been initialized. `function(action: string, tableState: object) => void`
|**`page`**|number||User provided starting page for pagination.
|**`pagination`**|boolean|true|Enable/disable pagination.
|**`print`**|boolean|true|Show/hide print icon from toolbar.
|**`renderExpandableRow`**|function||Render expandable row. `function(rowData, rowMeta) => React Component`
|**`resizableColumns`**|boolean|false|Enable/disable resizable columns.
|**`responsive`**|string|'stacked'|The responsive mode for the table. Options: 'stacked' or 'scroll'. Use the 'tableBodyMaxHeight' and 'tableBodyMinHeight' options to adjust the table height when using the "scroll" mode.
|**`rowHover`**|boolean|true|Enable/disable hover style over rows.
|**`rowsExpanded`**|array||User provided expanded rows.
|**`rowsPerPage`**|number|10|Number of rows allowed per page.
|**`rowsPerPageOptions`**|array|[10,15,100]|Options to provide in pagination for number of rows a user can select.
|**`rowsSelected`**|array||User provided selected rows.
|**`selectableRows`**|string|'multiple'|Numbers of rows that can be selected. Options are 'multiple', 'single', 'none'.
|**`selectableRowsHeader`**|boolean|true|Show/hide the select all/deselect all checkbox header for selectable rows.
|**`selectableRowsOnClick`**|boolean|false|Enable/disable select toggle when row is clicked. When False, only checkbox will trigger this action.
|**`search`**|boolean|true|Show/hide search icon from toolbar.
|**`searchText`**|string||Initial search text.
|**`searchProps`**|object|{}|Props applied to the search text box. You can set the placeholder text this way as well as add method callbacks like onBlur, onKeyUp, etc. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-search/index.js)
|**`setRowProps`**|function||Is called for each row and allows you to return custom props for this row based on its data. `function(row: array, dataIndex: number) => object` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-styling/index.js)
|**`serverSide`**|boolean|false|Enable remote data source. When setting this option to true, the developer is responsible for the filtering, sorting, etc, of the data and for updating the options and columns inputs to the table (ex: sortDirection on a sorted column would need to be updated). [Example](https://github.com/patorjk/mui-dt/blob/master/examples/serverside-pagination/index.js)
|**`showSearch`**|boolean|false|Shows the search bar when the table toolbar rendered. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-search/index.js)
|**`sort`**|boolean|true|Enable/disable sort on all columns.
|**`sortFilterList`**|boolean|true|Enable/disable alphanumeric sorting of filter lists.
|**`tableProps`**|object|{}|Props applied to the table. You can set the table up to be a "dense" table this way. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-styling/index.js)
|**`tableBodyMaxHeight`**|string|'499px'|The max height of the body of the table. This comes into play only when the responsive mode is set to "scroll". This is a CSS string value (ex: '500px', 'none', '100%', etc). [Example](https://github.com/patorjk/mui-dt/blob/master/examples/data-as-objects/index.js)
|**`tableBodyMinHeight`**|string|'none'|The min height of the body of the table. This comes into play only when the responsive mode is set to "scroll". This is a CSS string value (ex: '500px', 'none', '100%', etc). [Example](https://github.com/patorjk/mui-dt/blob/master/examples/data-as-objects/index.js)
|**`textLabels `**|object||User provided labels to localize text
|**`viewColumns`**|boolean|true|Show/hide viewColumns icon from toolbar.

## Customize Columns

On each column object, you have the ability to customize columns to your liking with the 'options' property. Example:

```js
const columns = [
 {
  name: "Name",
  options: {
   filter: true,
   sort: false
  }
 },
 ...
];
```

#### Column:
|Name|Type|Description
|:--:|:-----|:-----|
|**`name`**|string|Name of column (This field is required)
|**`label`**|string|Column Header Name override
|**`options`**|object|Options for customizing column


#### Column Options:
|Name|Type|Default|Description
|:--:|:-----|:--|:-----|
|**`customBodyRender`**|function||Function that returns a string or React component. Used as display data within all table cells of a given column. `function(value, tableMeta, updateValue) => string`&#124;` React Component` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/component/index.js)
|**`customHeadRender`**|function||Function that returns a string or React component. Used as display for column header. `function(columnMeta, handleToggleColumn) => string`&#124;` React Component`
|**`display`**|string|'true'|Display column in table. `enum('true', 'false', 'excluded')`
|**`download`**|boolean|true|Display column in CSV download file.
|**`empty`**|boolean|false|This denotes whether the column has data or not (for use with intentionally empty columns).
|**`filter`**|boolean|true|Display column in filter list.
|**`filterList`**|array||Filter value list. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/column-filters/index.js)
|**`filterOptions`**|{names, logic, display}||With filter options, it's possible to use custom names for the filter fields. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/column-filters/index.js), custom filter logic [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-filter/index.js), and custom rendering. [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-filter/index.js)
|**`customFilterListRender`**|function||Function that returns a string used as the chip label. `function(value) => string` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/column-filters/index.js)
|**`filterType `**|string|'dropdown'|Choice of filtering view. Takes priority over global filterType option.`enum('checkbox', 'dropdown', 'multiselect', 'textField', 'custom')` Use 'custom' if you are supplying your own rendering via `filterOptions`.
|**`hint`**|string||Display hint icon with string as tooltip on hover.
|**`print`**|boolean|true|Display column when printing.
|**`searchable`**|boolean|true|Exclude/include column from search results.
|**`setCellProps`**|function||Is called for each cell and allows to you return custom props for this cell based on its data. `function(cellValue: string, rowIndex: number, columnIndex: number) => object` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-styling/index.js)
|**`setCellHeaderProps`**|function||Is called for each header cell and allows you to return custom props for the header cell based on its data. `function(columnMeta: object) => object` [Example](https://github.com/patorjk/mui-dt/blob/master/examples/customize-styling/index.js)
|**`sort`**|boolean|true|Enable/disable sorting on column.
|**`sortDirection`**|string||Set default sort order. `enum('asc', 'desc', 'none')`
|**`viewColumns`**|boolean|true|Allow user to toggle column visibility through 'View Column' list.

`customHeadRender` is called with these arguments:

```js
function(columnMeta: {
  customHeadRender: func,
  display: enum('true', 'false', 'excluded'),
  filter: boolean,
  sort: boolean,
  sortDirection: boolean,
  download: boolean,
  empty: boolean,
  index: number,
  label: string,
  name: string,
  print: boolean,
  searchable: boolean,
  viewColumns: boolean
}, handleToggleColumn: function(columnIndex))
```


`customBodyRender` is called with these arguments:

```js
function(value: any, tableMeta: {
  rowIndex: number,
  columnIndex: number,
  columnData: array, // Columns Options object
  rowData: array, // Full row data
  tableData: array, Full table data
  tableState: {
    announceText: null|string,
    page: number,
    rowsPerPage: number,
    filterList: array,
    selectedRows: {
      data: array,
      lookup: object,
    },
    showResponsive: boolean,
    searchText: null|string,
  },
}, updateValue: function)
```

## Customize Styling

Using Material-UI theme overrides will allow you to customize styling to your liking. First, determine which component you would want to target and then lookup the override classname. Let's start with a simple example where we will change the background color of a body cell to be red:

```js
import React from "react";
import MuiDt from "mui-dt";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

class BodyCellExample extends React.Component {

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FF0000"
        }
      }
    }
  })

  render() {

    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MuiDt title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </MuiThemeProvider>
    );

  }
}

```

## Remote Data

If you are looking to work with remote data sets or handle pagination, filtering, and sorting on a remote server you can do that with the following options:

```js
const options = {
  serverSide: true,
  onTableChange: (action, tableState) => {
    this.xhrRequest('my.api.com/tableData', result => {
      this.setState({ data: result });
    });
  }
};
```

To see an example **[Click Here](https://github.com/patorjk/mui-dt/blob/master/examples/serverside-pagination/index.js)**

## Localization

This package decided that the cost of bringing in another library to perform localizations would be too expensive. Instead the ability to override all text labels (which aren't many) is offered through the options property `textLabels`.  The available strings:

```js
const options = {
  ...
  textLabels: {
    body: {
      noMatch: "Sorry, no matching records found",
      toolTip: "Sort",
    },
    pagination: {
      next: "Next Page",
      previous: "Previous Page",
      rowsPerPage: "Rows per page:",
      displayRows: "of",
    },
    toolbar: {
      search: "Search",
      downloadCsv: "Download CSV",
      print: "Print",
      viewColumns: "View Columns",
      filterTable: "Filter Table",
    },
    filter: {
      all: "All",
      title: "FILTERS",
      reset: "RESET",
    },
    viewColumns: {
      title: "Show Columns",
      titleAria: "Show/Hide Table Columns",
    },
    selectedRows: {
      text: "row(s) selected",
      delete: "Delete",
      deleteAria: "Delete Selected Rows",
    },
  }
  ...
}
```

## Breaking Changes with mui-datatables
This library started as a fork of mui-datatables, developed to solve several pain points I was having and to add several additional features. I'm aiming to keep it similar enough so that someone could use this as a drop in replacement (or, if the maintainer of mui-datatables decides to allow more features in - to hopefully merge this library into that library), however, the more I work on this library, the more it will evolve. Below I list "breaking" changes with mui-datatables.

* The "resetFilters" event that occurs for the onTableChange function is now called "clearFilters". (reason: with the addition of filterPopoverOptions and the ability to confirm filters, there needed to be a reset and a clear function. "reset" already existed and functioned as a "clear", so it was renamed)

## Contributing
Thanks for taking an interest in the library and the github community!

The following commands should get you started:

```sh
npm i
npm run dev
```
open  http://localhost:5050/ in browser

After you make your changes locally, you can run the test suite with `npm test`.

## License
The files included in this repository are licensed under the MIT license.

## Thanks

[<img src="https://www.browserstack.com/images/mail/browserstack-logo-footer.png" width="120">](https://www.browserstack.com/)

Thank you to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to test in real browsers.
