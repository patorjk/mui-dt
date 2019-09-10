import { Grid, GridList, GridListTile, TextField } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '24px 24px 36px 24px',
    fontFamily: 'Roboto',
  },
  header: {
    flex: '0 0 auto',
    marginBottom: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'inline-block',
    marginLeft: '7px',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 500,
  },
  noMargin: {
    marginLeft: '0px',
  },
  actionButtons: {
    '@media screen and (max-width: 800px)': {
      marginTop: '14px',
    },
  },
  confirmButton: {
    marginLeft: '0px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  toolbar: {
    alignSelf: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    width:'100%',
  },
  withConfirm: {
    '@media screen and (max-width: 800px)': {
      display: 'block',
    },
  },
  menuButtons: {
    marginLeft: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    '@media screen and (max-width: 800px)': {
      marginLeft: 0
    },
  },
  normalToolbarButtons: {
    marginLeft: '16px',
    fontSize: '12px',
    cursor: 'pointer',
  },  
  filtersSelected: {
    alignSelf: 'right',
  },
  /* checkbox */
  checkboxListTitle: {
    marginLeft: '7px',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },
  checkboxFormGroup: {
    marginTop: '8px',
  },
  checkboxFormControl: {
    margin: '0px',
  },
  checkboxFormControlLabel: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
  checkboxIcon: {
    width: '32px',
    height: '32px',
  },
  gridListTile: {
    marginTop: '16px',
  },
}), { name: 'MUIDataTableFilter' });

