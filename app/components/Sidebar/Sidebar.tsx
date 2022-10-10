import { useState } from 'react';

export default function Sidebar(){
  return(
    <nav className="border-r-2 border-lightgray text-dark font-medium shadow-xl">
      <div className="flex flex-col min-h-screen h-full left-0 w-screen p-4 bg-light md:w-80 text-xl">
        <div className="flex items-center pb-4">
          <header className="text-2xl font-bold">Dashboard</header>
        </div>
        <div className="items-center justify-center">
          <ul className="space-y-1 w-full">
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Home
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Profile
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Browse Products
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  View Cart
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Checkout
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Settings
                </a>
              </button>
            </li>
            <li>
              <button className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start">
                <a href="">
                  Logout
                </a>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}