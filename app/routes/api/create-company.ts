import { Prisma } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [name, pointDollarValue, redirectUri] = [form.get('name'), form.get('pointDollarValue'), form.get('redirectUri')];
  const errors: {name?: string, pointDollarValue?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof name !== 'string' || containsHtml(name))
    errors.name = 'Invalid name';
  if (typeof pointDollarValue !== 'string')
    errors.pointDollarValue = 'Invalid email address';
  if (typeof redirectUri !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // we could add some try catches here for graceful error handling
  await prisma.company.create({ data: {
    name: (name as string), // this typecast is safe because of validation above
    pointDollarValue: new Prisma.Decimal(pointDollarValue as string),
    logoUrl: (name as string) // to be replaced when we implement logo url
  }});
  return redirect(redirectUri as string);
}
