# Local DB

To set up a local mysql db and connect to it:

Install docker desktop
From project root, `cd localdb`
`docker compose up --detach`

In DBeaver,
- Create new mysql connection
  - Server Host: localhost
  - Port: 3308
  - Database: testapp
  - Username: root
  - Password: helloworld
  - Install mysql driver when prompted
  - In driver -> Driver Properties, add the following two properties:
    - allowPublicKeyRetrieval : true
    - useSSL : false

In .env file, add the following: `DATABASE_URL="mysql://root:helloworld@localhost:3308/testapp"`

To generate and apply a migration, `npx prisma migrate dev`
To apply an already-generated migration, `npx prisma migrate deploy`

Below is the more manual way to do it if the above fails for some reason:

First, if on wsl
- check that you are using wsl 2: `wsl -l -v` in command prompt, not your linux distro
  - you may need to `sudo apt install wsl` first
  - if not using wsl 2, `wsl --set-version (distro name) 2`
- in docker desktop settings->general, check that "Use wsl 2 based engine" is selected
- in command prompt (not your linux distro), `wsl --set-default ubuntu`

If you do not have docker installed,
- `sudo apt-get update`
- `sudo apt install docker.io`

`sudo docker run --name=localdb -d mysql/mysql-server`
`sudo apt-get install mysql-client`
`sudo docker logs localdb`
Copy down the GENERATED ROOT PASSWORD somewhere for use later
`sudo docker exec -it localdb bash`
`mysql -uroot -p`
Enter the password you copied down a few steps ago
Set new password with the password of your choice: `ALTER USER 'root'@'localhost' IDENTIFIED BY '[newpassword]';`