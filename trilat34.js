// function trilat34 (points, target) takes:
//  1. Array points with coordinates of WiRanges and distances measured from WiRanges:
//   points = [
//   { WR: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 3.37 },
//   { WR: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 5.96 },
//   { WR: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 6.36 },
//   { WR: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 2.07 }
// ]
//  2. target = {z: 1.5}, z - height of the WiBeat over the floor
// function trilat34 refers to the function trilateration which calculates all trilateration points and
// function trilat34 choose from these points one trilateration point with minimal
// sumDevAll(minimal deviation from all 3 or 4 trilateration circles) and is located within the room tested,
// function trilat34 returns:
// resultPoints[i]        = { x: 30.510854725736294,
                        //   y: 50.43758090015737,
                        //   z: 0,
                        //   type: 3,
                        //   distanceRange: 23,
                        //   range: 1,
                        //   sumDev3: 1.1882056624214128,
                        //   sumDevAll: 1.9258013453499172,
                        //   isInside: 1 }
// if there is no such point then returns underfined

const trilateration = require('./trilateration.js')

function trilat34 (points, target) {
  if (points.length < 3) {
    return undefined
  }
  let resultPoints = trilateration(points, target)
  for (let i = 0; i < resultPoints.length; i++) {
    if (resultPoints[i].isInside === 1) {
      if ((points.length === 3 && resultPoints[i].type > 100 && resultPoints[i].range === 1) || resultPoints[i].distanceRange === 1234) {
        resultPoints[i].z = target.z
        return resultPoints[i]
      }
    }
  }
  return undefined
}
module.exports = trilat34
