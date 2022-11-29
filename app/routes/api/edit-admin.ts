import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { cognitoAdminUpdateUserAttributes, containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [nameUnchecked, emailUnchecked, redirectUriUnchecked] = [form.get('name'), form.get('email'), form.get('redirectUri')];
  const errors: {name?: string, email?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof nameUnchecked !== 'string' || containsHtml(nameUnchecked))
    errors.name = 'Invalid name';
  if (typeof emailUnchecked !== 'string' || containsHtml(emailUnchecked) || !emailUnchecked.includes('@'))
    errors.email = 'Invalid email address';
  if (typeof redirectUriUnchecked !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  const [name, email, redirectUri] = [nameUnchecked as string, emailUnchecked as string, redirectUriUnchecked as string];

  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  await Promise.all([
    cognitoAdminUpdateUserAttributes(client, email, name),
    // we could add some try catches here for graceful error handling
    prisma.user.update({
      where: { email },
      data: {
        name
      }
    })
  ]);
  return redirect(redirectUri);
}
