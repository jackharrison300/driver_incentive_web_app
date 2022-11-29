import { Prisma } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  for (const pair of form.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }
  const [name, pointDollarValue, companyIdStrUnchecked, redirectUri] = [form.get('name'), form.get('pointDollarValue'), form.get('companyId'), form.get('redirectUri')];
  const errors: {name?: string, pointDollarValue?: string, companyId?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof name !== 'string' || containsHtml(name))
    errors.name = 'Invalid name';
  if (typeof pointDollarValue !== 'string')
    errors.pointDollarValue = 'Invalid point dollar value';
  if (typeof companyIdStrUnchecked !== 'string' || containsHtml(companyIdStrUnchecked))
    errors.companyId = 'Invalid company id';
  const companyIdNum = parseInt(companyIdStrUnchecked as string);
  if (isNaN(companyIdNum))
    errors.companyId = 'Invalid company id';
  if (typeof redirectUri !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // we could add some try catches here for graceful error handling
  await prisma.company.update({
    where: { id: companyIdNum },
    data: {
        name: (name as string), // this type assertion is safe because of validation above
        pointDollarValue: new Prisma.Decimal(pointDollarValue as string)
    }
  });
  return redirect(redirectUri as string);
}
