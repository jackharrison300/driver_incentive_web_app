import { Navigate, useNavigate } from "react-router-dom";

export default function SidebarSponsor(){
  const navigate = useNavigate()

  return(
    <nav className="border-r-2 border-lightgray text-dark font-medium shadow-xl">
      <div className="flex flex-col min-h-screen h-full left-0 w-screen p-4 bg-light md:w-80 text-xl dark:bg-dark dark:text-light dark:border-light">
        <div className="flex items-center pb-4">
          <header className="text-2xl font-bold">Dashboard</header>
        </div>
        <div className="items-center justify-center">
          <ul className="space-y-1 w-full">
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-lightgray hover:shadow-xl text-start"
                onClick={() => navigate("/sponsor")}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-lightgray hover:shadow-xl text-start"
                onClick={() => navigate("/sponsor/dashboard")}
              >
                Manage Users
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-lightgray hover:shadow-xl text-start"
                onClick={() => navigate("/sponsor/manage-products")}
              >
                Manage Products
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-lightgray hover:shadow-xl text-start"
                onClick={() => navigate("..")}
              >
                  Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}