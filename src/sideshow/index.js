
import SideNav from 'common/ui/sidenav';
import styles from './sideshow.scss';
import { Outlet } from 'react-router-dom';


export default function Sideshow () {
  return (
    <div className={styles.root}>
      <SideNav.Container hashKey="tab" className={styles.container}>
        <SideNav>
          <SideNav.Item label="Alerts"   href="/sideshow/alerts" />
          <SideNav.Item label="Buttons"  href="/sideshow/buttons" />
          <SideNav.Item label="Badges"   href="/sideshow/badges" />
          <SideNav.Item label="Text"     href="/sideshow/text" />
          <SideNav.Item label="Images"   href="/sideshow/images" />

          <SideNav.Item label="Inputs"   href="/sideshow/inputs">
            <SideNav.Item label="Text Fields"       href="/sideshow/inputs#textfields" />
            <SideNav.Item label="Numeric Fields"    href="/sideshow/inputs#numeric" />
            <SideNav.Item label="Text Areas"        href="/sideshow/inputs#textarea" />
            <SideNav.Item label="Control Container" href="/sideshow/inputs#control" />
            <SideNav.Item label="Checkboxes"        href="/sideshow/inputs#checkboxes" />
            <SideNav.Item label="Disclosure"        href="/sideshow/inputs#disclosure" />
            <SideNav.Item label="Radio Groups"      href="/sideshow/inputs#radio" />
            <SideNav.Item label="Switches"          href="/sideshow/inputs#switches" />
            <SideNav.Item label="Ranges"            href="/sideshow/inputs#ranges" />
            <SideNav.Item label="Input Groups"      href="/sideshow/inputs#input-groups" />
            <SideNav.Item label="File Input"        href="/sideshow/inputs#file" />
            <SideNav.Item label="Toggles"           href="/sideshow/inputs#toggles" />
          </SideNav.Item>
          <SideNav.Item label="Drop Select"   href="/sideshow/select" />
          <SideNav.Item label="Kalendae"      href="/sideshow/kalendae" />
          <SideNav.Item label="Popovers"      href="/sideshow/popovers" />
          <SideNav.Item label="Progress Bars" href="/sideshow/progressbars" />
          <SideNav.Item label="Grids"         href="/sideshow/grids" />
          <SideNav.Item label="Modals"        href="/sideshow/modals" />
          <SideNav.Item label="List Groups"   href="/sideshow/lists" />
          <SideNav.Item label="Panel Stacks"  href="/sideshow/panelstack" />
          <SideNav.Item label="Pagination"    href="/sideshow/pagination" />
          <SideNav.Item label="Spinners"      href="/sideshow/spinners" />
          <SideNav.Item label="Snackbars"     href="/sideshow/snackbar" />
          <SideNav.Item label="Close Buttons" href="/sideshow/close-buttons" />
          <SideNav.Item label="DataTables"    href="/sideshow/datatable" />
          <SideNav.Item label="Slider"        href="/sideshow/slider" />
        </SideNav>
        <Outlet />
      </SideNav.Container>
    </div>
  );
}
