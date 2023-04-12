const OutputDir = "C:/Users/joetr/Desktop/custom_stuff/cpplus/client/client/media/interface/game/stampbook/polaroids"

const fs = require('fs')

const files = fs.readdirSync(OutputDir)
for (let file of files) {
    if (!file.includes(".json")) continue

    let jsonFile = fs.readFileSync(`${OutputDir}/${file}`)
    let jsonData = JSON.parse(jsonFile)
    let sourceLayers = {}
    jsonData.textures.forEach(texture => {
        texture.frames.forEach(frame => {
            if (!sourceLayers) {
                sourceLayers = {
                    'minX': frame.spriteSourceSize.x,
                    'minY': frame.spriteSourceSize.y,
                    'maxX': frame.spriteSourceSize.x + frame.spriteSourceSize.w,
                    'maxY': frame.spriteSourceSize.y + frame.spriteSourceSize.h
                }
            } else {
                if (frame.spriteSourceSize.x < sourceLayers.minX) sourceLayers.minX = frame.spriteSourceSize.x
                if (frame.spriteSourceSize.y < sourceLayers.minY) sourceLayers.minY = frame.spriteSourceSize.y
                if (frame.spriteSourceSize.x + frame.spriteSourceSize.w > sourceLayers.maxX) sourceLayers.maxX = frame.spriteSourceSize.x + frame.spriteSourceSize.w
                if (frame.spriteSourceSize.y + frame.spriteSourceSize.h > sourceLayers.maxY) sourceLayers.maxY = frame.spriteSourceSize.y + frame.spriteSourceSize.h
            }
        })

        texture.frames.forEach(frame => {
            frame.spriteSourceSize.x -= sourceLayers.minX
            frame.spriteSourceSize.y -= sourceLayers.minY
            frame.sourceSize.w = sourceLayers.maxX - sourceLayers.minX
            frame.sourceSize.h = sourceLayers.maxY - sourceLayers.minY
        })
    })

    fs.writeFileSync(`${OutputDir}/${file}`, JSON.stringify(jsonData))
}