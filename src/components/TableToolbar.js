import React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from './Popover';
import TableFilter from './TableFilter';
import TableViewCol from './TableViewCol';
import TableSearch from './TableSearch';
import SearchIcon from '@material-ui/icons/Search';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import FilterIcon from '@material-ui/icons/FilterList';
import ReactToPrint from 'react-to-print';
import { withStyles } from '@material-ui/core/styles';
import { createCSVDownload } from '../utils';

export const defaultToolbarStyles = theme => ({
  root: {},
  left: {
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  actions: {
    //flex: '1 1 auto',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  titleRoot: {},
  titleText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
  },
  icon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  iconActive: {
    color: theme.palette.primary.main,
  },
  filterPaper: {
    maxWidth: '50%',
  },
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px',
  },
  [theme.breakpoints.down('sm')]: {
    titleRoot: {},
    titleText: {
      fontSize: '16px',
    },
    spacer: {
      display: 'none',
    },
    left: {
      padding: '8px 0px',
    },
    actions: {
      textAlign: 'right',
    },
  },
  [theme.breakpoints.down('xs')]: {
    root: {
      display: 'block',
    },
    left: {
      padding: '8px 0px 0px 0px',
    },
    titleText: {
      textAlign: 'center',
    },
    actions: {
      textAlign: 'center',
    },
  },
  '@media screen and (max-width: 480px)': {},
});

class TableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: Boolean(this.props.searchText || this.props.options.searchText || this.props.options.showSearch),
    searchText: this.props.searchText || null,
    filterPopoverKey: 0,
    mustCloseFilterPopover: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
  }

  handleCSVDownload = () => {
    const { data, displayData, columns, options } = this.props;
    let dataToDownload = data;
    let columnsToDownload = columns;

    if (options.downloadOptions && options.downloadOptions.filterOptions) {
      // check rows first:
      if (options.downloadOptions.filterOptions.useDisplayedRowsOnly) {
        dataToDownload = displayData.map((row, index) => {
          let i = -1;

          // Help to preserve sort order in custom render columns
          row.index = index;

          return {
            data: row.data.map(column => {
              i += 1;

              // if we have a custom render, which will appear as a react element, we must grab the actual value from data
              // TODO: Create a utility function for checking whether or not something is a react object
              return typeof column === 'object' && column !== null && !Array.isArray(column) ? data[row.index].data[i] : column;
            }),
          };
        });
      }

      // now, check columns:
      if (options.downloadOptions.filterOptions.useDisplayedColumnsOnly) {
        columnsToDownload = columns.filter((_, index) => _.display === 'true');

        dataToDownload = dataToDownload.map(row => {
          row.data = row.data.filter((_, index) => columns[index].display === 'true');
          return row;
        });
      }
    }
    createCSVDownload(columnsToDownload, dataToDownload, options);
  };

  setActiveIcon = iconName => {
    this.setState(() => ({
      showSearch: this.isSearchShown(iconName),
      iconActive: iconName,
      filterPopoverKey: this.state.filterPopoverKey + 1
    }));
  };

  isSearchShown = iconName => {
    let nextVal = false;
    if (this.state.showSearch) {
      if (this.state.searchText) {
        nextVal = true;
      } else {
        const { onSearchClose } = this.props.options;
        this.props.setTableAction('onSearchClose');
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = this.showSearch();
    }
    return nextVal;
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  showSearch = () => {
    this.props.setTableAction('onSearchOpen');
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    return true;
  };

  hideSearch = () => {
    const { onSearchClose } = this.props.options;

    if (onSearchClose) onSearchClose();
    this.props.searchClose();

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
      searchText: null,
    }));

    this.searchButton.focus();
  };

  handleSearch = value => {
    this.setState({ searchText: value });
    this.props.searchTextUpdate(value);
  };

  render() {
    const {
      classes,
      columns,
      data,
      filterData,
      filterList,
      filterPopoverOptions,
      filterUpdate,
      options,
      clearFilters,
      tableRef,
      title,
      toggleViewColumn,
      updateFilterByType,
    } = this.props;

    const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;
    const { showSearch, searchText } = this.state;

    const filterPopoverExit = () => {
      this.setState({hideFilterPopover: false});
      this.setActiveIcon.bind(null);
    };

    const closeFilterPopover = () => {
      this.setState({hideFilterPopover: true});
    };

    return (
      <Toolbar className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
        <div className={classes.left}>
          {showSearch === true ? (
            options.customSearchRender ? (
              options.customSearchRender(searchText, this.handleSearch, this.hideSearch, options)
            ) : (
              <TableSearch
                searchText={searchText}
                onSearch={this.handleSearch}
                onHide={this.hideSearch}
                options={options}
              />
            )
          ) : typeof title !== 'string' ? (
            title
          ) : (
            <div className={classes.titleRoot} aria-hidden={'true'}>
              <Typography variant="h6" className={classes.titleText}>
                {title}
              </Typography>
            </div>
          )}
        </div>
        <div className={classes.actions}>
          {options.search && (
            <Tooltip title={search} disableFocusListener>
              <IconButton
                aria-label={search}
                data-testid={search + '-iconButton'}
                buttonRef={el => (this.searchButton = el)}
                classes={{ root: this.getActiveIcon(classes, 'search') }}
                onClick={this.setActiveIcon.bind(null, 'search')}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}
          {options.download && (
            <Tooltip title={downloadCsv}>
              <IconButton
                data-testid={downloadCsv + '-iconButton'}
                aria-label={downloadCsv}
                classes={{ root: classes.icon }}
                onClick={this.handleCSVDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          {options.print && (
            <span>
              <ReactToPrint
                trigger={() => (
                  <span>
                    <Tooltip title={print}>
                      <IconButton
                        data-testid={print + '-iconButton'}
                        aria-label={print}
                        classes={{ root: classes.icon }}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
                content={() => this.props.tableRef()}
              />
            </span>
          )}
          {options.viewColumns && (
            <Popover
              refExit={this.setActiveIcon.bind(null)}
              trigger={
                <Tooltip title={viewColumns} disableFocusListener>
                  <IconButton
                    data-testid={viewColumns + '-iconButton'}
                    aria-label={viewColumns}
                    classes={{ root: this.getActiveIcon(classes, 'viewcolumns') }}
                    onClick={this.setActiveIcon.bind(null, 'viewcolumns')}>
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
              }
            />
          )}
          {options.filter && (
            <Popover
              refExit={filterPopoverExit}
              hide={this.state.hideFilterPopover}
              classes={{ paper: classes.filterPaper }}
              trigger={
                <Tooltip title={filterTable} disableFocusListener>
                  <IconButton
                    data-testid={filterTable + '-iconButton'}
                    aria-label={filterTable}
                    classes={{ root: this.getActiveIcon(classes, 'filter') }}
                    onClick={this.setActiveIcon.bind(null, 'filter')}>
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableFilter
                  key={this.state.filterPopoverKey}
                  columns={columns}
                  options={options}
                  filterList={filterList}
                  filterData={filterData}
                  filterPopoverOptions={filterPopoverOptions}
                  handleClose={closeFilterPopover}
                  onFilterUpdate={filterUpdate}
                  onFilterClear={clearFilters}
                  updateFilterByType={updateFilterByType}
                />
              }
            />
          )}
          {options.customToolbar && options.customToolbar()}
        </div>
      </Toolbar>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbar' })(TableToolbar);
