import parse from "csv-parse"

export function fetchToCsv(url, callback) {
    fetch(url).then(res => {
        if (res.ok) {
          return res.text()
        }
      })
      .then(text => {
        parse(text, { columns: true, skip_empty_lines: true }, (err, output) => {
          callback(output)
        })
      })
}