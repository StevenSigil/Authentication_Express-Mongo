# Authentication - Express, Mongo, JS packages.

### Password handling methods learned from this module: 

- Plain text directly to MongoDB

- mongoose-encryption pkg. 
    - Using a secret key to encrypt the password field before save/retrieve.

- Adding dotenv to hold secret key for encryption/decryption.

- md5 pkg
    - Store as md5 encryption key on user creation 
    - Retrieve by same password being entered.

- bcrypt pkg.
    - Adding auto generated *Salting* to the input before saving the hash password.

- Switching to a session based authentication with express-session, passport, & passport-local-mongoose

- Switched to an OAuth2 method of authentication with google api. 
    - Also implemented the social buttons module for quick styling.

- Finally, finished the app by adding the functionality to allow a user to post a *secret* anonymously.  (Not done in the best way, but OK for scope of project.)