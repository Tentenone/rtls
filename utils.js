const LONG = 71400.0 // Coefficient of conversion of longitude degrees to distance
const LAT = 111280.0 // Coefficient of conversion of latitude degrees to distance

// return distance between points a and b
function getDistance (a, b) {
  let dx = (a.x - b.x) * LONG
  let dy = (a.y - b.y) * LAT
  let dz = a.z - b.z
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
}

function trilat2 (points, target) {
  let resultPoints = []
  let pointType; let r1 = points[0]; let r2 = points[1]
  let dwr = distanceDecart(r1.x, r2.x, r1.y, r2.y, 0, 0)
  let distanceRange = r1.distanceRange * 10 + r2.distanceRange
  if (r1.dist + r2.dist <= dwr) {
    pointType = 1
    // function outLoc calculates one point coordinates for trilateration in case the trilitaration circles
    // are outside of each other; the pointType=1 for this situation
    resultPoints = outLoc(r1, r2, dwr, pointType, distanceRange)
  } else if (Math.max(r1.dist, r2.dist) >= Math.min(r1.dist, r2.dist) + dwr) {
    pointType = 2
    // function inLoc calculates one point coordinates for trilateration in case the trilitaration circles
    // are inside of each other; the pointType=2 for this situation
    resultPoints = inLoc(r1, r2, dwr, pointType, distanceRange)
  } else {
    pointType = 3
    // function intersect calculates two points coordinates for trilateration in case the trilitaration circles
    // intersect; the pointType=3 for this situation
    resultPoints = intersect(r1, r2, {}, dwr, pointType, distanceRange)
  }
  return resultPoints
}

function trilat3 (points, target) {
  let cartProd = [[]]; let stepPoint = []; let resultPoints = []; let r1 = {}; let r2 = {}; let r3 = {}; let pointForTril4 = {}
  let k = 0; let dwr; let pointType; let distanceRange; let sumD
  for (let j1 = 0; j1 < points.length; j1++) {
    for (let j2 = j1 + 1; j2 < points.length; j2++) {
      // all possible pairs (r1, r2) of points in the array 'points' are explored and for each pair 1 or 2 triliteration points (stepPoint) are calculated
      // dwr - distances between WRs, corresponding to the points r1, r2
      // distanceRange - numbers of points in sorted array 'points', for example: 23 means that r1 = points[1] is second distance point
      // and point r2 = points[2] - is third
      r1 = points[j1]; r2 = points[j2]; r3 = points[3 - j1 - j2]
      dwr = distanceDecart(r1.x, r2.x, r1.y, r2.y, 0, 0)
      distanceRange = r1.distanceRange * 10 + r2.distanceRange
      if (r1.dist + r2.dist <= dwr) {
        pointType = 1
        // function outLoc calculates one point coordinates for trilateration in case the trilitaration circles
        // are outside of each other; the pointType=1 for this situation
        stepPoint[k] = outLoc(r1, r2, dwr, pointType, distanceRange)
      } else if (Math.max(r1.dist, r2.dist) >= Math.min(r1.dist, r2.dist) + dwr) {
        pointType = 2
        // function inLoc calculates one point coordinates for trilateration in case the trilitaration circles
        // are inside of each other; the pointType=2 for this situation
        stepPoint[k] = inLoc(r1, r2, dwr, pointType, distanceRange)
      } else {
        pointType = 3
        // function intersect calculates two points coordinates for trilateration in case the trilitaration circles
        // intersect; the pointType=3 for this situation
        if (r1.x < r2.x) {
          stepPoint[k] = intersect(r1, r2, r3, dwr, pointType, distanceRange)
        } else {
          stepPoint[k] = intersect(r2, r1, r3, dwr, pointType, distanceRange)
        }
      }
      k++
    }
  }
  // cartProd - cartesian product - all possible triples of points taken from arrays 'stepPoint'
  cartProd = cartesianProduct(stepPoint)
  // function meanPoints3 determines the trilateration point for 3 trilateration circles
  resultPoints = meanPoints3(cartProd)
  stepPoint.forEach(function (stepPoint) {
    stepPoint.forEach(function (stepPoint) {
      resultPoints.push({x: stepPoint.x, y: stepPoint.y, z: 0, type: stepPoint.type, distanceRange: stepPoint.distanceRange, range: stepPoint.range})
    })
  })
  let len = resultPoints.length
  // sumDev3 - average distances from WB to all 3 trilateration circles, SumD - differences abs(d1 - d2), summed up for all 3 or 4 WR,
  // d1 - real distance to WR from the point found, d2 - distance to WR calculated and given in points.dist)
  for (let i = 0; i < len; i++) {
    sumD = 0
    for (let j = 0; j < points.length; j++) {
      sumD = sumD + Math.abs(distanceDecart(points[j].x, resultPoints[i].x, points[j].y, resultPoints[i].y, 0, 0) - points[j].dist)
    }
    resultPoints[i].sumDev3 = sumD / 3
    if (resultPoints[i].type > 100 && resultPoints[i].range === 1) {
      pointForTril4 = resultPoints[i]
    }
  }
  resultPoints.sort(sortDev3)
  // pointForTril4 - last element in resultPoints, for calculating trilateration point for 4 trilateration circles
  resultPoints.push(pointForTril4)
  return resultPoints
}

