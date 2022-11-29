import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Prisma } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { cognitoCreateGroup, containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [nameUnchecked, pointDollarValueUnchecked, redirectUriUnchecked] = [form.get('name'), form.get('pointDollarValue'), form.get('redirectUri')];
  const errors: {name?: string, pointDollarValue?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof nameUnchecked !== 'string' || containsHtml(nameUnchecked))
    errors.name = 'Invalid name';
  if (typeof pointDollarValueUnchecked !== 'string')
    errors.pointDollarValue = 'Invalid point dollar value';
  if (typeof redirectUriUnchecked !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  // these type assertions are safe because of validation above
  const [name, pointDollarValue, redirectUri] = [nameUnchecked as string, pointDollarValueUnchecked as string, redirectUriUnchecked as string];

  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  const newCompany = await prisma.company.create({ data: {
    name,
    pointDollarValue: new Prisma.Decimal(pointDollarValue),
    logoUrl: name // to be replaced when we implement logo url
  }})
  await Promise.all([
    cognitoCreateGroup(client, newCompany.id + '_sponsors'),
    cognitoCreateGroup(client, newCompany.id + '_drivers'),
  ]);

  return redirect(redirectUri);
}
