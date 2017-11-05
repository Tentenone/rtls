// function trilat234Circles (points, target, currentPoint) takes:
//  1. Array points with coordinates of WiRanges and distances measured from WiRanges:
//   points = [
//   { WR: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 3.37 },
//   { WR: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 5.96 },
//   { WR: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 6.36 },
//   { WR: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 2.07 }
// ]
//  2. target = {z: 1.5}, z - height of the WiBeat over the floor
//  3. currentPoint - current point on this step of the route
// function trilat234Circles refers to the function trilateration which calculates all trilateration points and
// function trilat234Circles calculate for all these points if every point falls within a circle with radius of 1 m
// around the current point and if every point falls within a circle with radius of 1,5 m around the current point.
// Then from all these points the point with the smallest sumDevAll, located inside the circle with radius of 1 meter and
// sumDevAll < 2.5 m is choosen. If there is no such a point then the point with the smallest sumDevAll, located inside
// the circle with radius of 1/5 m and sumDevAll < 2.5 m is choosen. If there is no such a point then returns undefined
// function trilat234Circles returns:
// pointForRoute           = { x: 30.510854725736294,
                          //   y: 50.43758090015737,
                          //   z: 0,
                          //   type: 3,
                          //   distanceRange: 23,
                          //   range: 1,
                          //   sumDev3: 1.1882056624214128,
                          //   sumDevAll: 1.9258013453499172,
                          //   isInside: -1
                          //   outDist: 1.2 }

const trilateration = require('./trilateration.js')
const {sortDevAll, ifInsideCircle, reduceCopies} = require('./utils.js')
// let bound = [
//   { WR: 47, x: 30.510781035, y: 50.437526826, z: 0 },
//   { WR: 21, x: 30.510781035, y: 50.437600417, z: 0 },
//   { WR: 41, x: 30.510986574, y: 50.437600417, z: 0 },
//   { WR: 31, x: 30.510986574, y: 50.437526826, z: 0 }
// ]

function trilat234Circles (points, target, currentPoint) {
  let pointForRoute = {}
  let radCircle
  if (points.length < 2) {
    return undefined
  }
  let resultPoints = trilateration(points, target, currentPoint)
  resultPoints = reduceCopies(resultPoints)
  for (let i = 0; i < resultPoints.length; i++) {
    radCircle = 1
    resultPoints[i].isInsideCircle1 = ifInsideCircle(resultPoints[i], currentPoint, radCircle)
    radCircle = 1.5
    resultPoints[i].isInsideCircle1d5 = ifInsideCircle(resultPoints[i], currentPoint, radCircle)
    if (resultPoints.length < 3) {
      console.log(resultPoints[i])
    }
  }
  resultPoints.sort(sortDevAll)
  for (let i = 0; i < resultPoints.length; i++) {
    if (resultPoints[i].isInside === 1 && resultPoints[i].isInsideCircle1 === 1 && resultPoints[i].sumDevAll < 3.5) {
      pointForRoute = resultPoints[i]
      pointForRoute.z = target.z
      return pointForRoute
    }
  }
  for (let i = 0; i < resultPoints.length; i++) {
    if (resultPoints[i].isInside === 1 && resultPoints[i].isInsideCircle1d5 === 1 && resultPoints[i].sumDevAll < 3.5) {
      pointForRoute = resultPoints[i]
      pointForRoute.z = target.z
      return pointForRoute
    }
  }
  return undefined
}

module.exports = trilat234Circles
