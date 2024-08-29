import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import {createQuestion, updateQuestion, deleteQuestion, getQuestion, questionList, checkAnswer} from './database.js';

const app = express()
const router = express.Router()

app.use(express.json());

mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

/*
app.get("/test", (req, res) => {
    res.status(200).send("<h1> help </h1>")
});
*/

app.post("/create", async (req, res) => {
    const {question, choice, is_correct} = req.body
        const create__question = await createQuestion(question, choice, is_correct)
        res.status(200)
});

app.put("/update/:id", async (req, res) => {
    const id = req.params.id
    const {new_question, new_choice, is_correct, chosen_choice_id} = req.body
    const create__question = await updateQuestion(new_question, id, new_choice, is_correct, chosen_choice_id)
    res.status(204)
}); 

app.delete("/delete/:id", async(req, res) => {
    const id = req.params.id
    const delete__question = await deleteQuestion(id)
    res.send(delete__question)
})

app.get("/get/:id", async(req, res) => {
    const id = req.params.id
    const get__question = await getQuestion(id)
    res.send(get__question)
})

app.get("/list", async(req, res) => {
    const list__question = await questionList()
    res.send(list__question)
})  

app.post("/check-answer/:qid/:aid", async(req, res) => {
    const question_id = req.params.qid
    const chosen_id = req.params.aid
    const check__answer = await checkAnswer(question_id, chosen_id)
    res.send(`Your answer is: ${check__answer}`)
})


const PORT = process.env.PORT;

app.listen(PORT, () =>{
    console.log("Server Running");
});