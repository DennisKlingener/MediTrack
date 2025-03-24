# Medi-Track

## To access the website from a browser
- Go to http://159.203.164.160:5000/

## To access the server:
- Use the command "ssh root@159.203.164.160" in your terminal to ssh into the server.
- It will ask you for a password it is listed in the discord as well.

## To access MYSQL on the server:
- Run "mysql -u root -p" to log into the servers mysql database.
- This command will also ask you for a password it is the same password in the discord used to ssh into the server.
- From here you can access the MediTrack database.

## Important notes about modifying files directly on the server:
- Modifying files directly on the server should be avoided as it disrupts the workflow that automatically pushes the latest main to the server on a successful merge. 
- Modifying files directly on the server also makes the main branch on the github out of date.
- If you do modify files on the server make sure to revert your changes by using "git restore /path/to/modified/file.txt"

## To contribute to the project:
- Clone the project and make sure main is up to date.
- Create a feature branch for whatever you're working on.
- On each commit to your feature branch a github action will ensure that the project sill builds.
- To commit to the main branch open a pull request:
    - Go to your feature branch and select "contribute", then "open pull request".
    - Follow the steps to complete opening a pull request.
    - For each pull request a pipeline will run to again ensure the project with your new code builds successfully.
        - Note: This test must pass in order for you to merge. 
    - If the update button is present make sure to press it to ensure your branch is up to date with main!!!
    - When available, select the green merge / pull button.
        - This will pull your feature branch into main.
    - On a successful pull / merge into main, another gitlab action will take the new changes to main and automatically push them to the live server for you. You can track this jobs progress under "actions" on the github.
    - Note when merging a branch to main you have an option to delete the old feature branch on completion of the merge. I recommend keeping it around just in case there are errors the gitlab action didn't catch. This allows you to keep working on the feature branch without having to make a new one. You can follow the same process again to merge your fixes. 

## Main features we need to complete:
- Frontend:
    - home page
    - sign up page
    - sign in page
    - profile page
        - Need UI to add and delete medications here.
    - all the logic to connect to the api/backend
- Backend:
    - Cron job to check for medications that will need a refill soon
    - Cron job to check for medications that are taken at an interval (Get meds to take at a specific time working first)
    - Need to implement the third party API for two factor authentication
    - Need to implement a third party API to send texts to users
    - Going to need a sign up api endpoint. Can probably use "/add" in users.js. 

## Issues:
- Make usernames in the database a unique entry
- put asyncdatabasequery in utils so we can use it in medications and cronJobs without rewriting.
- make login and signup separate files if we have time!
- Need to pass the jwt to the profile page on successful login with cookies
- Need to implement a way to check in the add medication endpoint if the med is taken at a specific time each day or at an interval.
    - We can use default values in the req.body extraction and then implement conditions.
- need a secret key (gitlab secret) to secure and verify jwt tokens. Stretch goal, not needed.
- Need to ensure the front end login has a controlled time zone drop down menu to match whats expected in the endpoints etc.
- Need to place our api endpoints in our .env or a gitlab secret. These need to be secure.
- Implement error messages in the UI for login and signup errors.

## Notes:
- Wont be able to test the jwt token stuff until the signup page is done and functional.
    - With the jwt token code, we wont be able to use curl to add meds. Do it inside the server.

## Command to insert new user:
- curl -H "Content-Type: application/json" -d '{"firstName":"API", "lastName":"TEST", "userName":"APITEST", "password":"TEST123", "phoneNumber":"555-555-5555", "email":"test@email.com"}' http://159.203.164.160:5000/routes/users/add

## Command to insert new medication (Not available due to JWT implementation):
- curl -H "Content-Type: application/json" -d '{"medName":"DRUG", "currentQuantity":"30", "amountToTake":"1", "refillQuantity":"30", "dateStarted":"2025-03-16", "takeInterval":"24", "timeToTakeAt":"09:00:00", "isTimeAM":"1", "userId":"1"}' http://159.203.164.160:5000/routes/medications/add