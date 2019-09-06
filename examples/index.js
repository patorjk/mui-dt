import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import ExamplesGrid from "./ExamplesGrid";
import examples from "./examples";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
  },
});

function Examples(props) {
  const classes = useStyles();
  return (
    <main className={classes.root}>
      <div className={classes.contentWrapper}>
        <Router hashType="noslash">
          <Switch>
            <Route path="/" exact render={() => <ExamplesGrid examples={examples}/>} />
              {Object.keys(examples).map((label, index) => (
                <Route key={index} path={`/${label.replace(/\s+/g, '-').toLowerCase()}`} exact component={examples[label]}/>
              ))}
          </Switch>
        </Router>
      </div>
    </main>
  );
}

 ReactDOM.render(<Examples/>, document.getElementById('app-root'));