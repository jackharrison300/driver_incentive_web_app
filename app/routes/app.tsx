import Banner from '../components/Banner/Banner';
import { Outlet } from "@remix-run/react";

export interface PersonalInfo{
  name: String
  pfp: String
}

export interface DriverInfo extends PersonalInfo{
   points: String 
}

const stevenWilde: PersonalInfo={
  name: 'Steven Wilde',
  pfp: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}

const vinDiesel: DriverInfo={ 
  name: 'Vin Diesel', 
  pfp: 'https://image.shutterstock.com/image-photo/los-angeles-may-21-vin-260nw-1129087247.jpg',
  points: '32'
}

export default function app() {
  return(<>
    <Banner userInfo={ stevenWilde }/>
    <Outlet />
  </>)
}