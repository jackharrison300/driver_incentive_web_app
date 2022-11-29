import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { ActionFunction, DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { prisma } from '../../../server';
import { cognitoAddUserToGroup, cognitoAdminRemoveUserFromGroup, cognitoAdminUpdateUserAttributes, containsHtml } from '../../shared_functions';

export const action: ActionFunction = async ({request}: DataFunctionArgs): Promise<Response> => {

  const form = await request.formData();
  const [nameUnchecked, emailUnchecked, oldCompanyIdStrUnchecked, newCompanyIdStrUnchecked, redirectUriUnchecked] = [form.get('name'), form.get('email'), form.get('oldCompanyId'), form.get('newCompanyId'), form.get('redirectUri')];
  const errors: {name?: string, email?: string, oldCompanyId?: string, newCompanyId?: string, redirectUri?: string} = {};

  // validate the fields
  // note: here I'm doing xss validation on input. this is fine for our purposes, but encoding on
  // output is more robust. see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding
  if (typeof nameUnchecked !== 'string' || containsHtml(nameUnchecked))
    errors.name = 'Invalid name';
  if (typeof emailUnchecked !== 'string' || containsHtml(emailUnchecked) || !emailUnchecked.includes('@'))
    errors.email = 'Invalid email address';
  if (typeof oldCompanyIdStrUnchecked !== 'string' || containsHtml(oldCompanyIdStrUnchecked))
    errors.oldCompanyId = 'Invalid company id';
  const oldCompanyIdNum = parseInt(oldCompanyIdStrUnchecked as string);
  if (isNaN(oldCompanyIdNum))
    errors.oldCompanyId = 'Invalid company id';
  if (typeof newCompanyIdStrUnchecked !== 'string' || containsHtml(newCompanyIdStrUnchecked))
    errors.newCompanyId = 'Invalid company id';
  const newCompanyIdNum = parseInt(newCompanyIdStrUnchecked as string);
  if (isNaN(newCompanyIdNum))
    errors.newCompanyId = 'Invalid company id';
  if (typeof redirectUriUnchecked !== 'string')
    errors.redirectUri = 'Invalid redirect uri';
  if (Object.keys(errors).length)
    return json(errors, { status: 422 });

  const [name, email, oldCompanyIdStr, newCompanyIdStr, redirectUri] = [nameUnchecked as string, emailUnchecked as string, oldCompanyIdStrUnchecked as string, newCompanyIdStrUnchecked, redirectUriUnchecked as string];

  const user = await prisma.user.update({
    where: { email },
    data: {
      name
    }
  });

  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  await Promise.all([
    cognitoAdminUpdateUserAttributes(client, email, name),
    oldCompanyIdStr !== newCompanyIdStr ? Promise.all([
      prisma.driver.update({
        where: { userId: user.id },
        data: {
            companyId: newCompanyIdNum
        }
      }),
      cognitoAdminRemoveUserFromGroup(client, email, oldCompanyIdStr + '_drivers'),
      cognitoAddUserToGroup(client, email, newCompanyIdStr + '_drivers')
    ]) : Promise.resolve()
  ]);
  return redirect(redirectUri);
}
