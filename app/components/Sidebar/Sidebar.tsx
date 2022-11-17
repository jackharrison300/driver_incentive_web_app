import { Navigate, useNavigate } from "react-router-dom";

export default function Sidebar(){
  const navigate = useNavigate()

  return(
    <nav className="border-r-2 border-lightgray text-dark font-medium shadow-xl">
      <div className="flex flex-col min-h-screen h-full left-0 w-screen p-4 bg-light md:w-80 text-xl">
        <div className="flex items-center pb-4">
          <header className="text-2xl font-bold">Dashboard</header>
        </div>
        <div className="items-center justify-center">
          <ul className="space-y-1 w-full">
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app")}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/sales")}
              >
                Browse Products
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/sales")}
              >
                View Cart
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/sales")}
              >
                Checkout
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/sales")}
              >
                Settings
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
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