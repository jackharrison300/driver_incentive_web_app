import { CognitoJwtVerifier } from "aws-jwt-verify";
import { json } from "react-router";

export async function verifyUserRole (request: Request, allowedUserGroups: String [] ){
    // confirm JWT structure
    // Consider Parameter Store
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USERPOOL_ID!,
        tokenUse: "access",
        clientId: process.env.COGNITO_CLIENT_ID!,
        groups: allowedUserGroups.toString(),
    });
 
    try {
        // TODO get Cookie
        const payload = await verifier.verify(
          ""
        );
        console.log("Token is valid. Payload:", payload);
      } catch {
        console.log("Token not valid!");
        throw json({message: "Forbidden"},{status: 403});
      }
    return true;
}
