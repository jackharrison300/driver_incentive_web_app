import { Formik, Field, ErrorMessage } from 'formik';
import { Company, EnrollmentStatus, Role, SsoProvider } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { cognitoCreateUser, containsHtml } from '../../shared_functions';
import { prisma } from '../../../server';
import * as Yup from 'yup';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { CompanyDto } from '../../models/dto';
import { useLoaderData, Form} from '@remix-run/react';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [firstNameUnchecked, lastNameUnchecked, emailUnchecked, companyIdStrUnchecked, reasonUnchecked] =
    [form.get('firstName'), form.get('lastName'), form.get('email'), form.get('companyId'), form.get('reason')];
  const errors: {firstName?: string, lastName?: string, email?: string, companyId?: string, reason?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof firstNameUnchecked !== 'string' || containsHtml(firstNameUnchecked))
    errors.firstName = 'Invalid first name';
  if (typeof lastNameUnchecked !== 'string' || containsHtml(lastNameUnchecked))
    errors.lastName = 'Invalid last name';
  if (typeof emailUnchecked !== 'string' || containsHtml(emailUnchecked) || !emailUnchecked.includes('@'))
    errors.email = 'Invalid email address';
  if (typeof companyIdStrUnchecked !== 'string' || containsHtml(companyIdStrUnchecked))
    errors.companyId = 'Invalid company id';
  const companyIdNum = parseInt(companyIdStrUnchecked as string);
  if (isNaN(companyIdNum))
      errors.companyId = 'Invalid company id';
  if (typeof reasonUnchecked !== 'string' || containsHtml(reasonUnchecked))
    errors.reason = 'Invalid reason';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // these type assertions are safe because of validation above
  const [name, email, reason] =
    [(firstNameUnchecked as string + lastNameUnchecked as string), emailUnchecked as string, reasonUnchecked as string];

  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  const cognitoUsername = (await cognitoCreateUser(client, email, name)).User!.Username!;

  const user = await prisma.user.create({ data: {
      email,
      name,
      ssoProvider: SsoProvider.COGNITO_USER_POOL,
      ssoIdentifier: cognitoUsername,
      role: Role.DRIVER
    }});
  await prisma.driver.create({ data: {
    userId: user.id,
    companyId: companyIdNum,
    enrollmentStatus: EnrollmentStatus.APPLICATION_PENDING,
  }});
  await prisma.driverApplication.create({ data: {
    driverId: user.id,
    applicationReason: reason,
    applicationPdfUrl: '',
    companyId: companyIdNum,
  }});

  return redirect("/app");
}

export const loader: LoaderFunction = async (): Promise<CompanyDto[]> => {
  const companies: Company[] = await prisma.company.findMany({ where: { isActive: true }});
  return companies.map((company: Company) => CompanyDto.fromCompany(company));
}

export default function Apply() {
  const companyDtos: CompanyDto[] = useLoaderData();

  return (
    <>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          companyName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string().email('Invalid email address')
            .email('Invalid email format')
            .required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form method="post">
          <div className="sm:flex items-center justify-center text-center bg-light text-dark text-xl font-medium dark:bg-dark dark:text-light">
            <div className="max-w-3xl p-8 sm:m-8 border-2 border-lightgray shadow-xl text-center grid grid-flow-row auto-rows-max">
              <div className="pb-4 text-primary text-2xl font-bold border-b-2 mb-4">
                <header />Driver Application Form
              </div>
              <div className="grid grid-cols-2 gap-x-8 text-start">
                {/* First name */}
                <div className="block mb-4">
                  <label>First name</label>
                  <Field name="firstName" type="text" placeholder="John" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md dark:text-dark"/>
                  <div className="text-red-500 text-lg">
                    <ErrorMessage name="firstName"/>
                  </div>
                </div>

                {/* Last name */}
                <div className="block mb-4">
                  <label>Last name</label>
                  <Field name="lastName" type="text" placeholder="Doe" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md dark:text-dark"/>
                  <div className="text-red-500 text-lg">
                    <ErrorMessage name="lastName"/>
                  </div>
                </div>
                
                {/* Company */}
                <div className="block mb-4">
                  <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-state'>
                    Company
                  </label>
                  <div className='relative'>
                    <Field as="select" name="companyId" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md dark:text-dark">
                      <option hidden></option>
                      {companyDtos.map((company) =>
                        <option key={company.id} value={company.id.toString()}>{company.name}</option>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              {/* Email */} 
              <div className="block mb-4 text-start">
                <label htmlFor="email">Email address</label>
                <Field name="email" type="email" placeholder="johndoe@example.com" className="w-full block px-4 py-2 border-2 border-lightgray shadow-md dark:text-dark"/>
                <div className="text-red-500 text-lg">
                  <ErrorMessage name="email"/>
                </div>
              </div>

              {/* Reason for application */} 
              <div className="block text-start">
                <label>Reason</label>
                <textarea id="large-input" name="reason" placeholder="Why are you applying with us?" className="w-full block px-4 py-2 mb-4 border-2 border-lightgray shadow-md dark:text-dark"/>
              </div>

              {/* Submit */} 
              <div className="block text-center">
                <button 
                  className="px-4 py-2 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary shadow-md"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  )
}