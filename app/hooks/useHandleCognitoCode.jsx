import {useEffect} from "react";

const useHandleCognitoCode = () => {
    useEffect (() => {
      const queryParam = window.location.search;
      const currURLParams = new URLSearchParams(queryParam);

      if(!currURLParams.has('code')){
        return
      }

      const currURL = window.location.hostname;
      const cognitoClientId = process.env.COGNITO_CLIENT_ID;
      const cognitoURL = process.env.COGNITO_URL;

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
          // store JWT
          localStorage.setItem('id_token',res.id_token);
          localStorage.setItem('access_token',res.access_token);
          localStorage.setItem('refresh_token',res.refresh_token);
          // redirect to /app
          console.log('stored some cookies... 🍪🍪🍪')
        }
      )
    },[]);
}
export default useHandleCognitoCode;