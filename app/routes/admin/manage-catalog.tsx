import Banner from "../../components/Banner/Banner";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ManageCatalog() {
    let [showSidebar, setShowSidebar] = useState(false);
    return (
        <>
          <main className="relative flex-col sm:flex min-h-screen items-center justify-center bg-light text-dark text-xl font-medium dark:bg-dark dark:text-light">
            <div className="flex">
              <Menu as="div" className="relative inline-block text-left mx-2">
                <div>
                  <Menu.Button className="flex items-center justify-center rounded-md sm:px-8 px-4 py-3 text-xl shadow-sm border-2 border-lightgray hover:border-dark hover:bg-lightgray">
                    Sponsors
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Sponsor 1
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Sponsor 2
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Sponsor 3
                          </a>
                        )}
                      </Menu.Item>
                      <form method="POST" action="#">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="submit"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </form>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button 
                className="flex items-center justify-center rounded-md sm:px-8 px-2 py-3 mx-2 text-xl shadow-sm
                border-2 border-lightgray hover:border-dark hover:bg-lightgray"
            
                //onClick={() => navigate("/admin/dashboard")}
              >
                Add Items
              </button>
            </div>
            <div className="relative items-center justify-center flex flex-row flex-wrap my-4 mx-8">
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
              <div className="border-2 border-dark p-10 m-2">
                Item
              </div>
            </div>
          </main>
        </>
    );
}