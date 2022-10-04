import { Link, useLoaderData } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import type { LoaderFunction } from "@remix-run/node";
import useDarkMode from '../components/hooks/useDarkMode';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useEffect } from "react";
import useHandleCognitoCode from "../hooks/useHandleCognitoCode";

type RequestContext = {domainName: string}

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

export const loader: LoaderFunction = async ({
  context
}) => {
  const isDevEnv = (process.env.NODE_ENV == "development");
  const cognitoUrl = process.env.COGNITO_URL;
  const cognitoClientId = process.env.COGNITO_CLIENT_ID;
  // this will be e.g. "apiid.execute-api.us-east-1.amazonaws.com"
  // we could use parameter store to store this rather than pull it from the event context,
  // both seem reasonable approaches, though parameter store would have a slight performance cost.
  // we could also make it an env variable, but we'd have to do it manually in the console every
  // deployment, as doing it in SAM involves a circular dependency
  const appUrl = isDevEnv ?
    'http://localhost:3000' :
    'https://' + (context.requestContext as RequestContext).domainName;
  const querystring = 'client_id=' + cognitoClientId + '&response_type=code&scope=email+openid+profile&redirect_uri=' + appUrl;
  return {
    loginUrl: cognitoUrl + '/login?' + querystring,
    signupUrl: cognitoUrl + '/signup?' + querystring,
  };
};

export default function LandingPage() {
    const user = useOptionalUser();
    const { loginUrl, signupUrl } = useLoaderData();
    useHandleCognitoCode();
    return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center
                     bg-light text-dark dark:bg-dark dark:text-light">
      <div className="relative sm:pb-16 sm:pt-8 border-2 border-lightgray dark:border-darkgray">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden">
            <div className="absolute inset-0 border-2 border-lightgray dark:border-darkgray" />
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32 bg-gradient-to-b from-t2-brown to-transparent">
            <div className="p-4"><ThemeIcon /></div>
              <h1 className="text-center font-extrabold text-6xl sm:text-8xl lg:text-9xl rounded-xl border-2 border-lightgray dark:border-darkgray pb-4 shadow-xl">
                <span className="block uppercase tracking-tight">T25 WES</span>
              </h1>
              <div className ="mx-auto mt-6 max-w-lg text-center text-xl border-2 border-lightgray dark:border-darkgray sm:max-w-3xl rounded-md p-2">
                <b><p className="text-center text-primary text-xl">WE'S THE BEST</p></b>
                <p className="mx-auto mt-2 max-w-lg font-medium text-center text-lg sm:max-w-3xl">
                  Team 25 World Enterprise Solutions is the best solution for professional drivers on the road. We give you more ways to earn and spend your points. Register with your trucking company to start earning points today.
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent border-lightgray dark:border-darkgray px-4 py-3 text-base font-medium shadow-sm sm:px-8"
                  >
                    View Notes for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <a
                      href={signupUrl}
                      className="flex items-center justify-center rounded-md sm:px-8 px-4 py-3 text-base font-medium shadow-sm
                                 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary"
                    >
                      Sign up
                    </a>
                    <a
                      href={loginUrl}
                      className="flex items-center justify-center rounded-md sm:px-8 px-4 py-3 text-base font-medium shadow-sm
                                 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary"
                    >
                      Log In
                    </a>
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