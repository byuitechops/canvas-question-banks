var qKeys = [{
    keyToFind: "id",
    getValue: (obj, scopedData) => obj.assessment_question.id
}, {
    keyToFind: "correct_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.correct_comments || obj.assessment_question.question_data.correct_comments_html
}, {
    keyToFind: "incorrect_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.incorrect_comments || obj.assessment_question.question_data.incorrect_comments_html
}, {
    keyToFind: "neutral_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.neutral_comments || obj.assessment_question.question_data.correct_comments_html
}, {
    keyToFind: "points_possible",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.points_possible
}, {
    keyToFind: "position",
    getValue: (obj, scopedData) => obj.assessment_question.position
}, {
    keyToFind: "question_name",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_name
}, {
    keyToFind: "question_text",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_text
}, {
    keyToFind: "question_type",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_type
}, {
    keyToFind: "bank_id",
    getValue: (obj, scopedData) => obj._bank
}, {
    keyToFind: "answers",
    //getValue: (obj, scopedData) => obj.assessment_question.question_data.answers
    getValue: (obj, scopedData) => mapper(obj.assessment_question.question_data.answers, aKeys, obj)
}];

// list of all keys on the canvas answer object
// keyToFind: 
var aKeys = [{
    keyToFind: /* "answer_text" */'text',
    getValue: (obj, scopedData) => obj.text
}, {
    keyToFind: /* "answer_weight" */'weight',
    getValue: (obj, scopedData) => obj.weight
}, {
    keyToFind: /* "answer_comments" */'comments',
    getValue: (obj, scopedData) => obj.comments || obj.comments_html
}, {
    keyToFind: /* "answer_match_left" */'left',
    getValue: (obj, scopedData) => obj.left
}, {
    keyToFind: /* "answer_match_right" */'right',
    getValue: (obj, scopedData) => obj.right
}, {
    keyToFind: "approximate",
    getValue: (obj, scopedData) => obj.approximate
}, {
    keyToFind: "blank_id",
    getValue: (obj, scopedData) => obj.blank_id
}, {
    keyToFind: "matching_answer_incorrect_matches",
    getValue: (obj, scopedData) => scopedData.assessment_question.question_data.matching_answer_incorrect_matches
}, {
    keyToFind: "end",
    getValue: (obj, scopedData) => obj.end
}, {
    keyToFind: "exact",
    getValue: (obj, scopedData) => obj.exact
}, {
    keyToFind: "id",
    getValue: (obj, scopedData) => obj.id
}, {
    keyToFind: "numerical_answer_type",
    getValue: (obj, scopedData) => obj.numerical_answer_type
}, {
    keyToFind: "margin",
    getValue: (obj, scopedData) => obj.margin
}, {
    keyToFind: "precision",
    getValue: (obj, scopedData) => obj.precision
}, {
    keyToFind: "start",
    getValue: (obj, scopedData) => obj.start
}, {
    keyToFind: "text_after_answers",
    getValue: (obj, scopedData) => scopedData.assessment_question.question_data.text_after_answers
}];



function mapper(objList, objKeys, scopedData) {
    var listOut = objList.map(obj => {
        var objOut = objKeys.reduce((accum, objKey) => {
            var keyName = objKey.keyToFind;
            var foundKey = objKey.getValue(obj, scopedData);
            if (foundKey !== undefined) {
                accum[keyName] = foundKey;
            }
            return accum;
        }, {});
        return objOut;
    });

    return listOut;
}

function createCanvasObj(questions) {
    // var questionsOut = questions.map(question => {
    //     var qOut = qKeys.reduce((accum, qKey) => {
    //         var keyName = qKey.keyToFind;
    //         var foundKey = qKey.getValue(question);
    //         if (foundKey !== undefined) {
    //             accum[keyName] = foundKey;
    //         }
    //         return accum;
    //     }, {});
    //     return qOut;
    // });
    var questionsOut = mapper(questions, qKeys);

    return questionsOut;
}

module.exports = createCanvasObj;