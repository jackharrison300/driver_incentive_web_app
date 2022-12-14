# AWS Cognito

From the docs: Amazon Cognito provides authentication, authorization, and user management for your web and mobile apps. Your users can sign in directly with a user name and password, or through a third party such as Facebook, Amazon, Google or Apple.

## Links to tutorials / docs
- https://blog.logrocket.com/implement-oauth-2-0-node-js/
- https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html
- https://www.stackery.io/blog/authentication-aws-cognito/
- JWT decoding libs https://openid.net/developers/jwt/ 
- JWT info https://www.rfc-editor.org/rfc/rfc7517

## Dynamic Link 
 - Cognito hosted login UI w/ access code
     - https://t25.auth.us-east-1.amazoncognito.com/login?client_id=CLIENT_ID_GOES_HERE&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=URI_GOES_HERE
 - Cognito hosted login UI w/ access token (probably only use this in dev for postman testing)
     - https://t25.auth.us-east-1.amazoncognito.com/login?client_id=CLIENT_ID_GOES_HERE&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=URI_GOES_HERE
 - Cognito user pool JWKS
     - https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json

# Cognito auth Flow

### SAM start up reqs

 - Create Cognito user pool for our entire application
     - redirect to base app page
 - Download and store the user pool public key JWKS
 - Create an admin user group
 - Create an unsponsored driver group
 - Add a default admin login for start up

### User login
 - Landing page w/ link to Cognito hosted ui
 - Redirect to empty base app page
 - Extract and verify token from redirect url parameter
 - Verify token claims
 - Populate base app page with data depending on cognito:groups
    - For company "foo", there should be "foo_drivers" and "foo_sponsors" user groups created dynamically.

### Authorizing server resources with JWT
We will get the user pool from our JWT, with that string, we can authorize specific routes.

Example of user group names:

 - admin
 - unsponsored_drivers
 - foo_sponsors
 - foo_drivers
 - bar_sponsors
 - bar_drivers
 - baz_sponsors
 - baz_drivers

We can write a utility function to check our JWT for this user group name.

### Adding a Company as an admin
 - Login as admin
 - Navigate to "Create a new Company"
 - Fill in Company details
      - company_name  // needs form validation
      - Logo URL
      - new Sponsor user
           - username
           - password
 - Create the company_name_drivers and company_name_sponsors user groups
 - Create a new dummy "proto" Sponsor account and add it to company_name_sponsors
