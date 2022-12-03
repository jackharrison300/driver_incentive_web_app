import Banner from '../components/Banner/Banner';
import SidebarSponsor from '../components/SidebarSponsor/SidebarSponsor';
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
    <main className="h-screen dark:bg-dark">
      <Banner showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <div className="flex">
        {showSidebar && <SidebarSponsor />}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </main>
  )
}