function distanceDecart (x1, x2, y1, y2, z1, z2) {
  let DelX = (x1 - x2) * LONG
  let DelY = (y1 - y2) * LAT
  let DelZ = z1 - z2
  return Math.sqrt(Math.pow(DelX, 2) + Math.pow(DelY, 2) + Math.pow(DelZ, 2))
}

function inLoc (r1, r2, dwr, pointType, distanceRange) {
  // function inLoc calculates one point coordinates for trilateration in case the trilitaration circles are inside of each other
  let lm = (r1.dist + r2.dist + dwr) / (2 * dwr)
  let x1 = r2.x + lm * (r1.x - r2.x)
  let y1 = r2.y + lm * (r1.y - r2.y)
  return [{ x: x1, y: y1, z: 0, type: pointType, distanceRange: distanceRange }]
}

function outLoc (r1, r2, dwr, pointType, distanceRange) {
  // function outLoc calculates one point coordinates for trilateration in case the trilitaration circles are outside of each other
  let lm = (dwr + r1.dist - r2.dist) / (dwr - r1.dist + r2.dist)
  let x1 = (r1.x + lm * r2.x) / (1 + lm)
  let y1 = (r1.y + lm * r2.y) / (1 + lm)
  return [{ x: x1, y: y1, z: 0, type: pointType, distanceRange: distanceRange }]
}

function intersect (r1, r2, r3, dwr, pointType, distanceRange) {
  // function intersect calculates two points coordinates for trilateration in case the trilitaration circles intersect
  let angle = Math.acos((Math.pow(r1.dist, 2) + Math.pow(dwr, 2) - Math.pow(r2.dist, 2)) / (2 * r1.dist * dwr))
  let angleCoord = Math.acos((r2.x - r1.x) * LONG / dwr) * Math.sign(r2.y - r1.y)
  let x1 = r1.dist * Math.cos(angle + angleCoord) / LONG + r1.x
  let y1 = r1.dist * Math.sin(angleCoord + angle) / LAT + r1.y
  let x2 = r1.dist * Math.cos(angle - angleCoord) / LONG + r1.x
  let y2 = r1.dist * Math.sin(angleCoord - angle) / LAT + r1.y
    // find out which of the points - (x1,y1) or (x2,y2) is closest to the trilitiary circle, which is determined by the point r3
  if (Object.keys(r3)) {
    return [{x: x1, y: y1, z: 0, type: pointType}, { x: x2, y: y2, z: 0, type: pointType }]
  } else {
    let Dev1 = Math.abs(distanceDecart(x1, r3.x, y1, r3.y, 0, 0) - r3.dist)
    let Dev2 = Math.abs(distanceDecart(x2, r3.x, y2, r3.y, 0, 0) - r3.dist)
    if (Dev1 > Dev2) {
      [x1, x2] = [x2, x1]; [y1, y2] = [y2, y1]
    }
    return [{x: x1, y: y1, z: 0, type: pointType, distanceRange: distanceRange, range: 1}, { x: x2, y: y2, z: 0, type: pointType, distanceRange: distanceRange, range: 0 }]
  }
}

