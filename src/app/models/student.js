const mongoose = require('../../database');

const StudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;