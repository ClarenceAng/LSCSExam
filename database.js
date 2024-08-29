import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

    export async function createQuestion(question, choice, is_correct)
    {
        const addQuestion = await pool.query(`
            INSERT INTO questionsList (question) 
            VALUES(?)`, [question])

        const question_id = addQuestion[0].insertId;
        
        const addChoice = await pool.query(`
            INSERT INTO choicesList (question_id, choice, is_correct)
            VALUES(?, ?, ?)`, [question_id, choice, is_correct])

            const data = {
                addQuestion: addQuestion,
                addChoice: addChoice
            }    
        
        return data
    }

export async function updateQuestion(new_question, chosen_question_id)
{
    const [update_Question] = await pool.query(`
        UPDATE questionsList
        SET question = ?
        WHERE question_id = ?`, [new_question, chosen_question_id])
    
        return update_Question
}

export async function updateChoices(new_choice, chosen_choice_id)
{
    const [update_Choices] = await pool.query(`
        UPDATE choicesList
        SET choice = ?
        WHERE choice_id = ?`, [new_choice, chosen_choice_id])

    return update_Choices
}   

export async function deleteQuestion(question_id)
{
    const [delete_Choice] = await pool.query(`
        DELETE FROM choicesList
        WHERE question_id = ?`, [question_id])

    const [delete_Question] = await pool.query(`
        DELETE FROM questionsList
        WHERE question_id = ?`, [question_id])
        const data = {
            delete_Question: delete_Question,
            delete_Choice: delete_Choice
        }

    return data
}

export async function getQuestion(question_id)
{
    const [get_Question] = await pool.query(`
        SELECT *
        FROM questionsList
        WHERE question_id = ?`, [question_id])

    const [get_Choice] = await pool.query(`
        SELECT *
        FROM choicesList
        WHERE question_id = ?`, [question_id])

    const data = {
        get_Question: get_Question,
        get_Choice: get_Choice
    }

    return data
}

export async function questionList()
{
    const [get_Questions] = await pool.query(`
        SELECT *
        FROM questionsList`)

    const [get_Choices] = await pool.query(`
        SELECT *
        FROM choicesList`)

    const data = {
        get_Questions: get_Questions,
        get_Choices: get_Choices
    }

    return data
}

export async function checkAnswer(question_id, chosen_id)
{
    const [check_Answer] = await pool.query(`
        SELECT *, CASE
        WHEN question_id = ? AND choice_id = ? AND is_correct = TRUE THEN 'Correct!'
        WHEN question_id = ? AND choice_id = ? AND is_correct = FALSE THEN 'Wrong!'
        END AS final_decision
        FROM choicesList
        WHERE question_id = ? AND choice_id = ?`, [question_id, chosen_id, question_id, chosen_id, question_id, chosen_id])

        const final_decision = check_Answer.length > 0 ? check_Answer[0].final_decision : 'Invalid';

    return final_decision
}   