function cartesianProduct (stepPoint) {
  // all possible triples of points taken from arrays stepPoint[i]
  let cartProd = []; let len = 1
  stepPoint.forEach(function (p) { len = len * p.length })
  for (let i = 0; i < len / stepPoint[0].length; i++) {
    stepPoint[0].forEach(function (p) { cartProd.push([p]) })
  }
  for (let k = 1; k < stepPoint.length; k++) {
    cartProd = cartPoint(stepPoint[k], cartProd)
  }
  return cartProd
  function cartPoint (stepPoint, cartProd) {
    let len = cartProd.length / stepPoint.length
    for (let j = 0; j < stepPoint.length; j++) {
      for (let i = j * len; i < (j + 1) * len; i++) {
        cartProd[i].push(stepPoint[j])
      }
    }
    return cartProd
  }
}

function meanPoints3 (cartProd) {
  // function meanPoints3 determines trilateration point for 3 trilateration circles
  let meanPs = []; let medPoint = {}; let Res = {}; let pointType; let distanceRange; let rng
  for (let s = 0; s < cartProd.length; s++) {
    let lm = 2
    medPoint = {x: (cartProd[s][0].x + cartProd[s][1].x) / 2, y: (cartProd[s][0].y + cartProd[s][1].y) / 2}
    Res = {x: (cartProd[s][2].x + lm * medPoint.x) / (lm + 1), y: (cartProd[s][2].y + lm * medPoint.y) / (lm + 1)}
    pointType = cartProd[s][0].type * 100 + cartProd[s][1].type * 10 + cartProd[s][2].type
    distanceRange = cartProd[s][0].distanceRange * 10000 + cartProd[s][1].distanceRange * 100 + cartProd[s][2].distanceRange
    if (cartProd[s][0].range === 0 || cartProd[s][1].range === 0 || cartProd[s][2].range === 0) rng = 0
    else rng = 1
    meanPs.push({ x: Res.x, y: Res.y, z: 0, type: pointType, distanceRange: distanceRange, range: rng })
  }
  return meanPs
}

function meanPoints4 (cartProd) {
  // function meanPoints4 determines trilateration point for 4 trilateration circles
  let meanPs = {}
  let lm; let medPoint = {}; let triangleCenter = {}; let Res = {}; let pointType; let distanceRange
  for (let s = 0; s < cartProd.length; s++) {
    lm = 2
    medPoint = {x: (cartProd[s][0].x + cartProd[s][1].x) / 2, y: (cartProd[s][0].y + cartProd[s][1].y) / 2}
    triangleCenter = { x: (cartProd[s][2].x + lm * medPoint.x) / (lm + 1), y: (cartProd[s][2].y + lm * medPoint.y) / (lm + 1) }
    lm = 3
    Res = { x: (cartProd[s][3].x + lm * triangleCenter.x) / (lm + 1), y: (cartProd[s][3].y + lm * triangleCenter.y) / (lm + 1) }
      // pointType = cartProd[s][0].type * Math.pow(10, 9) + cartProd[s][1].type * Math.pow(10, 6) + cartProd[s][2].type * Math.pow(10, 3) + cartProd[s][3].type
      // distanceRange = cartProd[s][0].distanceRange * Math.pow(10, 18) + cartProd[s][1].distanceRange * Math.pow(10, 12) + cartProd[s][2].distanceRange * Math.pow(10, 6) + cartProd[s][3].distanceRange
    pointType = cartProd[s][0].type * Math.pow(10, 9) + cartProd[s][1].type * Math.pow(10, 6) + cartProd[s][2].type * Math.pow(10, 3) + cartProd[s][3].type
    distanceRange = 1234
    meanPs = { x: Res.x, y: Res.y, z: 0, type: pointType, distanceRange: distanceRange, sumDev3: 10000 }
  }
  return meanPs
}

function sortDist (r1, r2) {
  if (r1.dist < r2.dist) return -1
  if (r1.dist > r2.dist) return 1
  return 0
}

function sortDev3 (r1, r2) {
  if (r1.sumDev3 < r2.sumDev3) return -1
  if (r1.sumDev3 > r2.sumDev3) return 1
  return 0
}

function sortDevAll (r1, r2) {
  if (r1.sumDevAll < r2.sumDevAll) return -1
  if (r1.sumDevAll > r2.sumDevAll) return 1
  return 0
}

function sortDistPrev (r1, r2) {
  if (r1.devToPrev < r2.devToPrev) return -1
  if (r1.devToPrev > r2.devToPrev) return 1
  return 0
}

