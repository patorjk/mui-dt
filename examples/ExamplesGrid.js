import {Link} from "react-router-dom";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import React, {useState} from "react";
import examples from "./examples";
import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  card: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
      fontWeight: 500,
    },
    backgroundColor: 'lightgrey',
  },
  cardContent: {
    '&:last-child': {
      padding: 8,
    }
  },
  link: {
    textDecoration: 'none',
  },
  label: {
    fontWeight: 'inherit'
  }
}));

function ExamplesGrid(props) {
  const classes = useStyles();
  const [searchVal, setSearchVal] = useState('');

  // Sort Examples alphabetically
  const examplesSorted = {};
  Object.keys(examples).sort((a,b) => {
    var aa = a.toLowerCase();
    var bb =b.toLowerCase();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  }).forEach(function (key) {
      examplesSorted[key] = examples[key];
  });

  const examplesSortedKeys = Object.keys(examplesSorted).filter((item) => {
    if (searchVal === '') return true;
    console.dir(item);
    return item.toLowerCase().indexOf( searchVal.toLowerCase() ) !== -1 ? true : false;
  });

  return (
      <React.Fragment>
        <Typography variant="h5" align="center">Choose an Example</Typography>
        <Typography variant="subtitle2" align="center">({examplesSortedKeys.length}) Examples</Typography>

        <Typography variant="subtitle2" align="center" style={{margin:'10px'}}>
          <TextField placeholder="Search Examples" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
        </Typography>

        <Grid container className={classes.container} spacing={2}>
          {examplesSortedKeys.map((label, index) => (
            <Grid key={index} item md={2}>
              <Link className={classes.link} to={`/${label.replace(/\s+/g, '-').toLowerCase()}`}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="subtitle1" className={classes.label} align="center">{label}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
}

export default ExamplesGrid;