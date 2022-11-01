import {useEffect} from "react";

const useHandleCognitoCode = () => {
    useEffect (() => {
      const queryParam = window.location.search;
      const currURLParams = new URLSearchParams(queryParam);

      if(!currURLParams.has('code')){
        return
      }

      // always 404's, not sure whats going on
      //window.location.href = 'https://61rc2moud3.execute-api.us-east-1.amazonaws.com/app'

      const currURL = window.location.hostname;
      // const cognitoClientId = process.env.COGNITO_CLIENT_ID;
      const cognitoClientId = "5lmi5ls07ca66e0ult69ca6tmp";
      // const cognitoURL = process.env.COGNITO_URL;
      const cognitoURL = "https://t25.auth.us-east-1.amazoncognito.com";


      // get JWT from cognito
      // This only works in prod, but localhost
      const authBodyParams = new URLSearchParams({
        grant_type: "authorization_code",
        code: currURLParams.get('code')?.toString(),
        client_id: cognitoClientId,
        redirect_uri: currURL + '/app',
        scope: "openid"
      });
      console.log(authBodyParams.toString());
      const tokenURL = new URL(cognitoURL + '/oauth2/token');
    

      console.log(authBodyParams);
      console.log(tokenURL);

      const res = fetch(tokenURL, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
        body: authBodyParams
      }).then(
        res => {
          console.log(res.body);
          // store JWT (but not actually. This usually fails)
          localStorage.setItem('id_token',res.id_token);
          localStorage.setItem('access_token',res.access_token);
          localStorage.setItem('refresh_token',res.refresh_token);
          // redirect to /app
          console.log('stored some cookies... 🍪🍪🍪')
          
          // direct account types
          window.location.replace("/app/apply");
        }
      )

    },[]);
}
export default useHandleCognitoCode;