var qKeys = [{
    keyToFind: "id",
    getValue: obj => obj.assessment_question.id
}, {
    keyToFind: "answers",
    getValue: obj => obj.assessment_question.question_data.answers
    // getValue: createMapper(obj, aKeys)
}, {
    keyToFind: "correct_comments",
    getValue: obj => obj.assessment_question.question_data.correct_comments
}, {
    keyToFind: "incorrect_comments",
    getValue: obj => obj.assessment_question.question_data.incorrect_comments
}, {
    keyToFind: "neutral_comments",
    getValue: obj => obj.assessment_question.question_data.neutral_comments
}, {
    keyToFind: "points_possible",
    getValue: obj => obj.assessment_question.question_data.points_possible
}, {
    keyToFind: "position",
    getValue: obj => obj.assessment_question.position
}, {
    keyToFind: "question_name",
    getValue: obj => obj.assessment_question.question_data.question_name
}, {
    keyToFind: "question_text",
    getValue: obj => obj.assessment_question.question_data.question_text
}, {
    keyToFind: "question_type",
    getValue: obj => obj.assessment_question.question_data.question_type
}, {
    keyToFind: "bank_id",
    getValue: obj => obj._bank
}];

var aKeys = [{
    keyToFind: "answer_text",
    getValue: obj => obj.assessment_question.question_data.answers[index].text
}, {
    keyToFind: "answer_weight",
    getValue: obj => obj.assessment_question.question_data.answers[index].weight
}, {
    keyToFind: "answer_comments",
    getValue: obj => obj.assessment_question.question_data.answers[index].comments
}, {
    keyToFind: "answer_match_left",
    getValue: obj => obj.assessment_question.question_data.answers[index].left
}, {
    keyToFind: "answer_match_right",
    getValue: obj => obj.assessment_question.question_data.answers[index].right
}, {
    keyToFind: "approximate",
    getValue: obj => obj.assessment_question.question_data.answers[index].approximate
}, {
    keyToFind: "blank_id",
    getValue: obj => obj.assessment_question.question_data.answers[index].blank_id
}, {
    keyToFind: "matching_answer_incorrect_matches",
    getValue: obj => obj.assessment_question.question_data.matching_answer_incorrect_matches
}, {
    keyToFind: "end",
    getValue: obj => obj.assessment_question.question_data.answers[index].end
}, {
    keyToFind: "exact",
    getValue: obj => obj.assessment_question.question_data.answers[index].exact
}, {
    keyToFind: "id",
    getValue: obj => obj.assessment_question.question_data.answers[index].id
}, {
    keyToFind: "numerical_answer_type",
    getValue: obj => obj.assessment_question.question_data.answers[index].numerical_answer_type
}, {
    keyToFind: "margin",
    getValue: obj => obj.assessment_question.question_data.answers[index].margin
}, {
    keyToFind: "precision",
    getValue: obj => obj.assessment_question.question_data.answers[index].precision
}, {
    keyToFind: "start",
    getValue: obj => obj.assessment_question.question_data.answers[index].start
}, {
    keyToFind: "text_after_answers",
    getValue: obj => obj.assessment_question.question_data.text_after_answers
}];

function createMapper(objList, keys) {
    var mapper = (objList, keys) => {
        objList.map(obj => {
            var objOut = keys.reduce((accum, key, i) => {
                var foundKey = key.getValue(obj);
                if (foundKey !== undefined) {
                    accum[key.keyToFind] = foundKey;
                }
                return accum;
            });
            return objOut;
        });
    }

    return mapper;
}

function createCanvasObj(questions) {
    var questionsOut = questions;

    // questionsOut = questions.map(createMapper(questions, qKeys));

    return questionsOut;
}

module.exports = createCanvasObj;