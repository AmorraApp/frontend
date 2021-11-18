import 'common/config';
import './styles/root.scss';
// import { render } from 'react-snapshot';
import { render } from 'react-dom';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './routes/login';
import HomePage from './routes/home';
import { AuthenticationProvider, PrivateRoute } from 'common/authentication';
import { Orphanage } from 'common/ui/mount';
import { GraphQLProvider } from 'common/graphql';

const PrivacyPolicy = lazy(() => import('./routes/privacy'));

const App = () => (
  <GraphQLProvider>
    <AuthenticationProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <PrivateRoute exact path="/" element={<HomePage />} fallback={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
      <Orphanage />
    </AuthenticationProvider>
  </GraphQLProvider>
);

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
render(<App />, mountPoint);
