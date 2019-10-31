import React, {useEffect} from 'react';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash.debounce';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginTop: '10px',
    marginRight: '8px',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
}), { name: 'MUIDataTableSearch' });

export const DebounceTableSearch = (props) => {
  const { options, onHide, searchText, debounceWait } = props;
  const classes = useStyles();

  useEffect(() => {
    const onKeyDown = event => {
      if (event.keyCode === 27) {
        onHide();
      }
    };

    document.addEventListener('keydown', onKeyDown, false);

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    };
  });

  const debouncedSearch = debounce((event) => {
    props.onSearch(event.target.value);
  }, debounceWait);

  const handleTextChange = event => {
    debouncedSearch(event);
  };

  return (
    <Grow appear in={true} timeout={300}>
      <div className={classes.main}>
        <SearchIcon className={classes.searchIcon} />
        <TextField
          className={classes.searchText}
          autoFocus={true}
          InputProps={{
            'data-test-id': options.textLabels.toolbar.search,
            'aria-label': options.textLabels.toolbar.search,
          }}
          value={searchText || ''}
          onChange={handleTextChange}
          fullWidth={true}
          {...(options.searchProps ? options.searchProps : {})}
        />
        <IconButton className={classes.clearIcon} onClick={onHide}>
          <ClearIcon />
        </IconButton>
      </div>
    </Grow>
  );
};

export const debounceSearchRender = (debounceWait = 500) => {
  return (searchText, handleSearch, hideSearch, options) => {
    return (
      <DebounceTableSearch
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        options={options}
        debounceWait={debounceWait}
      />
    );
  };
};