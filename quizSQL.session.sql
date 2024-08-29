CREATE DATABASE quizQuestions;
USE quizQuestions;

CREATE TABLE questionsList(
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(500) NOT NULL
);

CREATE TABLE choicesList(
    question_id INT NOT NULL,
    choice VARCHAR(500) PRIMARY KEY NOT NULL,
    is_correct BOOLEAN,
    choice_id INT,
    FOREIGN KEY(question_id) REFERENCES questionsList(question_id)
);

CREATE TRIGGER before_choice_id_insert  
BEFORE INSERT ON choicesList
FOR EACH ROW 
SET NEW.choice_id = (SELECT COALESCE(MAX(choice_id), 0) FROM choicesList WHERE question_id = NEW.question_id) + 1;