import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { PersonalInfo, DriverInfo } from '../../routes/app'

{/* Default pfp-less image */ }
let defaultimg = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function isDriver(userInfo: PersonalInfo | DriverInfo): userInfo is DriverInfo {
  return (userInfo as DriverInfo).points !== undefined
}

export default function Banner(
  { userInfo, showSidebar, setShowSidebar }:
  { userInfo: PersonalInfo | DriverInfo, showSidebar: boolean, setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>}
  ) {

  function changeSidebarState() {setShowSidebar(!showSidebar)};

  return (
    <Disclosure as="nav" className="bg-light text-dark text-xl font-medium">
      {({ open }) => (
        <>
          <div className="mx-auto border-b-2 border-light-gray dark:bg-dark dark:text-light dark:border-dark-gray">
            <div className="relative flex h-18 items-center justify-between">

              {/* This stuff is left aligned */}
              <div className="px-1">
                <div className="flex items-start justify-start">
                  <div className="inset-y-0 left-0 flex">
                      <button className="text-xl mb-2 text-dark hover:text-primary" onClick={changeSidebarState}>
                         ≡
                      </button>
                  </div>
                </div>
              </div>

              {/* This stuff is right aligned */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Your name */}
                <div className="inset-y-0 px-2"> 
                  {userInfo.name}
                </div>

                {/* Your points, if you're a driver */}
                { isDriver(userInfo) ? 
                  <div className="absolute inset-y-10 px-2 h-2">
                    {'Points: ' + userInfo.points}
                  </div> :
                  <div></div>
                }
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}