import {useEffect} from "react";

const useHandleCognitoCode = () => {
    useEffect (() => {
      const queryParam = window.location.search;
      const currURLParams = new URLSearchParams(queryParam);

      if(!currURLParams.has('code')){
        return
      }

      const currURL = window.location.hostname
      const cognitoClientId = "5lmi5ls07ca66e0ult69ca6tmp" 
      const cognitoURL = "https://t25.auth.us-east-1.amazoncognito.com" // TODO Parameter store

      // get JWT from cognito
      // FIXME this is broke
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
        body: authBodyParams.toString()
      }).then(
        res => {
          console.log(res.body);
        }
      )
      // store JWT

      // redirect to /app


    },[]);
}
export default useHandleCognitoCode;