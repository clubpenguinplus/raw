const fs = require('fs')

let file = "boiler.json"

let fileName = file.split(".")[0]
if (!fs.existsSync(`./stage.json`)) {
    console.error(`Missing data file for ${fileName}`)
    return
}

let jsonFile = fs.readFileSync(`./${file}`)
let jsonData = JSON.parse(jsonFile)
let sourceLayers = {}
jsonData.textures.forEach(texture => {
    texture.frames.forEach(frame => {
        let frameNArray = frame.filename.split("_")
        frameNArray.pop()
        let frameN = frameNArray.join("_")
        if (!sourceLayers[frameN]) {
            sourceLayers[frameN] = {
                'minX': frame.spriteSourceSize.x,
                'minY': frame.spriteSourceSize.y,
                'maxX': frame.spriteSourceSize.x + frame.spriteSourceSize.w,
                'maxY': frame.spriteSourceSize.y + frame.spriteSourceSize.h
            }
        } else {
            if (frame.spriteSourceSize.x < sourceLayers[frameN].minX) sourceLayers[frameN].minX = frame.spriteSourceSize.x
            if (frame.spriteSourceSize.y < sourceLayers[frameN].minY) sourceLayers[frameN].minY = frame.spriteSourceSize.y
            if (frame.spriteSourceSize.x + frame.spriteSourceSize.w > sourceLayers[frameN].maxX) sourceLayers[frameN].maxX = frame.spriteSourceSize.x + frame.spriteSourceSize.w
            if (frame.spriteSourceSize.y + frame.spriteSourceSize.h > sourceLayers[frameN].maxY) sourceLayers[frameN].maxY = frame.spriteSourceSize.y + frame.spriteSourceSize.h
        }
    })

    texture.frames.forEach(frame => {
        let frameNArray = frame.filename.split("_")
        frameNArray.pop()
        let frameN = frameNArray.join("_")
        frame.spriteSourceSize.x -= sourceLayers[frameN].minX
        frame.spriteSourceSize.y -= sourceLayers[frameN].minY
        frame.sourceSize.w = sourceLayers[frameN].maxX - sourceLayers[frameN].minX
        frame.sourceSize.h = sourceLayers[frameN].maxY - sourceLayers[frameN].minY
    })
})

fs.writeFileSync(`./${file}`, JSON.stringify(jsonData))

let dataFile = fs.readFileSync(`./stage.json`)
let dataData = JSON.parse(dataFile)
for (let key in dataData) {
    dataData[key].x = sourceLayers[key].minX + (sourceLayers[key].maxX - sourceLayers[key].minX) / 2
    dataData[key].y = sourceLayers[key].minY + (sourceLayers[key].maxY - sourceLayers[key].minY) / 2
}

fs.writeFileSync(`./stage.json`, JSON.stringify(dataData))