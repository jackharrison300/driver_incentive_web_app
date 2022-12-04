import { LoaderFunction } from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { EbayTokenResponseData } from "../../models/ebay_token_api";
import {
  EbayItemSummary,
  EbaySearchResponseData,
} from "../../models/ebay_search_api";
import { Fragment, useState } from "react";
import { Outlet } from "@remix-run/react";
import Banner from "../../components/Banner/Banner";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CompanyDto } from "../../models/dto";
import { Dialog, Transition } from "@headlessui/react";

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
      points: data.price?.value ? parseFloat(data.price.value) : 0,
    });
  }
}

export const loader: LoaderFunction = async ({}): Promise<ItemDto[]> => {
  // TODO AUTH
  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(
      "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Basic " + process.env.EBAY_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "https://api.ebay.com/oauth/api_scope",
        }),
      }
    );
  } catch {
    throw new Error("Network failure on Ebay token call");
  }
  if (!tokenResponse.ok) {
    throw new Error("Ebay call failed - Status code not ok (200-299)");
  }

  let itemsResponse: Response;
  try {
    itemsResponse = await fetch(
      "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=iphone&limit=10&offset=0",
      {
        method: "GET",
        headers: new Headers({
          Authorization:
            "Bearer " +
            ((await tokenResponse.json()) as EbayTokenResponseData)
              .access_token,
        }),
      }
    );
  } catch {
    throw new Error("Network failure on Ebay token call");
  }
  if (!itemsResponse.ok) {
    throw new Error("Ebay call failed - Status code not ok (200-299)");
  }
  return (
    (await itemsResponse.json()) as EbaySearchResponseData
  ).itemSummaries.map((it) => ItemDto.fromEbayItemSummary(it));
};

export default function ManageProducts() {
  function handleClick() {
    console.log(selection);
    setIsCheckOpen(true);
  }

  const items: ItemDto[] = useLoaderData();
  // TODO pull driver points from prisma
  const myPoints = 200;
  const myCompany: CompanyDto = useLoaderData();
  let [showSidebar, setShowSidebar] = useState(false);
  const [selection, setSelection] = useState([]);
  const [isCheckOpen, setIsCheckOpen] = useState(false);

  function handleCheckBoxChange(item: any) {
    // @ts-ignore
    if (!selection.includes(item)) {
      const newSelection = selection.concat(item);
      console.log(selection);
      setSelection(newSelection);
    } else {
      const newSelection = selection.filter((i) => item !== i);
      setSelection(newSelection);
    }
  }

  return (
    <>
      <main className="relative min-h-screen bg-light text-dark dark:bg-dark dark:text-light sm:flex sm:items-center sm:justify-center flex">
        {/* the right div, which diplays the list of items */}
        <div className="border-x-2 border-lightgray position: grid-rows-auto relative w-1/2 grid-cols-7">
          {/* Search Bar */}
          <div className="justify:right fixed right-0 mr-2 mt-2 p-2 pb-10 border-2 bg-light">
            <div className="input-group relative flex flex-row items-stretch w-full mb-4">
              <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>
              <button className="btn inline-block px-6 py-2.5 bg-blue-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
              </button>
            </div>
          </div>
          <button
            disabled={selection.length==0}
            type="button"
            onClick={() => handleClick()}
            className="position: justify:right fixed right-0 mt-16 mr-4 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Set Selection as new Catalog{" "}
          </button>
          {/* check modal */}
          <Transition appear show={isCheckOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsCheckOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-dark bg-opacity-75" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden border-2 bg-light p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-center text-lg font-medium leading-6"
                      >
                        Confirm Catalog
                      </Dialog.Title>
                      <div className="mt-2">
                        <Form
                          method="get" // FIXME
                          action={"/sponsor/manage-products"} // FIXME
                          onSubmit={() => setIsCheckOpen(false)}
                          className="w-full max-w-lg"
                        >
                          <div className="-mx-3 mb-2 flex flex-wrap">
                            <ul>
                            {selection.map((item) => (
                              // @ts-ignore
                              <li className="p-2">
                                <div>{item.name}</div>
                                <div>{item.points}</div>
                              </li>
                            ))}
                            </ul>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <button
                              type="submit"
                              className="inline-flex justify-center border px-4 py-2 text-center text-sm font-medium"
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {items.map((item) => (
            <div className="px-5 py-4" key={item.points}>
              <input
                type="checkbox"
                onChange={() => handleCheckBoxChange(item)}
              ></input>
              <img src={item.image} alt="store item image" />
              <div className="text-center font-semibold">
                {item.name}
                <br />
                <span
                  className={
                    item.points > myPoints ? "text-red-500" : "text-blue-600"
                  }
                >
                  {item.points + " points"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
