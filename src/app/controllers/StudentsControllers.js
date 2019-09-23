const express = require('express');
const Student = require('../models/student');
const router = express.Router();


router.get("/", async (req, res) => {
    return(req);

    if (await Student.findOne({ teacher }))
        return res.status(400).send({ error: "Não existem alunos cadastrados." });
    
    const students = await Student.findOne({ teacher })
    return(students)

});

module.exports = app => app.use('/students', router);