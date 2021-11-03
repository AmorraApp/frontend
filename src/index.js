import { render } from 'react-snapshot';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './routes/landing';

const Home = lazy(() => import('./routes/home'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/home" component={Home} />
      </Switch>
    </Suspense>
  </Router>
);

render(<App />, document.getElementById("react"));
