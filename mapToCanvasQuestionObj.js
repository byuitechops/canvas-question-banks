// list of all keys on the canvas question object
var qKeys = [{
    keyToFind: "id",
    getValue: (obj, scopedData) => obj.assessment_question.id
}, {
    keyToFind: "bank_id",
    getValue: (obj, scopedData) => obj._bank
}, {
    keyToFind: "assessment_question_id",
    getValue: (obj, scopedData) => obj.assessment_question.id
}, {
    keyToFind: "position",
    getValue: (obj, scopedData) => obj.assessment_question.position
}, {
    keyToFind: "question_name",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_name
}, {
    keyToFind: "question_type",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_type
}, {
    keyToFind: "question_text",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.question_text
}, {
    keyToFind: "points_possible",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.points_possible
}, {
    keyToFind: "correct_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.correct_comments
}, {
    keyToFind: "incorrect_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.incorrect_comments
}, {
    keyToFind: "neutral_comments",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.neutral_comments
}, {
    keyToFind: "correct_comments_html",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.correct_comments_html
}, {
    keyToFind: "incorrect_comments_html",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.incorrect_comments_html
}, {
    keyToFind: "neutral_comments_html",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.correct_comments_html
}, {
    keyToFind: "answers",
    // the getValue for answers maps the array of answers based on the aKeys listed below
    getValue: (obj, scopedData) => mapper(obj.assessment_question.question_data.answers, aKeys, obj)
}, {
    keyToFind: "variables",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.variables
}, {
    keyToFind: "formulas",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.formulas
}, {
    keyToFind: "answer_tolerance",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.answer_tolerance
}, {
    keyToFind: "formula_decimal_places",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.formula_decimal_places
}, {
    keyToFind: "matches",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.matches
}, {
    keyToFind: "matching_answer_incorrect_matches",
    getValue: (obj, scopedData) => obj.assessment_question.question_data.matching_answer_incorrect_matches
}];

// list of all keys on the canvas answer object
var aKeys = [{
    keyToFind: "id",
    getValue: (obj, scopedData) => obj.id
}, {
    keyToFind: "match_id",
    getValue: (obj, scopedData) => obj.match_id
}, {
    keyToFind: "text",
    getValue: (obj, scopedData) => obj.text
}, {
    keyToFind: "weight",
    getValue: (obj, scopedData) => obj.weight
}, {
    keyToFind: "comments",
    getValue: (obj, scopedData) => obj.comments
}, {
    keyToFind: "comments_html",
    getValue: (obj, scopedData) => obj.comments_html
}, {
    keyToFind: "left",
    getValue: (obj, scopedData) => obj.left
}, {
    keyToFind: "right",
    getValue: (obj, scopedData) => obj.right
}, {
    keyToFind: "approximate",
    getValue: (obj, scopedData) => obj.approximate
}, {
    keyToFind: "blank_id",
    getValue: (obj, scopedData) => obj.blank_id
}, {
    keyToFind: "end",
    getValue: (obj, scopedData) => obj.end
}, {
    keyToFind: "exact",
    getValue: (obj, scopedData) => obj.exact
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


/*********************************************************************************
 MAPPER(objList, objKeys, scopedData):
    This function will map an array of questions or an array of answers to create
    an array of canvas question objects that include the correct keys from 
    puppeteer's return.
 objList:
    The array to map. Either an array of questions from a single bank or an array
    of answers from a single question.
 objKeys:
    The list of keys to find and attach to the REDUCE accumulator. (qKeys, aKeys)
 scopedData:
    Answer objects require some 'keys to find' that are on the original question
    object. This variable gives us access to those keys.
 RETURNS: An array of canvas question objects.
 *********************************************************************************/
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

// calls mapper() on the input array of questions
function createCanvasObj(questions) {
    var questionsOut = mapper(questions, qKeys);

    return questionsOut;
}

module.exports = createCanvasObj;