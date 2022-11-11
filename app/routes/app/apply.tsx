import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Role, SsoProvider } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json } from '@remix-run/server-runtime';
import { containsHtml } from '../../shared_functions';
import { prisma } from '../../../server';
import * as Yup from 'yup';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [firstName, lastName, email] = [form.get('firstName'), form.get('lastName'), form.get('email')];
  const errors: {firstName?: string, lastName?: string, email?: string} = {};
  const name = firstName + " " + lastName;
  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof firstName !== 'string' || containsHtml(firstName))
    errors.firstName = 'Invalid first name';
  if (typeof lastName !== 'string' || containsHtml(lastName))
    errors.lastName = 'Invalid last name';
  if (typeof email !== 'string' || containsHtml(email) || !email.includes('@'))
    errors.email = 'Invalid email address';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // we could add some try catches here for graceful error handling
  const user = await prisma.user.create({ data: {
    name: (name as string),
    email: (email as string), // this typecast is safe because of validation above
    ssoProvider: SsoProvider.COGNITO_USER_POOL,
    // TODO: Implement w/ cognito id
    ssoIdentifier: (email as string),
    role: Role.ADMIN
  }});
  await prisma.admin.create({ data: { userId: user.id }});
  return new Response(null, {status: 200})
}

export default function Apply() {
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
        <Form>
          <div className="sm:flex items-center justify-center text-center bg-light text-dark text-xl font-medium dark:bg-dark dark:text-light">
            <div className="max-w-3xl p-8 sm:m-8 border-2 border-lightgray shadow-xl text-center grid grid-flow-row auto-rows-max">
              <div className="pb-4 text-primary text-2xl font-bold border-b-2 mb-4">
                <header />Driver Application Form
              </div>
              <div className="grid grid-cols-2 gap-x-8 text-start">
                {/* First name */}
                <div className="block mb-4">
                  <label>First name</label>
                  <Field name="firstName" type="text" placeholder="John" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md"/>
                  <div className="text-red-500 text-lg">
                    <ErrorMessage name="firstName"/>
                  </div>
                </div>

                {/* Last name */}
                <div className="block mb-4">
                  <label>Last name</label>
                  <Field name="lastName" type="text" placeholder="Doe" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md"/>
                  <div className="text-red-500 text-lg">
                    <ErrorMessage name="lastName"/>
                  </div>
                </div>
                
                {/* Company */}
                <div className="block mb-4">
                  <label>Company name</label>
                  <Field name="company" type="text" placeholder="T25 WES" className="w-full px-4 py-2 min-w-38 border-2 border-lightgray shadow-md"/>
                  <div className="text-red-500 text-lg">
                    <ErrorMessage name="company"/>
                  </div>
                </div>
              </div>
              {/* Email */} 
              <div className="block mb-4 text-start">
                <label htmlFor="email">Email address</label>
                <Field name="email" type="email" placeholder="johndoe@example.com" className="w-full block px-4 py-2 border-2 border-lightgray shadow-md"/>
                <div className="text-red-500 text-lg">
                  <ErrorMessage name="email"/>
                </div>
              </div>

              {/* Reason for application */} 
              <div className="block text-start">
                <label>Reason</label>
                <textarea id="large-input" placeholder="Why are you applying with us?" className="w-full block px-4 py-2 mb-4 border-2 border-lightgray shadow-md"/>
              </div>

              {/* Submit */} 
              <div className="block text-center">
                <button className="px-4 py-2 border-2 border-lightgray dark:border-darkgray dark:bg-dark hover:border-primary hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark dark:hover:border-primary shadow-md"
                        type="submit">
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