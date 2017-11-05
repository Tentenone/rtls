/* global test, expect */

const trilat234Circles = require('../trilat234Circles')
const {getDistance} = require('../utils')
const {getRoomCenter} = require('./misc')

// all wiranges have zero height (2d-mode)

const ROOM = [
  { id: 21, x: 30.510815510, y: 50.437594417, z: 0, dist: 0},
  { id: 41, x: 30.510934197, y: 50.437592389, z: 0, dist: 0},
  { id: 31, x: 30.510972574, y: 50.437535780, z: 0, dist: 0},
  { id: 47, x: 30.510791035, y: 50.437548826, z: 0, dist: 0}
]
// approx room center, can be hardcoded
const ROOM_CENTER = getRoomCenter(ROOM)

// change distance for each signal without changing coordinates and z
// by default all test distances are equal to 3.0 meters
function makeSignals (room, distances = [3.0, 3.0, 3.0, 3.0]) {
  return room.map((device, i) => (Object.assign({}, device, {dist: distances[i]})))
}

test('should return point which is inside the room tested or closer than 4 m to the bounds (if the solution outside)' +
'     - for the case of 4 received points', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(4) // ensure that point found is closer than 4 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 4 m to the bounds (if the solution outside)' +
'     - for the case of 3 received points', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(4) // ensure that point found is closer than 4 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 4 m to the bounds (if the solution outside)' +
'     - for the case of 2 received points', () => {
  let signals = makeSignals(ROOM, [0, 0, 2.39, 1.87]).slice(2, 4)
  let currentPoint = {x: 30.510871243, y: 50.437543342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(4) // ensure that point found is closer than 4 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 2 m to the bounds (if the solution outside)' +
'     - for the case of 4 received points', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(2) // ensure that point found is closer than 2 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 2 m to the bounds (if the solution outside)' +
'     - for the case of 3 received points', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(2) // ensure that point found is closer than 2 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 2 m to the bounds (if the solution outside)' +
'     - for the case of 2 received points', () => {
  let signals = makeSignals(ROOM, [0, 0, 2.39, 1.87]).slice(2, 4)
  let currentPoint = {x: 30.510871243, y: 50.437543342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(2) // ensure that point found is closer than 2 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 1 m to the bounds (if the solution outside)' +
'     - for the case of 4 received points', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(1) // ensure that point found is closer than 1 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 1 m to the bounds (if the solution outside)' +
'     - for the case of 3 received points', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(1) // ensure that point found is closer than 1 m to the bounds
  }
})

test('should return point which is inside the room tested or closer than 1 m to the bounds (if the solution outside)' +
'     - for the case of 2 received points', () => {
  let signals = makeSignals(ROOM, [0, 0, 2.39, 1.87]).slice(2, 4)
  let currentPoint = {x: 30.510871243, y: 50.437543342, z: 1.5}
  let pos = trilat234Circles(signals, {z: 1.5}, currentPoint)
  if (pos.isInside === 1) {
    expect(pos.z).toBe(1.5) // z should match
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeLessThan(1) // ensure that point found is closer than 1 m to the bounds
  }
})

test('should have same z as target for 3 points', () => {
  let z = 1.7
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.7}
  let results = trilat234Circles(makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4), {z}, currentPoint)
  expect(results.z).toBe(1.7)
})

test('should have same z as target for 2 points', () => {
  let z = 1.6
  let currentPoint = {x: 30.510871243, y: 50.437543342, z: 1.5}
  let results = trilat234Circles(makeSignals(ROOM, [0, 0, 2.39, 1.87]).slice(2, 4), {z}, currentPoint)
  expect(results.z).toBe(1.6)
})

test('should return "undefined" for 1 points', () => {
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let signals = makeSignals(ROOM, [0, 0, 0, 2.02]).slice(3, 4)
  let pos = trilat234Circles(signals, {z: 0}, currentPoint)
  // ensure that pos is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 0 points', () => {
  let currentPoint = {x: 30.510871243, y: 50.437567342, z: 1.5}
  let pos = trilat234Circles([], {z: 0}, currentPoint)
  // ensure that pos is undefined
  expect(pos).toBe(undefined)
})
