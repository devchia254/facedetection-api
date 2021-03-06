const handleProfile = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('User profile not found');
            }
        })
        .catch(err => res.status(400).json('Unable to fetch user profile'))
}

module.exports = {
    handleProfile: handleProfile
}