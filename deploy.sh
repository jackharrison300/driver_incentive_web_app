# make layer for dependencies
cp {package.json,package-lock.json,prisma/schema.prisma} layer/nodejs
npm install --omit=dev --prefix layer/nodejs
cd layer/nodejs
npx prisma generate
rm schema.prisma
rm -R node_modules/prisma
# the next three lines are a hack to cut down our layer size
# cf. https://www.prisma.io/docs/guides/deployment/deployment-guides/caveats-when-deploying-to-aws-platforms#aws-lambda-upload-limit
rm -R node_modules/@prisma/engines
cd node_modules/.prisma/client
rm $(ls libquery_engine* | grep -v libquery_engine-rhel-openssl-1.0.x.so.node)
cd ../../../..
rm layer.zip
zip -r layer.zip nodejs
cd ..

# build app
rm -R server/*
npm run build

# deploy
sam deploy

# set cognito callback/logout url to api url
# note that if we try to do this in the sam template, we get a circular dependency
# (unless we reverse the dependency and store the cognito client id in parameter store,
# which would also be a reasonable approach, though would have a slight performance cost)
cognito_client_id=$(aws cloudformation describe-stacks --query "Stacks[?StackName=='t25prod'][].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text)
cognito_userpool_id=$(aws cloudformation describe-stacks --query "Stacks[?StackName=='t25prod'][].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text)
api_url=$(aws cloudformation describe-stacks --query "Stacks[?StackName=='t25prod'][].Outputs[?OutputKey=='API'].OutputValue" --output text)
aws cognito-idp update-user-pool-client --user-pool-id $cognito_userpool_id --client-id $cognito_client_id \
    --callback-urls $api_url http://localhost:3000 --logout-urls $api_url  http://localhost:3000 \
    --supported-identity-providers COGNITO --allowed-o-auth-flows code \
    --allowed-o-auth-scopes email openid profile --allowed-o-auth-flows-user-pool-client

# s3 upload
sbucket=$(aws cloudformation describe-stacks --query "Stacks[?StackName=='t25prod'][].Outputs[?OutputKey=='StaticBucket'].OutputValue" --output text)
aws s3 cp public/. $sbucket --recursive