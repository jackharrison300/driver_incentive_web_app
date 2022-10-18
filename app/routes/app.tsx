import Banner from '../components/Banner/Banner';
import Sidebar from '../components/Sidebar/Sidebar';
import { Outlet } from "@remix-run/react";
import {PersonalInfo, DriverInfo} from '../components/InfoPages/InfoPages'
import { useState } from 'react';


const stevenWilde: PersonalInfo={
  name: 'Steven Wilde',
  pfp: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  email: "",
  phoneNumber: ""
}

const vinDiesel: DriverInfo={ 
  name: 'Vin Diesel', 
  pfp: 'https://image.shutterstock.com/image-photo/los-angeles-may-21-vin-260nw-1129087247.jpg',
  points: '32',
  email: "",
  phoneNumber: ""
}

export default function app() {
  let [showSidebar, setShowSidebar] = useState(false);
  return(
    <>
      <Banner userInfo={ stevenWilde } showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  )
}