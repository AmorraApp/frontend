import 'common/config';
import './styles/root.scss';
// import { render } from 'react-snapshot';
import { render } from 'react-dom';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Orphanage } from 'common/ui/mount';

import Sideshow from './sideshow/index.js';

const Alerts       = lazy(() => import('./sideshow/alerts'));
const Texts        = lazy(() => import('./sideshow/text'));
// const Images       = lazy(() => import('./sideshow/images'));
const CloseButtons = lazy(() => import('./sideshow/close-buttons'));
const Badges       = lazy(() => import('./sideshow/badges'));
const Buttons      = lazy(() => import('./sideshow/buttons'));
// const Datatable    = lazy(() => import('./sideshow/datatable'));
// const DropDowns    = lazy(() => import('./sideshow/dropdowns'));
// const Grids        = lazy(() => import('./sideshow/grids'));
// const Inputs       = lazy(() => import('./sideshow/inputs'));
// const Selects      = lazy(() => import('./sideshow/select'));
// const Paginate     = lazy(() => import('./sideshow/pagination'));
// const Kalendae     = lazy(() => import('./sideshow/kalendae'));
// const ListGroups   = lazy(() => import('./sideshow/listgroups'));
// const PanelStacks  = lazy(() => import('./sideshow/panelstack'));
// const Modals       = lazy(() => import('./sideshow/modals'));
// const Popovers     = lazy(() => import('./sideshow/popovers'));
// const ProgressBars = lazy(() => import('./sideshow/progressbar'));
// const Spinners     = lazy(() => import('./sideshow/spinners'));
// const Snackbars    = lazy(() => import('./sideshow/snackbar'));
// const Sliders      = lazy(() => import('./sideshow/slider'));

const App = () => (
  <>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/sideshow"               element={<Sideshow />}>
            <Route path="/sideshow/alerts"      element={<Alerts />} />
            <Route path="/sideshow/text"        element={<Texts />} />
            <Route path="/sideshow/close"       element={<CloseButtons />} />
            <Route path="/sideshow/badges"      element={<Badges />} />
            <Route path="/sideshow/buttons"     element={<Buttons />} />
{/*
            <Route path="/sideshow/images"      element={<Images />} />
            <Route path="/sideshow/datatable"   element={<Datatable />} />
            <Route path="/sideshow/dropdowns"   element={<DropDowns />} />
            <Route path="/sideshow/grids"       element={<Grids />} />
            <Route path="/sideshow/inputs"      element={<Inputs />} />
            <Route path="/sideshow/select"      element={<Selects />} />
            <Route path="/sideshow/pagination"  element={<Paginate />} />
            <Route path="/sideshow/kalendae"    element={<Kalendae />} />
            <Route path="/sideshow/listgroups"  element={<ListGroups />} />
            <Route path="/sideshow/panelstack"  element={<PanelStacks />} />
            <Route path="/sideshow/modals"      element={<Modals />} />
            <Route path="/sideshow/popovers"    element={<Popovers />} />
            <Route path="/sideshow/progressbar" element={<ProgressBars />} />
            <Route path="/sideshow/spinners"    element={<Spinners />} />
            <Route path="/sideshow/snackbar"    element={<Snackbars />} />
            <Route path="/sideshow/slider"      element={<Sliders />} />
*/}
          </Route>
          <Route path="*" element={<Navigate to="/sideshow" />} />
        </Routes>
      </Suspense>
    </Router>
    <Orphanage />
  </>
);

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
render(<App />, mountPoint);
