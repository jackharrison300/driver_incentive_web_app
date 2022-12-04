import { AdminAddUserToGroupCommand, AdminCreateUserCommand, AdminCreateUserCommandOutput, AdminRemoveUserFromGroupCommand, AdminRemoveUserFromGroupCommandOutput, AdminUpdateUserAttributesCommand, AdminUpdateUserAttributesCommandOutput, CognitoIdentityProviderClient, CreateGroupCommand, CreateGroupCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

// returns true if contains html symbols
export const containsHtml = (testStr: string): boolean => /[&<>"']/.test(testStr);

export async function cognitoCreateUser(client: CognitoIdentityProviderClient, email: string, name: string): Promise<AdminCreateUserCommandOutput> {
  try {
    return await client.send(new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      UserAttributes: [{ Name: 'name', Value: name }],
    }));
  } catch(e) {
    throw new Error("Network failure on Cognito AdminCreateUser call\n" + e);
  }
}

export async function cognitoAddUserToGroup(client: CognitoIdentityProviderClient, cognitoUsername: string, userGroup: string): Promise<AdminCreateUserCommandOutput> {
  try {
    return await client.send(new AdminAddUserToGroupCommand({
      GroupName: userGroup,
      Username: cognitoUsername,
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    }));
  } catch(e) {
    throw new Error("Network failure on Cognito AdminAddUserToGroup call\n" + e);
  }
}

export async function cognitoCreateGroup(client: CognitoIdentityProviderClient, name: string): Promise<CreateGroupCommandOutput> {
  try {
    return await client.send(new CreateGroupCommand({
      Description: '',
      GroupName: name,
      Precedence: 0,
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    }));
  } catch(e) {
    throw new Error("Network failure on Cognito CreateGroup call\n" + e);
  }
}

export async function cognitoAdminUpdateUserAttributes(client: CognitoIdentityProviderClient, email: string, name: string): Promise<AdminUpdateUserAttributesCommandOutput> {
  try {
    return await client.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      UserAttributes: [{ Name: 'name', Value: name }],
    }));
  } catch(e) {
    throw new Error("Network failure on Cognito AdminUpdateUserAttributes call\n" + e);
  }
}

export async function cognitoAdminRemoveUserFromGroup(client: CognitoIdentityProviderClient, cognitoUsername: string, userGroup: string): Promise<AdminRemoveUserFromGroupCommandOutput> {
  try {
    return await client.send(new AdminRemoveUserFromGroupCommand({
      GroupName: userGroup,
      Username: cognitoUsername,
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    }));
  } catch(e) {
    throw new Error("Network failure on Cognito AdminRemoveUserFromGroup call\n" + e);
  }
}

export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function parseCookie(str: string) {
  return str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc: {[key: string]: string}, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}