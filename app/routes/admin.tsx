import Banner from '../components/Banner/Banner';
import SidebarAdmin from '../components/SidebarAdmin/SidebarAdmin';
import { Outlet } from "@remix-run/react";
import { useState, useEffect } from 'react';
import useDarkMode from '~/components/hooks/useDarkMode';

export default function admin() {
  let [showSidebar, setShowSidebar] = useState(false);
  const [darkTheme, setDarkTheme] = useDarkMode();

  useEffect(() => {
    setDarkTheme(darkTheme);
  }, [])

  return(
    <>
      <Banner showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <div className="flex">
        {showSidebar && <SidebarAdmin />}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  )
}