function sortoutDist (r1, r2) {
  if (r1.outDist < r2.outDist) return -1
  if (r1.outDist > r2.outDist) return 1
  return 0
}

function ifInsideCell (x, y, z = 0, bound) {
  // finds out if point (x, y, z) is inside quadrilateral formed by the room tested
  let iter = [ [0, 1], [1, 2], [2, 3], [0, 3] ]
  let Sq = []; let Sum = 0
  let diag1 = distanceDecart(bound[0].x, bound[2].x, bound[0].y, bound[2].y, 0, 0)
  let diag2 = distanceDecart(bound[1].x, bound[3].x, bound[1].y, bound[3].y, 0, 0)
  let vectDiag1 = {x: (bound[2].x - bound[0].x) * LONG, y: (bound[2].y - bound[0].y) * LAT}
  let vectDiag2 = {x: (bound[3].x - bound[1].x) * LONG, y: (bound[3].y - bound[1].y) * LAT}
  let cosDiag = (vectDiag1.x * vectDiag2.x + vectDiag1.y * vectDiag2.y) / (diag1 * diag2)
  let sinDiag = Math.sqrt(1 - Math.pow(cosDiag, 2))
  for (let i = 0; i < iter.length; i++) {
    let a = distanceDecart(x, bound[ iter[i][0] ].x, y, bound[ iter[i][0] ].y, 0, 0)
    let b = distanceDecart(x, bound[ iter[i][1] ].x, y, bound[ iter[i][1] ].y, 0, 0)
    let c = distanceDecart(bound[ iter[i][1] ].x, bound[ iter[i][0] ].x, bound[ iter[i][1] ].y, bound[ iter[i][0] ].y, 0, 0)
    Sq[i] = SquareOfTriangle(a, b, c)
    Sum = Sum + Sq[i]
  }
  if (Math.abs(Sum - 0.5 * diag1 * diag2 * sinDiag) < 0.1) return 1
  else return -1
}

function ifInsideCircle (resultPoint, prevPoint, radCircle) {
  // finds out if point (x, y, z) is inside circle with R=1 around previous point of route
  if (Math.abs(distanceDecart(resultPoint.x, prevPoint.x, resultPoint.y, prevPoint.y, 0, 0)) < radCircle) {
    return 1
  } else {
    return -1
  }
}

function outDist (x, y, z = 0, bound) {
  // calculates approximate distanse from point (x, y, z) to the bounds of the quadrilateral formed by the room tested
  let i = 1
  while (i < 100) {
    let b = []
    b.push({x: bound[3].x + i * 0.000002802, y: bound[3].y - i * 0.000001798, z: 0})
    b.push({x: bound[2].x + i * 0.000002802, y: bound[2].y + i * 0.000001798, z: 0})
    b.push({x: bound[1].x - i * 0.000002802, y: bound[1].y + i * 0.000001798, z: 0})
    b.push({x: bound[0].x - i * 0.000002802, y: bound[0].y - i * 0.000001798, z: 0})
    let c = ifInsideCell(x, y, z = 0, b)
    if (c === 1) {
      return i * 0.2
    }
    i++
  }
  return 200
}

function SquareOfTriangle (a, b, c) {
  let p = (a + b + c) / 2
  return Math.abs(Math.sqrt(p * (p - a) * (p - b) * (p - c)))
}

function reduceCopies (resultPoints) {
  let newArr = resultPoints.sort(function (a, b) { return a.x < b.x && a.y !== b.y ? -1 : 1 }).reduce(function (resultPoints, el) {
    if (!resultPoints.length || (resultPoints[resultPoints.length - 1].x !== el.x && resultPoints[resultPoints.length - 1].y !== el.y)) {
      resultPoints.push(el)
    }
    return resultPoints
  }, [])
  return newArr
}

module.exports = {
  LONG,
  LAT,
  getDistance,
  trilat2,
  trilat3,
  distanceDecart,
  inLoc,
  outLoc,
  intersect,
  cartesianProduct,
  meanPoints3,
  meanPoints4,
  sortDist,
  sortDev3,
  sortDevAll,
  sortDistPrev,
  sortoutDist,
  ifInsideCell,
  ifInsideCircle,
  outDist,
  reduceCopies,
  SquareOfTriangle
}
