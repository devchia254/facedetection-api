const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '6ee2b305556341c99a57b6373763d1b8'
   });

const handleApiCall = (req, res) => {
    // req.body.input is the image url inputted from the fetch method '/imageUrl' at the onButtonSubmit function
    app.models
       .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
       .then(data => {
           res.json(data);
       })
       .catch(err => res.status(400).json('Cannot connect to API key'))
}

const handleImage = (req, res, db) => {
    // console.log('req.params', req.params);
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}