const parse = require('csv-parse/lib/sync')

const fs = require('fs')

const input = fs.readFileSync('./music_art_history.CSV')

const records = parse(input, {
    columns: true,
    skip_empty_lines: true
})
console.log(records);

let history = []

history[0] = {
    "pid": 1,
    "tid": 1,
    "ts": 1,
    "ph": "X"
}
const tidMap = {
    'war': 1,
    'society': 2
}
records.forEach(record => {
    const start = record.start.trim(), end = record.end.trim(), tid = tidMap[record.type.trim()]
    if (end === '-') {
        history.push({
            "pid": 1,
            "tid": tid,
            "ts": ymd2t(start),
            "ph": "I",
            "name": record.Name
        })
    } else {
        const dur = ymd2t(end) - ymd2t(start);
        history.push({
            "pid": 1,
            "tid": tid,
            "ts": ymd2t(start),
            "name": record.name,
            "dur": dur < 0 ? 1: dur
        })
    }
})

function ymd2t(ymd) {
    const year = +ymd.substr(0, 4), month = +ymd.substr(4, 2), day = +ymd.substr(6, 2)
    return +Number((year + month / 12 + day / 30 / 12) * 1000).toFixed(0)
}
console.log(history);
fs.writeFileSync('./history.json', JSON.stringify(history))