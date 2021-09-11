import parse from "csv-parse"

export function fetchToCsv(relativeUrl, callback) {
    // This is needed because if the URL doesn't have a / on the end, relative paths do not work as expected
    const path = location.pathname
    fetch(path + (path.endsWith("/") ? '' : '/') + relativeUrl)
        .then(res => {
            if (res.ok) {
                return res.text()
            } else {
                return Promise.reject("Response was not okay!")
            }
        })
        .then(text => {
            parse(text, {columns: true, skip_empty_lines: true}, (err, output) => {
                callback(output)
            })
        })
}