# Project Capture Document for Canvas Question Banks
#### *Author: Seth Bolander*

## Background
Paragraph describing context of the needs of the stakeholder. It should focus on the **why** of the project.

-----

## Objectives
- Return every question in all question banks for a desired course
- Function quickly and effectively for use in other tools that need questions/banks
- Have access to edit/delete/create questions within question banks

-----

# Requirements

### Input Requirements

#### Source of Inputs

All inputs are gathered at runtime and should not require any permissions or other sources than the user

#### Definition of Inputs

- **Login Object** <_Object_>: *inputs*, as the main.js file calls it, requires the login object uses the correct casing (shown below).
```javascript
var inputs = {
    userName: process.env.USERNAMENODE,
    passWord: process.env.PASSWORD
}
```
For privacy, environment variables (shown above) can be used. To set these in PowerShell use:
```
$env:USERNAMENODE="_your_admin_username_"
$env:PASSWORD="_your_password_"
```
- **Course Number** <_String_>: The course code for the desired banks: 
```javascript
const course = '46246';
```
---

### Output Requirements
#### Destination

Output can be sent to the console or set as a variable within a project using Canvas Question Banks. It is not stored locally or elsewhere unless a parent program/function saves the output elsewhere.

#### Definition of Outputs

##### Question Banks:
- **course** <_String_>
- **questionBanks** <[[QuestionBank]]>
- **page** <_Puppeteer Page Object_>

##### Question Bank:
- **_course** <_String_>
- **_bank** <_Number_>
- **_id** <_Number_>
- **_questions** <[[Question]]>
- **page** <_Puppeteer Page Object_>

##### Question:
- **_course** <_String_>
- **_bank** <_Number_> (included for internal functionality)
- **bank_id** <_Number_> (included to mimic Canvas API for a Quiz Question)
- **_id** <_Number_> (included for internal functionality)
- **id** <_Number_> (included to mimic Canvas API for a Quiz Question)
- **assessment_question_id** <_Number_>
- **position** <_Number_>
- **question_name** <_String_>
- **question_type** <_String_>
- **question_text** <_String_> (although a _string_, it returns with HTML tags)
- **points_possible** <_Number_>
- **correct_comments** <_String_> (generally an empty string)
- **incorrect_comments** <_String_> (generally an empty string)
- **neutral_comments** <_String_> (generally an empty string)
- **correct_comments_html** <_String_> (contains HTML tags)
- **incorrect_comments_html** <_String_> (contains HTML tags)
- **neutral_comments_html** <_String_> (contains HTML tags)
- **answers** [[Answer]]
- **variables** <_String_>
- **formulas** <_String_>
- **answer_tolerance** <_Number_>
- **formula_decimal_places** <_Number_>
- **matches** <_Object_>
- **matching_answer_incorrect_matches** <_String_>

##### Answer:
- **id** <_Number_>
- **match_id** <_Number_>
- **text** <_String_> (contains HTML tags)
- **weight** <_Number_>
- **comments** <_String_> (generally an empty string)
- **comments_html** <_String_> (contains HTML tags)
- **left** <_String_> (Used only in _matching_ questions)
- **right** <_String_> (Used only in _matching_ questions)
- **blank_id** <_Number_> (Used in fill in _multiple blank_ and _multiple dropdown_ questions)
- **text_after_answers** <_String_> (Used only in _missing word_ questions)
- **numerical_answer_type** <_String_> (Used for _numerical_ questions, see <https://canvas.instructure.com/doc/api/quiz_questions.html> for possible values)
- **precision** <_Number_> (Used only in _precision_ answer for a _numerical_ question)
- **approximate** <_Number_> (Used only in _precision_ answer for a _numerical_ question)
- **start** <_Number_> (Used only in _range_ answer for a _numerical_ question)
- **end** <_Number_> (Used only in _range_ answer for a _numerical_ question)
- **exact** <_Number_> (Used only in _exact_ answer for a _numerical_ question)
- **margin** <_Number_> (Used only in _exact_ answer for a _numerical_ question)

---

### Interface

#### Type: 

As a module within a larger tool.

#### 

No flags, command line input, or UI exist.

-----

## Expectations

### Timeline

### Best Modes of Contact
- Slack: Seth Bolander
- Email: <mailto:bol15015@byui.edu>

### Next Meeting

### Action Items
\**Recap Meeting*\*
#### TechOps
#### Stakeholder

-----

#### *Approved By:* 
#### *Approval Date:*
