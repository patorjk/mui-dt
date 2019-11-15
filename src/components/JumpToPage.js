import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getPageValue } from '../utils';
import classnames from 'classnames';

const defaultStyles = {
  root: {},
  caption: {
    flexShrink: 0,
  },
  /* Styles applied to the Select component root element. */
  selectRoot: {
    // `.selectRoot` should be merged with `.input` in v5.
    marginRight: 32,
    marginLeft: 8,
  },
  /* Styles applied to the Select component `select` class. */
  select: {
    paddingLeft: 8,
    paddingRight: 24,
    textAlign: 'right',
    textAlignLast: 'right', // Align <select> on Chrome.
  },
  /* Styles applied to the Select component `icon` class. */
  selectIcon: {
    top: 1,
  },
  /* Styles applied to the `InputBase` component. */
  input: {
    color: 'inherit',
    fontSize: 'inherit',
    flexShrink: 0,
  },
};

class JumpToPage extends React.Component {
  static propTypes = {
    /** Total number of table rows */
    count: PropTypes.number.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current page index */
    page: PropTypes.number.isRequired,
    /** Total number allowed of rows per page */
    rowsPerPage: PropTypes.number.isRequired,
  };

  handlePageChange = (_, page) => {
    this.props.changePage(page);
  };

  render() {
    const { count, classes, options, rowsPerPage, page, changePage } = this.props;
    const textLabels = options.textLabels.pagination;

    return (
      <>
        <Typography color="inherit" variant="body2" className={classes.caption}>
          Jump to Page:
        </Typography>
        <Select
          classes={{
            select: classes.select,
            icon: classes.selectIcon,
          }}
          input={<InputBase className={classnames(classes.input, classes.selectRoot)} />}
          value={page}
          onChange={onChangeRowsPerPage}
          {...SelectProps}
        >
          {rowsPerPageOptions.map(rowsPerPageOption => (
            <MenuItemComponent
              className={classes.menuItem}
              key={rowsPerPageOption}
              value={rowsPerPageOption.value ? rowsPerPageOption.value : rowsPerPageOption}
            >
              {rowsPerPageOption.label ? rowsPerPageOption.label : rowsPerPageOption}
            </MenuItemComponent>
          ))}
        </Select>
      </>
    );
  }
}

export default withStyles(defaultStyles, { name: 'MUIDataTableJumpToPage' })(JumpToPage);
