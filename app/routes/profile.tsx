import useDarkMode from '../components/hooks/useDarkMode';
import {PersonalInfo} from '../components/InfoPages/InfoPages'
import { User } from '@prisma/client';
import { prisma } from '../../server';
import { UserDto } from '../models/dto';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';

// pulling info from the DB based on email
// TODO fix hardcoding
export const loader: LoaderFunction = async ({
}): Promise<UserDto> => {
  // TODO AUTH
  const myUser: User = (await prisma.user.findUnique({ where: { email: "ljbarro@clemson.edu" }}))!;
  return new UserDto(myUser);
}

export default function profilePage() {
    const myData: UserDto = useLoaderData();

    return(
        <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center bg-light text-dark dark:bg-dark dark:text-light">
            {/* The left div */} 
            <div className="relative sm:pb-16 basis-2/12 h-screen  border-2 border-lightgray dark:border-darkgray">
                <div className="py-2" />
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"← Back"}
                    </a>
                </div>
                <div className="py-2" />
                {/* The seperation bar */} 
                <div className="border-2 mx-6 border-lightgray" />
                <div className="px-6 font-bold py-3 text-2xl">
                    {"User Settings"}
                </div>
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"Account"}
                    </a>
                </div>
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"Appearance"}
                    </a>
                </div>
                <div className="py-2" />
                {/* The seperation bar */} 
                <div className="border-2 mx-6 border-lightgray" />
                <div className="py-2" />
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"Log out"}
                    </a>
                </div>
            </div>
            {/* The right div */} 
            <div className="relative basis-4/12 sm:pb-16 h-screen sm:pt-8 border-2 border-lightgray dark:border-darkgray">
                <div className="px-6 font-bold py-2 text-2xl">
                    {"Account"}
                </div>
                {/* The box with acc. info */}
                <div className="border-2 border:lightgray mx-6 my-2 shadow-xl">
                    <div className="py-2"/>
                    <div className="mx-4 px-2 font-bold py-1">
                        {"Name"}
                    </div>
                    <div className="mx-4 px-2 font-bold py-1">
                        {myData.name}
                    </div>
                    <div className="py-2" />
                    <div className="mx-4 px-2 font-bold py-1">
                        {"Email"}
                    </div>
                    <button onClick={myData.email = prompt(myData.email) ?? myData.email}>
                        {"Edit"}
                    </button>
                    <div className="mx-4 px-2 font-bold py-1">
                        {myData.email}
                    </div>
                    <div className="py-3" />
                </div>
                <div className="py-2" />
                <div className="mx-4 px-2 py-1 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"Update Name"}
                    </a>
                </div>
                <div className="mx-4 px-2 py-1 font-bold border-2 border-transparent hover:border-lightgray">
                    <a href={"#"}>
                        {"Change Password"}
                    </a>
                </div>
            </div>
        </main>
    )
}