const fs = require('fs')
const path = require('path')

const srtDir = './srt'

const srtFiles =  fs.readdirSync(srtDir)
for (let i = 0; i < srtFiles.length; i ++ ) {
    const srtFilePath = path.resolve(srtDir, srtFiles[i])
    const fileData = fs.readFileSync(srtFilePath)
    const md = srtToMd(fileData.toString(), srtFiles[i])
    fs.writeFileSync(srtFilePath.replace(/srt/g, 'md'), md)
}



function srtToMd(srt, filename) {
    const txtArr = srt.split(`
`)

    let r = ''
    for(let i = 0; i < txtArr.length; i = i + 5) {
        let enText = txtArr[i + 3]
        let zhText = txtArr[i + 2]

        // 出现3行，说明是介绍字幕
        if ((zhText !== undefined && zhText.trim() !== '') && (enText !== undefined && enText.trim() === '')) {
            console.error(filename, ' error line:', i, zhText.trim(), enText.trim())
            i = i - 1
            continue
        }


        if (!enText || enText.trim() === '') {
            continue
        }

        enText = enText.trim().replace('...', ',')
        zhText = zhText.trim()

        if (i === 0) {
            r += enText
            continue
        }

        if (r.endsWith('.')) {
            r += (`

` + enText)
        } else {
            r += (' ' + enText)
        }
    }


    const md = `---
layout: default
title: ${path.basename(filename, '.srt')}
description: 
---

${r}
`
    return md
}






