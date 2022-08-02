#NOtes and objects
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and score


#notes 
game 
states, 
    not started,
    started, jump to next, 
    ended : time is 0 or attempted all questions

    question: {
        question,
        choices: [],
        evaluator: (submission) => submission == answer
    }

git cheat sheet

gather items: `git add .` //. means all in this directory and subdirectories
put everthing in an envelope: `git commit -m "some messag"` -m "extra messages" ....: add files to the evelopment and add label stickers with -m 

send the envelope: `git push origin branch`