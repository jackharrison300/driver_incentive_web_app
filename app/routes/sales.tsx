import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { EbayTokenResponseData } from "../models/ebay_token_api";
import { EbayItemSummary, EbaySearchResponseData } from "../models/ebay_search_api";
import { useState } from "react";
import { Outlet } from "@remix-run/react";
import Banner from "../components/Banner/Banner";
import Sidebar from "../components/Sidebar/Sidebar";
import { CompanyDto } from "../models/dto";

const placeholderImage =
  "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=";

class ItemDto {
  vendorId: string;
  image: string;
  name: string;
  points: number;

  constructor(p: Partial<ItemDto>) {
    this.vendorId = p.vendorId ?? "";
    this.image = p.image ?? "";
    this.name = p.name ?? "";
    this.points = p.points ?? 0;
  }

  static fromEbayItemSummary(data: EbayItemSummary) {
    return new ItemDto({
      vendorId: data.itemId,
      image: data.image?.imageUrl ?? placeholderImage,
      name: data.title,
      points: data.price?.value ? parseFloat(data.price.value) : 0
    })
  }
}

export const loader: LoaderFunction = async ({}): Promise<ItemDto[]> => {
  // TODO AUTH
  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://api.sandbox.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: new Headers({
        "Authorization": "Basic " + process.env.EBAY_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      }),  
      body: new URLSearchParams({
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope"
      })
    });
  } catch {
    throw new Error("Network failure on Ebay token call");
  }
  if (!tokenResponse.ok) {
    throw new Error("Ebay call failed - Status code not ok (200-299)");
  }

  let itemsResponse: Response;
  try {
    itemsResponse = await fetch(
      "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=iphone&limit=10&offset=0", {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + (await tokenResponse.json() as EbayTokenResponseData).access_token
        })
      }
    );
  }
  catch {
    throw new Error("Network failure on Ebay token call")
  }
  if (!itemsResponse.ok) {
    throw new Error("Ebay call failed - Status code not ok (200-299)");
  }
  return (await itemsResponse.json() as EbaySearchResponseData).itemSummaries.map(it =>
    ItemDto.fromEbayItemSummary(it)
  );
};

export default function salesPage() {
    
    const items: ItemDto[] = useLoaderData();
    // TODO pull driver points from prisma
    const myPoints = 200
    const myCompany: CompanyDto = useLoaderData();
    let [showSidebar, setShowSidebar] = useState(false);

    return(

        <>
            <Banner showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
            <div className="flex">
                {showSidebar && <Sidebar />}
                <div className="w-full">
                <Outlet />
                </div>
            </div>

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
      <div className="grid w-1/2 grid-cols-6">
        {items.map((item) => (
          <div className="px-5 py-4" key={item.points}>
            <img src={item.image} alt="store item image" />
            <div className="text-center font-semibold">
              {item.name}
              <br />
              <span className={item.points > myPoints ? 'text-red-500' : 'text-blue-600'}>{item.points + " points"}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
