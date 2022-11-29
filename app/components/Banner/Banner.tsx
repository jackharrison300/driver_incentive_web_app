import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { PersonalInfo, DriverInfo } from '../InfoPages/InfoPages'
import useDarkMode from '../hooks/useDarkMode'
import { LoaderFunction } from '@remix-run/server-runtime'
import { FaSun, FaMoon } from 'react-icons/fa';
import { UserDto } from '~/models/dto'
import { prisma } from 'server'
import { User } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'

let myId = 1

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun size='24' className='top-navigation-icon' />
      ) : (
        <FaMoon size='24' className='top-navigation-icon' />
      )}
    </span>
  );
};

// pulling info from the DB based on email
export const loader: LoaderFunction = async ({
}): Promise<UserDto> => {
  // TODO AUTH
  // TODO fix hardcoding
  const myUser: User = (await prisma.user.findUnique({ where: { id: myId }}))!;
  return new UserDto(myUser);
}

{/* Default pfp-less image */ }
let defaultimg = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Banner(
  { showSidebar, setShowSidebar }: 
  { showSidebar: boolean, setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>}
  ) {
  
  const myData: UserDto = useLoaderData()

  function changeSidebarState() {setShowSidebar(!showSidebar)};

  return (
    <Disclosure as="nav" className="bg-light text-dark text-xl font-medium">
      {({ open }) => (
        <>
          <div className="mx-auto border-b-2 border-light-gray dark:bg-dark dark:text-light dark:border-dark-gray">
            <div className="relative flex h-18 items-center justify-between">

              {/* the button for the sidebar and the dark mode toggle switch */}
              <div className="px-4">
                <div className="flex items-start justify-start">
                  <div className="inset-y-0 left-0 flex">
                    <button className="text-4xl mb-2 hover:text-primary" onClick={changeSidebarState}>
                      ≡
                    </button>
                    <button className="p-4"><ThemeIcon/></button>
                  </div>
                </div>
              </div>

              {/* This stuff is right aligned */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Your name */}
                <div className="inset-y-0 px-2"> 
                  {/* For some reason 'myData.name' isn't working so here's a default name for now*/}
                  { "Steven Wilde" }
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}