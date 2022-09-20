# AWS Cognito

From the docs: Amazon Cognito provides authentication, authorization, and user management for your web and mobile apps. Your users can sign in directly with a user name and password, or through a third party such as Facebook, Amazon, Google or Apple.

## Links to tutorials / docs
- https://blog.logrocket.com/implement-oauth-2-0-node-js/
- https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html
- https://www.stackery.io/blog/authentication-aws-cognito/

## Jacob's Thoughts

AWS Cognito would be a pretty good idea to manage our user groups. In our app, we have 3 main types of users, some with overlapping permissions. I've drawn out what I think a user should be able to do in a diagram in the Google Drive. Below is the version as of Sep 18. Feel free to change it / this document.

![User roles.png](/.attachments/User%20roles-c645f6e1-972f-4df3-a8d4-cd15fac1c87c.png)

Basically what AWS Cognito is going to provide the user with their respective JWT tokens authorize their requests. All Lambda functions behind the AWS API Gateway can have this auth feature. I don't know how this will interact with the Remix routing and loading the front-end. This is a big todo.

For our first steps, we can flesh out our /api routes with Lambda code. This will be a great place to start working with Node.js as the Lambda functions themselves are loosely coupled from the code architecture.