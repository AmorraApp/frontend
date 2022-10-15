import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthentication, { AuthProvider } from "#src/common/auth";
import ENV from '#src/env';
import { Orphanage } from '#src/ui/mount';
import { CssBaseline } from '@mui/material';

import ThemeEngine from '#src/theme';

import LandingPage from '#src/pages/Landing';
import Chrome from '#src/common/Chrome';

const PrivacyPolicy = lazy(() => import('./pages/Privacy'));
const Home = lazy(() => import('./pages/Home'));


function Root () {
  const { authenticated } = useAuthentication();
  if (!authenticated) {
    return <LandingPage />;
  }

  return (
    <Routes>
      <Route element={<Chrome />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

const App = () => (
  <Suspense>
    <ThemeEngine>
      <AuthProvider
        domain={ENV.AUTH0_DOMAIN}
        clientId={ENV.AUTH0_CLIENTID}
        audience={ENV.AUTH0_AUDIENCE}
        redirectUri={window.location.origin}
        scope="read:current_user"
      >
        <CssBaseline />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/" element={<Root />} />
              <Route element={<Chrome />}>
                <Route path="/settings" element={<Home />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
        <Orphanage />
      </AuthProvider>
    </ThemeEngine>
  </Suspense>
);

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
const root = createRoot(mountPoint);
root.render(<App />);
