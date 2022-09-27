import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

{/* This will later be changed to pull from our db */}
let imgsrc = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
let defaultimg ="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

{/* display of the cart and # of contents */}
const mycart = [
  { name: 'Cart: 12', current: false }
]

{/* will pull the contents for a name to be displayed */}
const myname = [
  { name: 'James Cameron', current: false }
]

{/* contains what will be displayed  in terms of points */}
const mypoints = [
  { name: '32', current: false},
  {name: '  ', current: false} // padding between points and pfp
]

{/* the text within the button for the dropdown menu */}
const dropDownButton = [
  {name: '≡', current: false}
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

export default function App() {
  return (
    <Disclosure as="nav" className="bg-light">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7x1 px-2 sm:px-6 lg:px-8 border border-dark">
            <div className="relative flex h-20 items-center justify-between">

              {/* This stuff is left aligned */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">

                    {/* The left-side menu button and its dropdown menu */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        {/* The button */}
                        <Menu.Button className="bg-gray-800 text-xl text-gray-300 py-2 rounded-md hover:bg-gray-300 hover:text-gray-800">
                          {dropDownButton.map((item) => (
                          <a
                            key={item.name}
                            className="px-4 py-4 rounded-md text-xl font-medium"
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
                          {dropdownItems.map( (item) => {
                            return(
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-5 text-sm text-gray-700')}
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

                    {/* Sponsor company img */}
                    <img
                      className="h-16 w-16"
                      src="https://cdn1.designhill.com/uploads/personal_designs/31ee265df31749484c844d4da67e655d-c98dd5ef7d7785203d3f1b0dd5e759cc15114834692255.png?ver=2.9.47"
                      alt=""
                    />

                  </div>
                </div>
              </div>

              {/* This stuff is right aligned */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    
                {/* Your cart & # items */}
                {mycart.map((item) => (
                  <a
                    key={item.name}
                    className="px-6 py-4 rounded-md text-xl font-medium text-gray-200"
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}

                {/* Your name */}
                {myname.map((item) => (
                  <a
                    key={item.name}
                    className= "py-4 text-xl font-medium text-gray-200"
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}

                {/* Your points */}
                {mypoints.map((item) => (
                  <a
                    key={item.name}
                    className= "px-2 py-4 text-xl font-medium text-gray-200"
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}

                {/* Your PFP */}
                {imgsrc ?
                  <img
                    className="h-14 w-14 rounded-full"
                    src={imgsrc}
                    alt=""
                  /> :
                  <img 
                    className="h-14 w-14 rounded-full"
                    src={defaultimg}
                    alt=""
                  />
                }
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}