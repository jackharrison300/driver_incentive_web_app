import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function LandingPage() {
    const user = useOptionalUser();
    return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wallpapertip.com%2Fwmimgs%2F174-1744848_sunbeam-truck-vehicle-volvo-wallpaper-volvo-truck-wallpaper.jpg&f=1&nofb=1&ipt=a5f16af4ce981d300a3654017e5248db6c507d6fa106e709d8a55b1ccf53e233&ipo=images"
                alt="Truck image"
              />
              <div className="absolute inset-0 bg-t2-green bg-opacity-30 mix-blend-multiply" />
            </div>
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32 bg-gradient-to-b from-t2-brown to-transparent">
              <h1 className="text-center font-extrabold text-6xl sm:text-8xl lg:text-9xl rounded-xl border-2 border-t2-red border-opacity-40 pb-4">
                <span className="block uppercase text-t2-lightgreen tracking-tight drop-shadow-lg">T25 WES</span>
              </h1>
              <div className ="mx-auto mt-6 max-w-lg text-center text-xl border-t2-brown border-2 border-opacity-40 sm:max-w-3xl bg-t2-lightgreen bg-opacity-70 rounded-md p-2">
                <b><p className="text-center text-t2-darkgreen text-xl">WE'S THE BEST</p></b>
                <p className="mx-auto mt-2 max-w-lg font-medium text-center text-lg text-t2-darkgreen sm:max-w-3xl">
                  Team 25 World Enterprise Solutions is the best solution for professional drivers on the road. We give you more ways to earn and spend your points. Register with your trucking company to start earning points today.
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-t2-lightgreen px-4 py-3 text-base font-medium text-t2-darkred shadow-sm hover:bg-t2-red sm:px-8"
                  >
                    View Notes for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-t2-lightgreen bg-opacity-80 px-4 py-3 text-base font-medium text-t2-red shadow-sm hover:border-t2-red hover:bg-opacity-100 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md border border-transparent bg-t2-red bg-opacity-80 px-4 py-3 font-medium text-t2-lightgreen hover:border-t2-lightgreen hover:bg-opacity-100"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {[
              {
                src: "https://user-images.githubusercontent.com/1500684/157991167-651c8fc5-2f72-4afa-94d8-2520ecbc5ebc.svg",
                alt: "AWS",
                href: "https://aws.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157991935-26c0d587-b866-49f5-af34-8f04be1c9df2.svg",
                alt: "DynamoDB",
                href: "https://aws.amazon.com/dynamodb/",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157990874-31f015c3-2af7-4669-9d61-519e5ecfdea6.svg",
                alt: "Architect",
                href: "https://arc.codes",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                alt: "Tailwind",
                href: "https://tailwindcss.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
                alt: "MSW",
                href: "https://mswjs.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
                alt: "Vitest",
                href: "https://vitest.dev",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org",
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} className="object-contain" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
    );
}