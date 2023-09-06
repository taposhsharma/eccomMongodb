const mongoose = require('mongoose')

const uri = 'mongodb+srv://tsharma:1234567890@cluster0.ag4jnkk.mongodb.net/eccom?retryWrites=true&w=majority'
 
mongoose.connect(uri)
    .then(client => {
        console.log('connected sucessfully')
    })
    .catch(err=>{ 
        console.log(err)
    })