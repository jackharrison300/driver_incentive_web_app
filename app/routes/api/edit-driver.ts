import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [name, email, companyIdStr, originalEmail, redirectUri] = [form.get('name'), form.get('email'), form.get('companyId'), form.get('originalEmail'), form.get('redirectUri')];
  const errors: {name?: string, email?: string, companyId?: string, originalEmail?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof name !== 'string' || containsHtml(name))
    errors.name = 'Invalid name';
  if (typeof email !== 'string' || containsHtml(email) || !email.includes('@'))
    errors.email = 'Invalid email address';
  if (typeof companyIdStr !== 'string' || containsHtml(companyIdStr))
    errors.companyId = 'Invalid company id';
  const companyIdNum = parseInt(companyIdStr as string);
  if (isNaN(companyIdNum))
    errors.companyId = 'Invalid company id';
  if (typeof originalEmail !== 'string')
    errors.originalEmail = 'Invalid original email address';
  if (typeof redirectUri !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // we could add some try catches here for graceful error handling
  const user = await prisma.user.update({
    where: { email: (originalEmail as string) },
    data: {
        email: (email as string), // this typecast is safe because of validation above
        name: (name as string)
    }
  });
  await prisma.driver.update({
    where: { userId: user.id },
    data: {
        companyId: companyIdNum
    }
  });
  return redirect(redirectUri as string);
}
