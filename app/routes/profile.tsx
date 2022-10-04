import useDarkMode from '../components/hooks/useDarkMode';
import {PersonalInfo} from '../components/InfoPages/InfoPages'
import {useState} from 'react'

const myInfo: PersonalInfo={
    // These will later be aquired with a db getter function component
    name: "Leopold Jones",
    pfp: "",
    email: "oldyleopoldy@gmail.com",
    phoneNumber: "555-555-5555"
}

export default function profilePage() {
    {/* Toggle switch to enable edit mode so you can input a new name, email, or phoone # */}
    const [isEditMode, setEditMode] = useState(false)

    return(
        <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center bg-light text-dark dark:bg-dark dark:text-light">
            {/* The left div */} 
            <div className="relative sm:pb-16 basis-2/12 h-screen  border-2 border-lightgray dark:border-darkgray">
                <div className="py-2" />
                <div className="mx-4 px-2 font-bold hover:border-2 hover:border-lightgray">
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
                <div className="mx-4 px-2 font-bold hover:border-2 hover:border-lightgray">
                    <a href={"#"}>
                        {"Account"}
                    </a>
                </div>
                <div className="mx-4 px-2 font-bold hover:border-2 hover:border-lightgray">
                    <a href={"#"}>
                        {"Appearance"}
                    </a>
                </div>
                <div className="py-2" />
                {/* The seperation bar */} 
                <div className="border-2 mx-6 border-lightgray" />
                <div className="py-2" />
                <div className="mx-4 px-2 font-bold hover:border-2 hover:border-lightgray">
                    <a href={"#"}>
                        {"Log out"}
                    </a>
                </div>
            </div>
            {/* The right div */} 
            <div className="relative basis-4/12 sm:pb-16 h-screen sm:pt-8 border-2 border-lightgray dark:border-darkgray">
            <div className="px-6 font-bold py-1 text-2xl">
                {"Account"}
            </div>
            <div className="py-2" />
            <div className="px-6 font-bold">
                <button onClick={() => setEditMode(!isEditMode)}>
                    {"Edit"}
                </button>
            </div>
                {/* The box with acc. info */}
                <div className="border-2 border:lightgray mx-6 my-2 shadow-xl">
                    <div className="py-2"/>
                    <div className="mx-4 px-2 font-bold py-1">
                        {"Name"}
                    </div>
                    { isEditMode ? 
                        <input className="mx-4 px-2 border-2 border-lightgray" type="text">
                            {/* TODO fix taking inputs */}
                            {/*var newName =  prompt(myInfo.name)*/}
                        </input> :
                        <div className="mx-4 px-2 font-bold py-1">
                            {myInfo.name}
                        </div>
                    }
                    <div className="py-2" />
                    <div className="mx-4 px-2 font-bold py-1">
                        {"Email"}
                    </div>
                    { isEditMode ? 
                        <input className="mx-4 px-2 border-2 border-lightgray" type="text">
                            {/* TODO fix taking inputs */}
                            {/*var newEMail =  prompt(myInfo.email)*/}
                        </input> :
                        <div className="mx-4 px-2 font-bold py-1">
                            {myInfo.email}
                        </div>
                    }
                    <div className="py-2" />
                    <div className="mx-4 px-2 font-bold py-1">
                        {"Phone #"}
                    </div>
                    { isEditMode ? 
                        <input className="mx-4 px-2 border-2 border-lightgray" type="text">
                            {/* TODO fix taking inputs */}
                            {/*var newphoneNum =  prompt(myInfo.phoneNumber)*/}
                        </input> :
                        <div className="mx-4 px-2 font-bold py-1">
                            {myInfo.phoneNumber}
                        </div>
                    }
                    <div className="py-2" />
                </div>
                <div className="py-2" />
                <div className="mx-4 px-2 py-1 font-bold hover:border-2 hover:border-lightgray">
                    <a href={"#"}>
                        {"Update Name"}
                    </a>
                </div>
                <div className="mx-4 px-2 py-1 font-bold hover:border-2 hover:border-lightgray">
                    <a href={"#"}>
                        {"Change Password"}
                    </a>
                </div>
            </div>
        </main>
    )
}