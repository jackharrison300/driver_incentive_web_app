import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

{/* display of the cart and # of contents */}
const mycart = [
  { name: 'Cart: 12', current: false }
]

{/* will pull the contents for a name to be displayed */}
const myname = [
  { name: 'James Lee', current: false }
]

{/* contains what will be displayed  in terms of points */}
const mypoints = [
  { name: '32', current: false}
]

{/* the text within the button for the dropdown menu */}
const dropDownButton = [
  {name: '≡', current: false}
]

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  return (
    <Disclosure as="nav" className="bg-gray-600">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7x1 px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">

              {/* This stuff is left aligned */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button. This was here bfeorehand, not sure if it's necessary*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">

                    {/* The button and the dropdown menu */}
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
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-6 text-sm text-gray-700')}
                              >
                                Browse Products
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-6 text-sm text-gray-700')}
                              >
                                Edit profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-6 text-sm text-gray-700')}
                              >
                                View Current Orders
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-6 text-sm text-gray-700')}
                              >
                                Checkout
                              </a>
                            )}
                          </Menu.Item>
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
                    className= "px-4 py-4 text-xl font-medium text-gray-200"
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
                <img
                  className="h-14 w-14 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
  
              </div>
            </div>
          </div>
          {/*
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
                  */}
        </>
      )}
    </Disclosure>
  )
}