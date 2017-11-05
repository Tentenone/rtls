// function trilat234Prev (points, target, currentPoint) takes:
//  1. Array points with coordinates of WiRanges and distances measured from WiRanges:
//   points = [
//   { WR: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 3.37 },
//   { WR: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 5.96 },
//   { WR: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 6.36 },
//   { WR: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 2.07 }
// ]
//  2. target = {z: 1.5}, z - height of the WiBeat over the floor
//  3. currentPoint - current point on this step of the route
// function trilat234Prev refers to the function trilateration which calculates all trilateration points
// (inside and outside the room tested) and function trilat234Prev calculate for all these points deviation
// from the current point on the route, and calculate the next point on the route using LP-algorithm
// if there only 0 or 1 points was received during current second then trilat234Prev returns undefined
// function trilat234Prev returns:
// pointForRoute           = { x: 30.510854725736294,
                          //   y: 50.43758090015737,
                          //   z: 0,
                          //   isInside: -1
                          //   outDist: 1.2 }

const trilateration = require('./trilateration.js')
const {distanceDecart, sortDistPrev} = require('./utils.js')
function trilat234Prev (points, target, currentPoint) {
  let pointForRoute = {}
  let coefLP = 0.3
  if (points.length < 2) {
    return undefined
  }
  let resultPoints = trilateration(points, target, currentPoint)
  for (let i = 0; i < resultPoints.length; i++) {
    resultPoints[i].devToPrev = distanceDecart(resultPoints[i].x, currentPoint.x, resultPoints[i].y, currentPoint.y, 0, 0)
  }
  resultPoints.sort(sortDistPrev)
  let j1 = 100
  for (let j = 0; j < resultPoints.length; j++) {
    if (resultPoints[j].isInside === 1) {
      j1 = j
      break
    }
  }
  if (j1 === 100) {
    for (let j = 0; j < resultPoints.length; j++) {
      if (resultPoints[j].isInside === -1) {
        j1 = j
        break
      }
    }
  }
  pointForRoute.x = coefLP * currentPoint.x + (1 - coefLP) * resultPoints[j1].x
  pointForRoute.y = coefLP * currentPoint.y + (1 - coefLP) * resultPoints[j1].y
  pointForRoute.z = target.z
  pointForRoute.isInside = resultPoints[j1].isInside
  pointForRoute.outDist = resultPoints[j1].outDist
  return pointForRoute
}

module.exports = trilat234Prev
