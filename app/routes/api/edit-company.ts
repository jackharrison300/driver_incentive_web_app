import { Prisma } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  for (const pair of form.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }
  const [name, pointDollarValue, originalName, redirectUri] = [form.get('name'), form.get('pointDollarValue'), form.get('originalName'), form.get('redirectUri')];
  const errors: {name?: string, pointDollarValue?: string, originalName?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof name !== 'string' || containsHtml(name))
    errors.name = 'Invalid name';
  if (typeof pointDollarValue !== 'string')
    errors.pointDollarValue = 'Invalid point dollar value';
  if (typeof originalName !== 'string')
    errors.originalName = 'Invalid original name';
  if (typeof redirectUri !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // we could add some try catches here for graceful error handling
  await prisma.company.update({
    where: { name: (originalName as string) },
    data: {
        pointDollarValue: new Prisma.Decimal(pointDollarValue as string) // this typecast is safe because of validation above
    }
  });
  return redirect(redirectUri as string);
}
