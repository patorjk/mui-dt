import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    margin: '0px 16px 0px 16px',
  },
  chip: {
    margin: '8px 8px 0px 0px',
  },
}, { name: 'MUIDataTableFilterList' });

function TableFilterList(props) {
  
  const classes = useStyles();
  const { filterList, filterUpdate, filterListRenderers, columnNames } = props;

  const removeFilter = (index, filterValue, columnName, filterType) => {

    var removedFilter = filterValue;
    if ( Array.isArray(removedFilter) && removedFilter.length === 0) {
      removedFilter = props.filterList[index];
    }

    filterUpdate(index, filterValue, filterType, (filterList) => {
      if (props.options.onFilterChipClose) {
        props.options.onFilterChipClose(index, removedFilter, filterList);
      }
    });
  };

  return (
    <div className={classes.root}>
      {filterList.map((item, index) => {
        if (columnNames[index].filterType === 'custom' && filterListRenderers[index](item)) {
          return (
            <Chip
              label={filterListRenderers[index](item)}
              key={index}
              onDelete={() => removeFilter(index, [], columnNames[index].name, columnNames[index].filterType)}
              className={classes.chip} />
          );
        }

        return item.map((data, colIndex) => (
          <Chip
            label={filterListRenderers[index](data)}
            key={colIndex}
            onDelete={() => removeFilter(index, data, columnNames[index].name, 'checkbox')}
            className={classes.chip} />
        ));
      })}
    </div>
  );
}

TableFilterList.propTypes = {
  /** Data used to filter table against */
  filterList: PropTypes.array.isRequired,
  /** Filter List value renderers */
  filterListRenderers: PropTypes.array.isRequired,
  /** Columns used to describe table */
  columnNames: PropTypes.PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string.isRequired, filterType: PropTypes.string }),
    ]),
  ).isRequired,
  /** Callback to trigger filter update */
  onFilterUpdate: PropTypes.func,
};

export default TableFilterList;
