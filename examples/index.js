import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import ExamplesGrid from "./ExamplesGrid";
import examples from "./examples";
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
  },
});

let Examples = withRouter(function(props) {
  const classes = useStyles();
  
  const returnHome = () => {
    props.history.push('/');
  };

  var myStyle = {padding:'0px', marginTop:'20px'};
  
  return (    
    <main className={classes.root}>
      <div className={classes.contentWrapper}>
        
        <Switch>
          <Route path="/" exact render={() => <ExamplesGrid examples={examples}/>} />
            {Object.keys(examples).map((label, index) => (
              <Route key={index} path={`/${label.replace(/\s+/g, '-').toLowerCase()}`} exact component={examples[label]}/>
            ))}
        </Switch>

        {props.location.pathname !== '/' && (
          <div style={myStyle}>
            <Button color="primary" onClick={returnHome}>Back to Example Index</Button>
          </div>
        )}
      </div>
    </main>
  );
});

function App() {
  return (
    <Router hashType="noslash">
      <Examples />
    </Router>
  );
}

 ReactDOM.render(<App/>, document.getElementById('app-root'));