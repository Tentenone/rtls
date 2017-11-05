/* global test, expect */

const trilatTest = require('../trilat34SDall')
const {getDistance} = require('../utils')
const {getRoomCenter} = require('./misc')

const ROOM = [
  { id: 21, x: 30.510815510, y: 50.437594417, z: 2.62, dist: 0},
  { id: 41, x: 30.510934197, y: 50.437592389, z: 2.8, dist: 0},
  { id: 31, x: 30.510972574, y: 50.437535780, z: 2.76, dist: 0},
  { id: 47, x: 30.510791035, y: 50.437548826, z: 2.76, dist: 0}
]

// approx room center, can be hardcoded
const ROOM_CENTER = getRoomCenter(ROOM)

// change distance for each signal without changing coordinates and z
// by default all test distances are equal to 3.0 meters
function makeSignals (room, distances = [3.0, 3.0, 3.0, 3.0]) {
  return room.map((device, i) => (Object.assign({}, device, {dist: distances[i]})))
}

test('should have same z as target for 4 points', () => {
  let signals = makeSignals(ROOM)
  expect(signals.length).toBe(4)
  let pos = trilatTest(signals, {z: 1.0})
  expect(pos.z).toBe(1.0) // z should match
})

test('should have same z as target for 3 points', () => {
  let signals = makeSignals(ROOM).slice(0, 3)
  expect(signals.length).toBe(3)
  let pos = trilatTest(signals, {z: 1.2})
  expect(pos.z).toBe(1.2) // z should match
})

test('should place first point near center when all distances are equal 1.0', () => {
  let signals = makeSignals(ROOM, [1.0, 1.0, 1.0, 1.0])
  let pos = trilatTest(signals, {z: 1.0})
  // ensure that pos.x and pos.y are valid numbers and located near the room center
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(2.2)
})

test('should place first point near center when all distances are equal 2.0', () => {
  let signals = makeSignals(ROOM, [2.0, 2.0, 2.0, 2.0])
  let pos = trilatTest(signals, {z: 1.5})
  // ensure that pos.x and pos.y are valid numbers and located near the room center
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(2)
})

test('should find the solution inside or outside the room for 4 points if the solution existss', () => {
  let signals = makeSignals(ROOM, [4.05, 3.70, 8.60, 5.08])
  let pos = trilatTest(signals, {z: 1.5})
  // ensure that if result is inside the room then point`s coordinates are valid and if result is outside then
  // distance from the bounds of the room is valid
  if (pos.isInside === 1) {
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeGreaterThan(0)
  }
})

test('should return point outside the room if the solution inside the room doesn`t exists', () => {
  let signals = makeSignals(ROOM, [1.20, 1.45, 16.01, 0]).slice(0, 3)
  let pos = trilatTest(signals, {z: 1.80})
  // ensure that result is outside the room tested
  expect(pos.isInside).toBe(-1)
  expect(pos.outDist).toBeGreaterThan(0)
})

test('should find the solution inside or outside the room for 3 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let pos = trilatTest(signals, {z: 0})
  // ensure that if result is inside the room then point`s coordinates are valid and if result is outside then
  // distance from the bounds of the room is valid
  if (pos.isInside === 1) {
    expect(pos.x).toBeGreaterThan(30.510781035)
    expect(pos.y).toBeGreaterThan(50.437526826)
    expect(pos.x).toBeLessThan(30.510986574)
    expect(pos.y).toBeLessThan(50.437600417)
  } else {
    expect(pos.outDist).toBeGreaterThan(0)
  }
})

test('should return "undefined" for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 3.49, 5.93]).slice(2, 4)
  let pos = trilatTest(signals, {z: 1.8})
  // ensure that result is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 1 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 0, 5.99]).slice(3, 4)
  let pos = trilatTest(signals, {z: 1.8})
  // ensure that result is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 0 points', () => {
  let pos = trilatTest([], {z: 1.3})
  // ensure that result is undefined
  expect(pos).toBe(undefined)
})

test('should find the solution if the distance measured is less than height difference of WB and WR', () => {
  let signals = makeSignals(ROOM, [1.15, 0.91, 1.45, 3.40])
  let pos = trilatTest(signals, {z: 1.2})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should find the solution with distances to 3 or 4 WRs close to the incoming - for 4 points', () => {
  let signals = makeSignals(ROOM, [3.89, 6.25, 6.12, 4.11])
  let pos = trilatTest(signals, {z: 1.5})
  // ensure that at least 3 distances from pos to WRs differs from the corresponding incoming
  // distances by less than 2.5 meter
  let count = 0
  for (let i = 0; i < 4; i++) {
    if (Math.abs(getDistance(pos, ROOM[i]) - signals[i].dist) < 2.5) {
      count++
    }
  }
  expect(count).toBeGreaterThan(2)
})
