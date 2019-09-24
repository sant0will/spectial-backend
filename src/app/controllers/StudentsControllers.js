const express = require('express');
const Student = require('../models/student');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId; 


router.get("/index", async (req, res) => {
    const teacher = new ObjectId(req.headers.teacher);

    const students = await Student.find({ teacher });

    if (students.length === 0)
        return res.status(400).send({ error: "Não existem alunos cadastrados." });
    
    return res.send({response: students});
    
});

router.post("/register", async (req, res) => {
    try {
        console.log(req.body)

        const { name } = req.body;
        const teacher = req.headers.teacher;

        if (await Student.findOne({ name }))
            return res.status(400).send({ error: "Estudante já existe." });

        
        const student = await Student.create({
            name,
            teacher
        });

        return res.send({ 
            student, 
        });

    } catch (e) {
        res.status(400).send({ error: 'Falha no registro.' });
        console.log(e)
    }
});

module.exports = app => app.use('/students', router);