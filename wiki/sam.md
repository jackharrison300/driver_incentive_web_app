# AWS SAM
By Jack Harrison and Jacob McFadyen

AWS SAM (Serverless Application Model) is a layer of abstraction on top of AWS CloudFormation
(Infrastructure-as-Code or IaC) to make IaC a bit easier when working with serverless infra.
Some general benefits of using IaC rather than clicking around in the console:
1) Team coordination and clarity on infra choices
2) Clear source of truth with version control on infra details (as opposed to whoever happened
   to be clicking around in the console last)
3) Much easier to get an understanding of the application's infra as a whole
4) Simple recovery if things get deleted and assured record of pre-deleted config (especially
   useful in our case of a shared AWS environment with other teams) 
5) In the case of SAM, it handles a good bit of config for you

I highly recommend the following video as an intro to SAM:
https://www.youtube.com/watch?v=QBBewrKR1qg

# How to set up the SAM CLI for deployment from your machine
Download aws cli https://aws.amazon.com/cli/
	
Download sam https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

Install both command line tools

Go to AWS Dashboard -> IAM in search -> Users in left nav bar -> your user name -> Security credentials -> Create Access Key -> Download csv

In the project, run aws configure then enter the keys you got from IAM
run sam validate

Sam is Serverless Application Model. It's what we will use to manage our infrastructure since we are going mainly serverless. Sam will run through the template.yaml and set up our AWS stuff for us. 

This way we can incrementally change our infrastructure in one place and manage our AWS resources pretty easily. It gives us the added benefit of restarting our entire deployment if things are messing up and we don't know why.

# To deploy
`sam deploy`

SAM also has functionality for local testing - `sam local invoke` but I do not think we will need to set that up
for this project, as we can use remix with our local node environment for local testing.