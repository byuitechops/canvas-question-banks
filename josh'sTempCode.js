async function getQ(qId, bankId, courseId, token) {
    var data = {}
      , p = {
        "assessment_question[assessment_question_bank_id]": bankId,
        _method: "PUT",
        authenticity_token: token
    };

    function makeRequest(url, method, data) {
        function objToFormString(obj) {
            if (obj === undefined) {
                return undefined;
            }

            var search = new URLSearchParams(data);

            return search.toString();
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                } else {
                    console.log(httpRequest.statusText);
                }
            }
        };

        httpRequest.open(method, url);
        
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

        

        httpRequest.send(objToFormString(data));
    }

    makeRequest(`https://byui.instructure.com/courses/${courseId}/question_banks/${bankId}/assessment_questions/${qId}`, 'POST', p)
}

getQ(763967, 80338, 80, $.cookie('_csrf_token'));
