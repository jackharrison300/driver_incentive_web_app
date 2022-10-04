# Rest API's
Rest API's are how applications can communicate with one another. Specifically in our app, our front-end will call some /api route and receive, modify, or "delete" some data. With Remix, we don't have to rely on writing our own api calls for page loads and what not since it abstracts a lot of that away, but we will be making calls to our aws.cognito service on login to generate our login credentials.

## Download Postman

https://www.postman.com/downloads/

Postman is a really useful program used for mocking API's. You can save parameters in like the server address, your login credentials, your JWT token (for auth).

You can also save our routes so that if you want to test an api, you can at a click of a button. It makes life a lot easier. It's really useful to learn this application.

## JWT

JWT means Json Web token. It's used to authenticate the user.

https://jwt.io/

The general practice is that the user will login and receive their personal JWT that basically tells our code who they are and what they can access.

- The user logs in and receives the JWT
- They store the token (how we store it is another issue w/ security implications)
- The user sends subsequent requests for exclusive data with the JWT as the bearer token
- The data is sent back

If the user wasn't properly authenticated / they will receive a 403 forbidden error

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403

If you see this error during development, double check your request to see if you are sending the token.

This is an example JWT: d0928ce5-1708-454f-a66e-215201273b9e
