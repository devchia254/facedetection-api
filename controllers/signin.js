const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password} = req.body

    //Form Validation at Register
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            // console.log('isvalid:', isValid);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        // console.log('user:',user);
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json("Wrong credentials inputted"))
}

module.exports = {
    handleSignIn: handleSignIn    
}