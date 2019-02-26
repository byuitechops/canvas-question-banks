# Project Capture Document for Canvas Question Banks
#### *Author: Seth Bolander*

## Background
Paragraph describing context of the needs of the stakeholder. It should focus on the **why** of the project.

-----

## Objectives
- Return every question in all question banks for a desired course
- Function quickly and effectively for use in other tools that need questions/banks

-----

# Requirements

### Input Requirements

#### Source of Inputs

All inputs are gathered at runtime and should not require any permissions or other sources than the user

#### Definition of Inputs

- **Login Object**: *inputs*, as the main.js file calls it, requires the login object uses the correct casing (shown below).
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
- **Course Number**: The course code for the desired banks. Must be of type **string**: 
```javascript
const course = '46246';
```
---

### Output Requirements
#### Destination

Paragraph where/who to send outputs. To who? To where: Email, server, directly to LMS...? It would also include the steps to get access to the locations you need, such as getting added to a Trello Board, or access to a server, or the LMS.

#### Definition of Outputs

List here a type definition for each output? For example, if the changes are directly to the LMS, list all changes that occur. If it is a CSV define the column names. If it is a JSON, give an example of the JSON structure. 

---

### Interface

#### Type: 

CLI with Flags, CLI With Prompt, Web Page, Server, etc

#### 

What are the flags, what are Major Questions, Images of UX/UI Design.

-----

## Expectations

### Timeline

### Best Mode of Contact

### Next Meeting


### Action Items
\**Recap Meeting*\*
#### TechOps
#### Stakeholder

-----

#### *Approved By:* 
#### *Approval Date:*
