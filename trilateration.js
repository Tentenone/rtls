// function trilateration (points, target) takes:
//  1. Array points with coordinates of WiRanges and distances measured from WiRanges:
//   points = [
//   { WR: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 3.37 },
//   { WR: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 5.96 },
//   { WR: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 6.36 },
//   { WR: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 2.07 }
// ]
//  2. target = {z: 1.5}, z - height of the WiBeat over the floor
// function trilateration calculates all trilateration points and returns:
// resultPoints =  [{ x: 30.510854725736294,
                //   y: 50.43758090015737,
                //   z: 0,
                //   type: 3,
                //   distanceRange: 23,
                //   range: 1,
                //   sumDev3: 1.1882056624214128,
                //   sumDevAll: 1.9258013453499172,
                //   isInside: -1,
                //   outDist: 0.8}, {...}, ...]
// if there is no such point then returns underfined

const { trilat2, trilat3, distanceDecart, meanPoints4, sortDist, sortDevAll, ifInsideCell, outDist, reduceCopies } = require('./utils.js')
let bound = [
  { WR: 47, x: 30.510781035, y: 50.437526826, z: 0 },
  { WR: 21, x: 30.510781035, y: 50.437600417, z: 0 },
  { WR: 41, x: 30.510986574, y: 50.437600417, z: 0 },
  { WR: 31, x: 30.510986574, y: 50.437526826, z: 0 }
]

function trilateration (points, target) {
  let allPoints = []; let resultPoints = []; let pointsTril4 = [[]]; let sumDev3or4
  if (points.length < 2) {
    return []
  }
    // the distances (points.dist) from WB to the projections of the WR to the plane XOY are determined
  points.forEach(function (points) {
    let a = Math.pow(points.dist, 2)
    let b = Math.pow(points.z - target.z, 2)
    if (a > b) {
      points.dist = Math.sqrt(a - b)
    } else {
      points.dist = 0.01
    }
  })
    // array 'points' is sorted in accordance with field 'dist'
  points.sort(sortDist)
  for (let i = 0; i < points.length; i++) {
    points[i].distanceRange = i + 1
  }
  if (points.length === 2) {
    resultPoints = trilat2(points, target)
    for (let i = 0; i < resultPoints.length; i++) {
      resultPoints[i].sumDevAll = 0
      resultPoints[i].isInside = ifInsideCell(resultPoints[i].x, resultPoints[i].y, 0, bound)
      if (resultPoints[i].isInside === -1) {
        resultPoints[i].outDist = outDist(resultPoints[i].x, resultPoints[i].y, 0, bound)
      }
    }
    return resultPoints
  } else if (points.length === 3) {
    resultPoints = trilat3(points, target)
  } else if (points.length === 4) {
    let iter = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]
    for (let k = 0; k < iter.length; k++) {
        // all possible triples of points in the array 'points' are explored and for each pair the triliteration points (allPoints) are calculated
      allPoints = trilat3([ points[ iter[k][0] ], points[ iter[k][1] ], points[ iter[k][2] ] ], target)
        // pointsTril4 - points for calculating the average trilateration point for all 4 trilateration circles
      pointsTril4[0].push(allPoints.pop())
      for (let i = 0; i < allPoints.length; i++) {
        resultPoints.push(allPoints[i])
      }
    }
      // function meanPoints4  - for calculating the trilateration point for 4 trilateration circles
    resultPoints.push(meanPoints4(pointsTril4))
  }
  for (let i = 0; i < resultPoints.length; i++) {
    sumDev3or4 = 0
      // sumDev3or4 - average distance from WB to all (3 or 4) trilateration circles
    for (let j = 0; j < points.length; j++) {
      sumDev3or4 = sumDev3or4 + Math.abs(distanceDecart(resultPoints[i].x, points[j].x, resultPoints[i].y, points[j].y, 0, 0) - points[j].dist)
    }
    resultPoints[i].sumDevAll = sumDev3or4 / points.length
    resultPoints[i].isInside = ifInsideCell(resultPoints[i].x, resultPoints[i].y, 0, bound)
    if (resultPoints[i].isInside === -1) {
      resultPoints[i].outDist = outDist(resultPoints[i].x, resultPoints[i].y, 0, bound)
    } else {
      resultPoints[i].outDist = 100
    }
  }
  resultPoints = reduceCopies(resultPoints)
  resultPoints.sort(sortDevAll)
  return resultPoints
}

module.exports = trilateration
