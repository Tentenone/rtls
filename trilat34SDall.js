// function trilat234SD (points, target) takes:
//  1. Array points with coordinates of WiRanges and distances measured from WiRanges:
//   points = [
//   { WR: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 3.37 },
//   { WR: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 5.96 },
//   { WR: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 6.36 },
//   { WR: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 2.07 }
// ]
//  2. target = {z: 1.5}, z - height of the WiBeat over the floor
// function trilat234SDall refers to the function trilateration which calculates all trilateration points and
// trilat234SDall choose from these points (using points for all pairs, triples and quadruples of signals)
// trilateration point with minimal sumDevAll (with minimal sum of deviations from all 3 or 4 trilateration 
// circles) inside or outside the room tested;
// if there is 2, 1 or 0 signals received then returns undefined
// function trilat234SDall returns:
// resultPoints[j]         = { x: 30.510854725736294,
                          //   y: 50.43758090015737,
                          //   z: 0,
                          //   type: 3,
                          //   distanceRange: 23,
                          //   range: 1,
                          //   sumDev3: 1.1882056624214128,
                          //   sumDevAll: 1.9258013453499172,
                          //   isInside: 1
                          //   outDist: 1.2 }

const trilateration = require('./trilateration.js')

function trilat34SDall (points, target) {
  if (points.length < 3) {
    return undefined
  }
  let resultPoints = trilateration(points, target)
  resultPoints[0].z = target.z
  return resultPoints[0]
}
module.exports = trilat34SDall