function TableFilter(props) {

  const classes = useStyles();
  const [filterList, setFilterList] = useState( cloneDeep(props.filterList) );

  const filterUpdate = (index, value, column, type) => {
    let newFilterList = filterList.slice(0);
    props.updateFilterByType(newFilterList, index, value, column, type);
    setFilterList(newFilterList);
  };

  const handleCheckboxChange = (index, value, column) => {
    filterUpdate(index, value, column, 'checkbox');

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterUpdate(index, value, column, 'checkbox');
    }
  };

  const handleDropdownChange = (event, index, column) => {
    const labelFilterAll = props.options.textLabels.filter.all;
    const value = event.target.value === labelFilterAll ? [] : [event.target.value];
    
    filterUpdate(index, value, column, 'dropdown');

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterUpdate(index, value, column, 'dropdown');
    }
  };

  const handleMultiselectChange = (index, value, column) => {
    filterUpdate(index, value, column, 'multiselect');

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterUpdate(index, value, column, 'multiselect');
    }
  };

  const handleTextFieldChange = (event, index, column) => {
    filterUpdate(index, event.target.value, column, 'textField');

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterUpdate(index, event.target.value, column, 'textField');
    }
  };

  const handleCustomChange = (value, index, column) => {
    filterUpdate(index, value, column.name, column.filterType);

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterUpdate(index, value, column.name, column.filterType);
    }
  };

  const renderCheckbox = (column, index) => {
    const { filterData, options } = props;

    return (
      <GridListTile key={index} cols={2}>
        <FormGroup>
          <Grid item xs={12}>
            <Typography variant="body2" className={classes.checkboxListTitle}>
              {column.label}
            </Typography>
          </Grid>
          <Grid container>
            {filterData[index].map((filterValue, filterIndex) => (
              <Grid item key={filterIndex}>
                <FormControlLabel
                  key={filterIndex}
                  classes={{
                    root: classes.checkboxFormControl,
                    label: classes.checkboxFormControlLabel,
                  }}
                  control={
                    <Checkbox
                      className={classes.checkboxIcon}
                      onChange={(e) => handleCheckboxChange(index, filterValue, column.name)}
                      checked={filterList[index].indexOf(filterValue) >= 0 ? true : false}
                      color={options.checkboxColor}
                      value={filterValue != null ? filterValue.toString() : ''}
                    />
                  }
                  label={filterValue}
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </GridListTile>
    );
  };

  const renderSelect = (column, index) => {
    const { filterData, options } = props;
    const textLabels = options.textLabels.filter;

    return (
      <GridListTile key={index} cols={1} classes={{ tile: classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            fullWidth
            value={filterList[index].length ? filterList[index].toString() : textLabels.all}
            name={column.name}
            onChange={event => handleDropdownChange(event, index, column.name)}
            input={<Input name={column.name} id={column.name} />}>
            <MenuItem value={textLabels.all} key={0}>
              {textLabels.all}
            </MenuItem>
            {filterData[index].map((filterValue, filterIndex) => (
              <MenuItem value={filterValue} key={filterIndex + 1}>
                {filterValue != null ? filterValue.toString() : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GridListTile>
    );
  };

  const renderTextField = (column, index) => {
    return (
      <GridListTile key={index} cols={1} classes={{ tile: classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <TextField
            fullWidth
            label={column.label}
            value={filterList[index].toString() || ''}
            onChange={event => handleTextFieldChange(event, index, column.name)}
          />
        </FormControl>
      </GridListTile>
    );
  };

  const renderMultiselect = (column, index) => {
    const { filterData, options } = props;

    return (
      <GridListTile key={index} cols={1} classes={{ tile: classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            multiple
            fullWidth
            value={filterList[index] || []}
            renderValue={selected => selected.join(', ')}
            name={column.name}
            onChange={event => handleMultiselectChange(index, event.target.value, column.name)}
            input={<Input name={column.name} id={column.name} />}>
            {filterData[index].map((filterValue, filterIndex) => (
              <MenuItem value={filterValue} key={filterIndex + 1}>
                <Checkbox
                  checked={filterList[index].indexOf(filterValue) >= 0 ? true : false}
                  value={filterValue != null ? filterValue.toString() : ''}
                  className={classes.checkboxIcon}
                  color={options.checkboxColor}
                />
                <ListItemText primary={filterValue} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GridListTile>
    );
  };

  const renderCustomField = (column, index) => {
    const { options } = props;
    const display =
      (column.filterOptions && column.filterOptions.display) ||
      (options.filterOptions && options.filterOptions.display);

    if (!display) {
      console.error('Property "display" is required when using custom filter type.');
      return;
    }

    return (
      <GridListTile key={index} cols={1} classes={{ tile: classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          {display(filterList, handleCustomChange, index, column)}
        </FormControl>
      </GridListTile>
    );
  };

  const applyFilters = () => {
    filterList.forEach( (filter, index) => {
      props.onFilterUpdate(index, filter, columns[index].name, 'custom');
    });
    props.handleClose();

    if (options.onFilterConfirm) {
      options.onFilterConfirm(filterList);
    }
  };

  // only available when filters need to be confirmed
  const resetFilters = () => {
    setFilterList(props.filterList.map(item => item.slice()));
  };

  const clearFilters = () => {
    setFilterList(filterList.map(item => []));

    if (props.filterPopoverOptions.mustConfirm !== true) {
      props.onFilterClear();
    }
  };

  const { columns, options } = props;
  const textLabels = options.textLabels.filter;
  const filterGridColumns = columns.filter(col => col.filter).length === 1 ? 1 : 2;
  
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classNames({
              [classes.toolbar]: true,
              [classes.withConfirm]: props.filterPopoverOptions.mustConfirm
            })}>
          <Typography
            variant="body2"
            className={classNames({
              [classes.title]: true,
            })}>
            {textLabels.title}
          </Typography>
          <div className={classNames({
              [classes.actionButtons]: props.filterPopoverOptions.mustConfirm
            })}>
            {props.filterPopoverOptions.mustConfirm &&
              <>
              <Button
                color="primary"
                variant="contained" 
                className={classes.confirmButton}
                tabIndex={0}
                aria-label={props.filterPopoverOptions.confirmButtonLabel}
                data-testid={'filterConfirm-button'}
                onClick={applyFilters}>
                {props.filterPopoverOptions.confirmButtonLabel}
              </Button>
              <Button
                color="primary"
                className={classNames({
                  [classes.normalToolbarButtons]: props.filterPopoverOptions.mustConfirm ? false : true,
                  [classes.menuButtons]: props.filterPopoverOptions.mustConfirm ? true : false,
                })}
                tabIndex={0}
                aria-label={textLabels.reset}
                data-testid={'filterReset-button'}
                onClick={resetFilters}>
                {textLabels.reset}
              </Button>
              </>
            }
            <Button
              color="primary"
              className={classNames({
                [classes.normalToolbarButtons]: props.filterPopoverOptions.mustConfirm ? false : true,
                [classes.menuButtons]: props.filterPopoverOptions.mustConfirm ? true : false,
              })}
              tabIndex={0}
              aria-label={textLabels.clear}
              data-testid={'filterClear-button'}
              onClick={clearFilters}>
              {textLabels.clear}
            </Button>
          </div>
        </div>
        <div className={classes.filtersSelected} />
      </div>
      <GridList cellHeight="auto" cols={filterGridColumns} spacing={34}>
        {columns.map((column, index) => {
          if (column.filter) {
            const filterType = column.filterType || options.filterType;
            return filterType === 'checkbox'
              ? renderCheckbox(column, index)
              : filterType === 'multiselect'
              ? renderMultiselect(column, index)
              : filterType === 'textField'
              ? renderTextField(column, index)
              : filterType === 'custom'
              ? renderCustomField(column, index)
              : renderSelect(column, index);
          }
        })}
      </GridList>
    </div>
  );
}

TableFilter.propTypes = {
  /** Data used to populate filter dropdown/checkbox */
  filterData: PropTypes.array.isRequired,
  /** Data selected to be filtered against dropdown/checkbox */
  filterList: PropTypes.array.isRequired,
  /** Options for the filter popover */
  filterPopoverOptions: PropTypes.object.isRequired,
  /** Callback to trigger filter clear */
  onFilterClear: PropTypes.func,
  /** Callback to trigger filter update */
  onFilterUpdate: PropTypes.func,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
};

export default TableFilter;
