import { Navigate, useNavigate } from "react-router-dom";

export default function Sidebar(){
  const navigate = useNavigate()

  const logout = ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "XSRF-TOKEN=f45fe7ba-638b-4097-8164-aba497f56e0b; cognito-fl=\"W10=\"");

    var requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://t25.auth.us-east-1.amazoncognito.com/logout?client_id=5lmi5ls07ca66e0ult69ca6tmp&logout_uri=https://t25.auth.us-east-1.amazoncognito.com/login?client_id=5lmi5ls07ca66e0ult69ca6tmp%26response_type=code%26scope=email+openid+profile%26redirect_uri=https://61rc2moud3.execute-api.us-east-1.amazonaws.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

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
                onClick={() => navigate("/app/products")}
              >
                Browse Products
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/cart")}
              >
                View Cart
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/apply")}
              >
                Apply
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-darkgray hover:shadow-xl text-start"
                onClick={() => navigate("/app/settings")}
              >
                Settings
              </button>
            </li>
            <li>
              <button 
                className="px-2 py-1 w-full border-2 border-transparent hover:border-lightgray dark:hover:border-lightgray hover:shadow-xl text-start"
                onClick={() => {
                  navigate("..")
                  //logout()
              }}>
                  Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}