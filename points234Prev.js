const trilat234 = require('./trilat234.js')
const trilat234Prev = require('./trilat234Prev.js')

function points234Prev (routeFileName, RssiFileName, z) {
  let target = {z: z}
  let currentPoint = {x: 0, y: 0}
  let flag = 0
  for (let k = 0; k < 70; k++) { // k - number of step (1 step - signals during 1 sec)
    let points = []; let res = {}
    // ...forming the array "points" for this second...
    if (flag < 5) {
      // calculation mean value for first 5 steps with results obtained from trilat234 (not undefined)
      res = trilat234(points, target)
      if (res !== undefined && Object.keys(res).length !== 0) {
        currentPoint.x = currentPoint.x + res.x
        currentPoint.y = currentPoint.y + res.y
        if (flag === 4) {
          currentPoint.x = currentPoint.x / 5
          currentPoint.y = currentPoint.y / 5
        }
        flag++
      }
    } else {
      // calculation for steps with using previous point
      res = trilat234Prev(points, target, currentPoint)
      if (res !== undefined && Object.keys(res).length !== 0) {
        currentPoint.x = res.x
        currentPoint.y = res.y
      }
    }
  // ... returns ...
  }
}

module.exports = points234Prev
