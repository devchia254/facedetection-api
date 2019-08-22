# Face Detection App (Back-end)
`Live:` https://devchia254-facedetection.herokuapp.com/

The Face Detection app is handled under a Node.js server.
This is the source code for the **Back-end**. For the Front-end, [**click here**](https://github.com/devchia254/facedetection).

## Info
- The server is deployed on Heroku.
- API used: [Clarifiai](https://www.clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection)

## Purpose
- To familiarise with server-side development using `Node.js` and `Express.js`.
- Understand the role of middlewares using  `Body-Parser`, `Knex.js` and `cors`.
- Understand fundamental security practices like hashing passwords using `bcrypt`.
- Understand relational databases on storing user data, using `postgreSQL`.

## Code Snippets
Below are some of code extracts of this project.

### server.js:

##### Connect to Database and Middlewares
```javascript
//Connect to PostgreSQL DB using knex
const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl : true
    }
});

const app = express();

app.use(cors()); // Enables CORS requests
app.use(bodyParser.json()); //Parses requests into JSON before 
```

##### Request Handlers
```javascript
app.get('/', (req, res) => { res.send('This is working!'); })
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })
```

##### Connect to Heroku port
```javascript
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})
```

### register.js
##### Apply hash on passwords using `bcrypt`
```javascript
const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //Form Validation at Register
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    // Bcrypt hashing config
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    // Storing email and hashed password into pg db
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login') // Insert into pg login table
        .returning('email')
        .then(loginEmail => {
            return trx('users') // Insert into pg users table
                .returning('*') // return all users
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).
                then(user => {
                    res.json(user[0]); // give back response of user in JSON
                })
        })
        .then(trx.commit) // commit to the transaction or registration
        .catch(trx.rollback) // if anything fails, rollback the changes
    })
    .catch(err => res.status(400).json('Unable to register user'))
};

module.exports = {
    handleRegister: handleRegister
};
```

## NPM Dev Packages:

```json
"dependencies": {
    "bcrypt": "^3.0.6",
    "body-parser": "^1.19.0",
    "clarifai": "^2.9.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "knex": "^0.19.0",
    "pg": "^7.11.0"
}
```
