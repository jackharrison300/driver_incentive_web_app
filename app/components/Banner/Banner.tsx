import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { PersonalInfo, DriverInfo } from '../../routes/app'

{/* Default pfp-less image */ }
let defaultimg = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

{/* the text within the button for the dropdown menu */ }
const dropDownButton = [
  { name: '≡', current: false }
]

const dropdownItems = [
  "Browse Products",
  "Edit profile",
  "View Current Orders",
  "Checkout"
]

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function isDriver(userInfo: PersonalInfo | DriverInfo): userInfo is DriverInfo {
  return (userInfo as DriverInfo).points !== undefined
}

export default function Banner({ userInfo }: { userInfo: PersonalInfo | DriverInfo }) {

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

                    {/* The left-side menu button and its dropdown menu */}
                    <Menu as="div">
                      <div>
                        {/* The button */}
                        <Menu.Button className="text-xl mb-2 text-dark hover:text-primary">
                          {dropDownButton.map((item) => (
                            <a
                              key={item.name}
                              className="px-4 pb-2 text-4xl"
                              aria-current={item.current ? 'page' : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        {/* The dropdown menu */}
                        <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {dropdownItems.map((item) => {
                            return (
                              <Menu.Item key={item}>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(active ? 'bg-lightgray' : '', 'block px-4 py-5')}
                                  >
                                    {item}
                                  </a>
                                )}
                              </Menu.Item>
                            );
                          })}
                        </Menu.Items>
                      </Transition>
                    </Menu>
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