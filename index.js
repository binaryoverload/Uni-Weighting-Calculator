function courseToDOM(json) {
    let root = document.createElement("div")

    let title = document.createElement("h1")
    title.innerText = json.name
    root.appendChild(title)

    for (let year of json.years) {
        root.appendChild(yearToDOM(year))
    }

    return root
}

function yearToDOM(year) {
    let root = document.createElement("div")

    let yearTitle = document.createElement("h1")
    yearTitle.innerText = "Year " + year.year

    root.appendChild(yearTitle)

    for (let module of year.modules) {
        root.appendChild(moduleToDOM(module))
    }

    return root
}

function moduleToDOM(module) {
    let root = document.createElement("div")

    let moduleName = document.createElement("h1")
    moduleName.innerText = module.name

    let info = document.createElement("h3")
    info.innerText = module.code + " - Semester " + module.semester + " - CATS: " + module.cats

    root.appendChild(moduleName)
    root.appendChild(info)

    for (let assignment of module.assignments) {
        root.appendChild(assignmentToDOM(assignment))
    }

    return root
}

function assignmentToDOM(assignment) {
    let root = document.createElement("div")

    let type = document.createElement("h1")
    type.innerText = "Type: " + assignment.type

    let weighting = document.createElement("h1")
    weighting.innerText = "Weighting: " + Math.round(assignment.weighting * 100) + "%"

    root.appendChild(type)
    root.appendChild(weighting)

    return root
}

let template = Handlebars.compile(document.getElementById('template-oof').innerHTML);

(async function() {
    const data = await fetch("data/index.json");
    if (!data.ok) {
        console.error("Failed to fetch index! :(")
        return
    }
    const index = await data.json();
    let dataFiles = [];
    for (let dataFile of index) {
        const json = await fetch("data/" + dataFile).then(d => d.json())
        dataFiles.push(json)

        document.getElementById("THESTUFF").innerHTML = template({ course: json });
        //document.body.appendChild(courseToDOM(json))
    }
    console.log(dataFiles)
})()