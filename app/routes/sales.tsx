import { CompanyDto } from '../models/dto'
import { prisma } from '../../server'
import { Company } from '@prisma/client'
import { LoaderFunction, } from '@remix-run/server-runtime'
import { useLoaderData } from '@remix-run/react'

const loader: LoaderFunction = async ({
}): Promise<CompanyDto> => {
  // TODO AUTH
  // TODO fix hardcoding
  // TODO remove the ! and handle a possible null
    const myCompany: Company = (await prisma.company.findUnique({ where: { name: "Test Company" }}))!;
    return CompanyDto.fromCompany(myCompany)
}

const placeholderImage = "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="

class item{
    image: String
    name: String
    pts: Number

    constructor(image: String, name: String, pts: Number){
        this.image = image
        this.name = name
        this.pts = pts
    }
}

// TODO replace with ebay API
// @ts-ignore
const items = []
for(let i =0; i<30; i++){
    items[i] = new item(placeholderImage, "object Object", 25*i)
}


export default function salesPage(){
    // TODO pull driver points from prisma
    const myPoints = 200

    const myCompany: CompanyDto = useLoaderData();

    return(
        <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center bg-light text-dark dark:bg-dark dark:text-light">
            {/* the left div, containing the sponsor logo and a change sponsor button and a search bar */}
            <div className="w-1/3">
                <div className="fixed">
                    {/* TODO fix companyDto returning null so I can uncomment this */}
                    {/*{myCompany.logoUrl !== "" ?
                        <img src={placeholderImage} alt="Company logo"/>:
                        <img src={myCompany.logoUrl} alt="blank company logo"/>
                    }
                    <div className="font-bold text-lg">{myCompany.name}</div>*/}
                </div>
            </div>

            {/* the right div, which diplays the list of items */}
            <div className="w-1/2 grid grid-cols-6">
                {/* @ts-ignore */}
                {items.map((item) => 
                    <>
                        <div className="px-5 py-4">
                            <img src = {item.image} alt="store item image"/>
                            {item.pts > myPoints ?
                                <div className="font-semibold text-red-500 text-center">
                                    {item.name}<br/>
                                    {item.pts + " points"}
                                </div>:
                                <div className="font-semibold text-center">
                                {item.name}<br/>
                                {item.pts + " points"}
                            </div>
                            }
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}