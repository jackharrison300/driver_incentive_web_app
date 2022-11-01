import useDarkMode from '../components/hooks/useDarkMode';
import { User } from '@prisma/client';
import { prisma } from '../../server';
import { UserDto } from '../models/dto';
import { LoaderFunction, ActionFunction, DataFunctionArgs, redirect } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { containsHtml } from '../shared_functions';
import { Form } from '@remix-run/react';
import {useNavigate} from 'react-router-dom';

let myId = 1

// pulling info from the DB based on email
export const loader: LoaderFunction = async ({
}): Promise<UserDto> => {
  // TODO AUTH
  // TODO fix hardcoding
  const myUser: User = (await prisma.user.findUnique({ where: { id: myId }}))!;
  return new UserDto(myUser);
}

// handling the user inputting a new name/email
export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> =>{
    const form = await request.formData();
    let [name, email] = [form.get('name'), form.get('email')]
    const errors: {name?: string, email?: string} = {}

    // field validation
    if(typeof name !== 'string' || containsHtml(name))
        errors.name = 'Invalid name'
    if(typeof email !== 'string' || containsHtml(email) || !email.includes('@'))
        errors.email = 'Invalid email'

    const data: Partial<User> = {};

    // if a user leaves a form blank it will keep the same info as before
    if(name !== "") data.name = name as string
    if(email !== "") data.email = email as string

    //updating new info to prisma
    await prisma.user.update({
        where: {
            id: myId,
        },
        data
    })
    return new Response(null, {status: 200})
}


export default function profilePage() {
    const navigate = useNavigate()
    const myData: UserDto = useLoaderData()
    const [updateMode, toggleUpdateMode] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseOver = () => { setIsHovering(true) }

    const handleMouseOut = () => { setIsHovering(false) }

    return(
        <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center bg-light text-dark dark:bg-dark dark:text-light">
            
            {/* The left div */} 
            <div className="relative sm:pb-16 basis-2/12 h-screen  border-2 border-lightgray dark:border-darkgray">
                <div className="py-2" />
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray hover:shadow-lg">
                    <button onClick={() => navigate(-1)}>
                        {"← Back"}
                    </button>
                </div>

                <div className="py-2" />
                {/* The seperation bar */} 
                <div className="border-2 mx-6 border-lightgray" />
                
                <div className="px-6 font-bold py-3 text-2xl">
                    {"User Settings"}
                </div>
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray hover:shadow-lg">
                    <button onClick={() => navigate("/dashboard")}>
                        {"Account"}
                    </button>
                </div>
                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray hover:shadow-lg">
                    <button onClick={() => navigate("/profile")}>
                        {"Appearance"}
                    </button>
                </div>

                <div className="py-2" />
                {/* The seperation bar */} 
                <div className="border-2 mx-6 border-lightgray" />
                <div className="py-2" />

                <div className="mx-4 px-2 font-bold border-2 border-transparent hover:border-lightgray hover:shadow-lg">
                    <button onClick={() => navigate("..")}>
                        {"Log out"}
                    </button>
                </div>
            </div>

            {/* The right div */} 
            <div className="relative basis-4/12 sm:pb-16 h-screen sm:pt-8 border-2 border-lightgray dark:border-darkgray">
                <div className="px-6 font-bold py-2 text-2xl">{"Account"}</div>

                {/* The box in the right div */}
                <div className="border-2 border:lightgray mx-5 my-2 shadow-xl">
                    <div className="py-2"/>
                    {updateMode ? 
                    // the form to get your new name and email
                    <Form method="post" onSubmit={() => {
                        toggleUpdateMode(!updateMode)
                        setTimeout(function () { window.location.reload(); }, 500)
                    }}>
                        <label htmlFor="name" className="mx-4 px-2 font-bold py-1">{"Name"}</label><br/>
                        <input type="text" id="name" name="name" className="px-2 mx-4 py-1 border-2 rounded-md border-lightgray shadow-lg"></input><br/>

                        <div className="py-2" />
                        
                        <label htmlFor="email" className="mx-4 px-2 font-bold py-1">{"Email"}</label><br/>
                        <input type="text" id="email" name="email" className="px-2 mx-4 py-1 border-2 rounded-md border-lightgray shadow-lg"></input><br/>
                        
                        <div className="py-2"/>

                        <button
                            type='submit'
                            className='inline-flex justify-center border px-4 m-4 py-2 text-sm text-center font-medium shadow-lg'
                        >
                            {"Submit"}
                        </button>
                    </Form> : 
                    // displaying your info within the box
                    <div>
                        <div className="mx-4 px-2 font-bold py-1">{"Name"}</div>
                        <div className="mx-4 px-2 font-bold border-2 border-transparent py-1">{myData.name}<br/></div>

                        <div className="py-2"/>

                        <div className="mx-4 px-2 font-bold py-1">{"Email"}</div>
                        <div className="mx-4 px-2 font-bold border-2 border-transparent py-1">{myData.email}</div>
                        
                        <div className="py-2"/>
                    </div>
                    }
                </div>
                
                <div className="py-2" />

                {/* Options to change your name, email or password. sits under the box displaying your info */}
                <div>
                    {updateMode ? 
                        <></> :
                        <button 
                            onClick={() => toggleUpdateMode(!updateMode)}
                            className="mx-4 px-2 py-1 font-bold text-lg border-2 border-transparent hover:border-lightgray hover:shadow-lg"
                        >
                            {"Change Name and Email"}
                        </button> 
                    }
                </div>
                <div className="py-1"/>
                {/* this will always appear */}
                <a 
                    onMouseOver={handleMouseOver} 
                    onMouseOut={handleMouseOut}
                    href={"#"} 
                    className="mx-4 px-2 py-1 font-bold not-italic text-black text-lg border-2 border-transparent hover:border-lightgray hover:shadow-lg"
                >
                    {"Change Password"}
                </a><br/>
                {/* this will appear when the anchor above is hovered over */}
                {isHovering ?
                    <div className="mx-4 py-3 w-48 text-sm italic">
                        {"This will send you an email to reset your password"}
                    </div>:
                    <></>
                }
            </div>
        </main>
    )
}