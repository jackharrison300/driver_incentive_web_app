import { useEffect } from "react";
import { parseJwt } from "../shared_functions";

const useHandleCognitoCode = () => {
    useEffect (() => {
      const queryParam = window.location.search;
      const currURLParams = new URLSearchParams(queryParam);

      if(!currURLParams.has('code')){
        return
      }

      const currURL = (process.env.NODE_ENV == "development") ? 'http://localhost:3000' :
        'https://' + window.location.hostname;
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
        redirect_uri: currURL,
        scope: "openid"
      });
      console.log(authBodyParams.toString());
      const tokenURL = new URL(cognitoURL + '/oauth2/token');
      console.log(authBodyParams);
      console.log(tokenURL);

      (async () => {
        const res = await fetch(tokenURL, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: authBodyParams.toString()
        });

        const res_json = await res.json();
        console.log(res_json)
        // store JWT
        document.cookie = 'id_token=' + res_json.id_token;
        sessionStorage.setItem('id_token', res_json.id_token);
        sessionStorage.setItem('access_token', res_json.access_token);
        sessionStorage.setItem('refresh_token', res_json.refresh_token);
        // redirect to /app
        console.log('stored some cookies... 🍪🍪🍪')

        const userInfo = parseJwt(res_json.id_token);
        sessionStorage.setItem('user_info', userInfo);
        const userPools = userInfo['cognito:groups'];

        if (userPools === undefined) window.location.replace("/app/apply");
        else if (userPools[0] === 'admins') window.location.replace("/admin/dashboard");
        else if (userPools[0].split('_')[1] === 'sponsors') window.location.replace("/sponsor/dashboard");
        else if (userPools[0].split('_')[1] === 'drivers') window.location.replace("/app/products");
      })();

    },[]);
}
export default useHandleCognitoCode;