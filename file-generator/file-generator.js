const prompts = require('prompts');
const fs = require('fs');

const emptyValidator = (input) => {
    if (!input) {
        return "Please enter a value!"
    }
    return true
}

const courseQuestions = [{
        type: "text",
        name: "fileName",
        message: "What is the file name?",
        validate: emptyValidator
    }, {
        type: "text",
        name: "courseName",
        message: "What is the course name?",
        validate: emptyValidator
    },
    {
        type: "number",
        name: "yearCount",
        message: "How many years long is the course?",
        round: 0,
        validate: emptyValidator
    }
];

const yearQuestions = [{
    type: "number",
    name: "moduleCount",
    message: "How many modules is in the year?",
    round: 0,
    validate: emptyValidator
}]

const moduleQuestions = [{
        type: "text",
        name: "moduleName",
        message: "What is the module name?",
        validate: emptyValidator
    },
    {
        type: "text",
        name: "moduleCode",
        message: "What is the module code?",
        validate: emptyValidator
    },
    {
        type: "select",
        name: "moduleSemester",
        message: "What is the module semester?",
        choices: [
            { title: "Semester A", value: "a" },
            { title: "Semester B", value: "b" },
            { title: "Semester A and B", value: "a+b" },
        ]
    },
    {
        type: "number",
        name: "moduleCats",
        message: "How many CATS is this module worth?",
        round: 0,
        validate: emptyValidator
    },
    {
        type: "number",
        name: "moduleAssignmentCount",
        message: "How many assignments are in this module?",
        round: 0,
        validate: emptyValidator
    },
];

const assignmentQuestions = [{
        type: "select",
        name: "assignmentType",
        message: "What is the assignment type?",
        choices: [
            { title: "Coursework", value: "coursework" },
            { title: "TCA", value: "tca" },
            { title: "Exam", value: "exam" },
            { title: "Other", value: "other" },
        ]
    },
    {
        type: prev => prev === "other" ? "text" : null,
        name: "assignmentTypeOther",
        message: "What is the other assignment type?",
        validate: emptyValidator
    },
    {
        type: "number",
        name: "assignmentWeighting",
        message: "What is the assignment weighting?",
        validate: (input) => {
            if (input <= 0 || input > 100) {
                return "Weighting must be between 0% (exclusive) and 100% inclusive!";
            }
            return true;
        }
    }
];

(async() => {

    const finalObject = {}

    const courseResponses = await prompts(courseQuestions);

    finalObject.name = courseResponses.courseName;
    finalObject.years = [];

    for (let year = 1; year <= courseResponses.yearCount; year++) {
        console.log(`\nYear ${year}/${courseResponses.yearCount}\n`)
        const yearResponses = await prompts(yearQuestions);
        const yearObject = {
            year,
            modules: []
        }

        for (let modI = 0; modI < yearResponses.moduleCount; modI++) {
            console.log(`\nModule ${modI + 1}/${yearResponses.moduleCount}\n`)
            const moduleResponses = await prompts(moduleQuestions)
            const moduleObject = {
                name: moduleResponses.moduleName,
                code: moduleResponses.moduleCode,
                semester: moduleResponses.moduleSemester,
                cats: moduleResponses.moduleCats,
                assignments: []
            }

            for (let assignmentI = 0; assignmentI < moduleResponses.moduleAssignmentCount; assignmentI++) {
                console.log(`\nAssignment ${assignmentI + 1}/${moduleResponses.moduleAssignmentCount}\n`)
                const assignmentResponses = await prompts(assignmentQuestions)
                const assignmentObject = {
                    type: assignmentResponses.assignmentType,
                    weighting: assignmentResponses.assignmentWeighting / 100
                }

                if (assignmentResponses.assignmentTypeOther) {
                    assignmentObject.type = assignmentResponses.assignmentTypeOther
                }

                moduleObject.assignments.push(assignmentObject)
            }

            yearObject.modules.push(moduleObject)
        }

        finalObject.years.push(yearObject)
    }

    console.log(`Written file to ${courseResponses.fileName}`)
    fs.writeFileSync(courseResponses.fileName, JSON.stringify(finalObject, null, 4))
})();