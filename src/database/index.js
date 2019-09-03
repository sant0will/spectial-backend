const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb+srv://spectial:spectialwill@cluster0-z1a0k.mongodb.net/test0', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;