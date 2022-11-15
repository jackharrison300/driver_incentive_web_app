import { Admin, Role, SsoProvider } from '@prisma/client';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { AdminCreateUserCommand, AdminCreateUserCommandOutput, CognitoIdentityProviderClient, CognitoIdentityProviderClientResolvedConfig } from '@aws-sdk/client-cognito-identity-provider';
import { prisma } from '../../../server';
import { containsHtml } from '../../shared_functions';

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

  // these type assertions are safe because of validation above
  const [name, email, redirectUri] = [nameUnchecked as string, emailUnchecked as string, redirectUriUnchecked as string];

  // create cognito user
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Username: email,
    UserAttributes: [{ Name: 'name', Value: name }],
  });
  let response: AdminCreateUserCommandOutput;
  try {
    response = await client.send(command);
  } catch(e) {
    throw new Error("Network failure on Cognito call\n" + e);
  }
  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error("Cognito call failed - Status code != 200");
  }

  // create user in db
  // we could add some try catches here for graceful error handling
  const user = await prisma.user.create({ data: {
    email: (email as string),
    name: (name as string),
    ssoProvider: SsoProvider.COGNITO_USER_POOL,
    // TODO: Implement w/ cognito id
    ssoIdentifier: (email as string),
    role: Role.ADMIN
  }});
  await prisma.admin.create({ data: { userId: user.id }});
  return redirect(redirectUri as string);
}
