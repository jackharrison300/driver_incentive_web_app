export default function Form(){

  return(
    <main className="sm:flex items-center justify-center text-center bg-light text-dark text-xl font-medium dark:bg-dark dark:text-light">
      <form>
        <div className="max-w-3xl p-8 sm:m-8 border-2 border-lightgray shadow-xl text-center grid grid-flow-row auto-rows-max">
          <div className="pb-4 text-primary text-2xl font-bold border-b-2 mb-4">
            <header />Driver Application Form
          </div>
          <div className="grid grid-cols-2 gap-x-8 text-start">
            <div className="block">
              <label />First name
              <input className="w-full px-4 py-2 mb-4 min-w-38 border-2 border-lightgray shadow-md" type="text" placeholder="John" required />
            </div>
            <div className="block">
              <label />Last name
              <input className="w-full px-4 py-2 mb-4 border-2 border-lightgray shadow-md" type="text" placeholder="Doe" required />
            </div>
            <div className="block">
              <label />Company
              <input className="w-full px-4 py-2 mb-4 border-2 border-lightgray shadow-md" type="text" placeholder="Name" required />
            </div>
          </div>
          <div className="block text-start">
            <label />Email address
            <input className="w-full block px-4 py-2 mb-4 border-2 border-lightgray shadow-md" type="text" placeholder="johndoe@gmail.com" required />
          </div>
          <div className="block text-start">
            <label />Password
            <input className="w-full block px-4 py-2 mb-4 border-2 border-lightgray shadow-md" type="password" placeholder="Enter password" required />
          </div>
          <div className="block text-start">
            <label />Confirm password
            <input className="w-full block px-4 py-2 mb-4 border-2 border-lightgray shadow-md" type="password" placeholder="Enter password" required />
          </div>
          <div className="block text-start">
            <label />Your message
            <textarea className="w-full block px-4 py-4 mb-4 border-2 border-lightgray shadow-md" id="large-input" placeholder="Leave a message..." required />
          </div>
          <div className="block text-center">
            <button className="px-4 py-2 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary shadow-md">
              <input type="submit" />
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}