const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //Form Validation at Register
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login') // Insert into login table
        .returning('email')
        .then(loginEmail => {
            return trx('users') // insert into users table
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
        .then(trx.commit) // commit to the insertion
        .catch(trx.rollback) // if anything fails, rollback the changes
    })
    .catch(err => res.status(400).json('Unable to register user'))
};

module.exports = {
    handleRegister: handleRegister
};