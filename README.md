# Command to insert new user
- curl -H "Content-Type: application/json" -d '{"firstName":"API", "lastName":"TEST", "userName":"APITEST", "password":"TEST123", "phoneNumber":"555-555-5555", "email":"test@email.com"}' http://159.203.164.160:5000/routes/users/add

# Command to insert new medication
- curl -H "Content-Type: application/json" -d '{"medName":"DRUG", "currentQuantity":"30", "amountToTake":"1", "refillQuantity":"30", "dateStarted":"2025-03-16", "takeInterval":"24", "timeToTakeAt":"09:00:00", "isTimeAM":"1", "userId":"1"}' http://159.203.164.160:5000/routes/medications/add

# Issues
- Make usernames in the database a unique entry
- put asyncdatabasequery in utils so we can use it in medications and cronJobs without rewriting.
- make login and signup seperate files if we have time!
- Need to pass the jwt to the profile page on successful login with cookies
- Need to implement a way to check in the add medication endpoitn if the med is taken at a specific time each day or at an interval.'
    - Can use default values in the req.body extraction and then implement conditions.
- need a secret key (gitlab secret) to secure and verify jwt tokens. Stretch goal, not needed.
- Need to ensure the front end login has a controled time zone dropdown menu to match whats expected in the endpoints etc.