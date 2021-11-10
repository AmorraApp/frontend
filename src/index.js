import 'common/config';
import './styles/root.scss';
// import { render } from 'react-snapshot';
import { render } from 'react-dom';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './routes/login';
import HomePage from './routes/home';
import { AuthenticationProvider, IsAuthenticated, IsNotAuthenticated } from 'common/authentication';
import { Orphanage } from 'common/ui/mount';

const PrivacyPolicy = lazy(() => import('./routes/privacy'));

const App = () => (
  <AuthenticationProvider>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <IsNotAuthenticated>
            <Route exact path="/" element={<LoginPage />}>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </IsNotAuthenticated>
          <IsAuthenticated>
            <Route exact path="/" element={<HomePage />} />
          </IsAuthenticated>
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Suspense>
    </Router>
    <Orphanage />
  </AuthenticationProvider>
);

render(<App />, document.getElementById("react"));
