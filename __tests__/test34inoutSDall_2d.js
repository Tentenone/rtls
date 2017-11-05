/* global test, expect */

const trilatTest = require('../trilat34inoutSDall')
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

test('should work for 4 points and return the same z', () => {
  let signals = makeSignals(ROOM)
  expect(signals.length).toBe(4)
  let pos = trilatTest(signals, {z: 0})
  expect(pos.z).toBe(0) // z should match
})

test('should work for 3 points and return the same z', () => {
  let signals = makeSignals(ROOM).slice(0, 3)
  expect(signals.length).toBe(3)
  let pos = trilatTest(signals, {z: 0})
  expect(pos.z).toBe(0) // z should match
})

test('should place first point near center when all distances are equal 1.0', () => {
  let signals = makeSignals(ROOM, [1.0, 1.0, 1.0, 1.0])
  let pos = trilatTest(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(1.2)
})

test('should place first point near center when all distances are equal 2.0', () => {
  let signals = makeSignals(ROOM, [2.0, 2.0, 2.0, 2.0])
  let pos = trilatTest(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers
  expect(pos.x).toBeGreaterThan(30)
  expect(pos.y).toBeGreaterThan(50)
  expect(getDistance(pos, ROOM_CENTER)).toBeLessThan(1.2)
})

test('should find the solution inside the room for 4 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [2.11, 3.15, 6.04, 5.87])
  let pos = trilatTest(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should find the solution inside or outside the room for 3 points if the solution exists', () => {
  let signals = makeSignals(ROOM, [0, 3.15, 6.04, 5.87]).slice(1, 4)
  let pos = trilatTest(signals, {z: 0})
  // ensure that pos.x and pos.y are valid numbers and located in the room
  expect(pos.x).toBeGreaterThan(30.510781035)
  expect(pos.y).toBeGreaterThan(50.437526826)
  expect(pos.x).toBeLessThan(30.510986574)
  expect(pos.y).toBeLessThan(50.437600417)
})

test('should return point outside the room if the solution inside the room doesn`t exists', () => {
  let signals = makeSignals(ROOM, [1.63, 20.15, 45.04, 0]).slice(0, 3)
  let pos = trilatTest(signals, {z: 0})
  // ensure that result is outside the room tested
  expect(pos.isInside).toBe(-1)
  expect(pos.outDist).toBeGreaterThan(0)
})

test('should return "undefined" for 2 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 6.39, 6.87]).slice(2, 4)
  let pos = trilatTest(signals, {z: 0})
  // ensure that result is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 1 points', () => {
  let signals = makeSignals(ROOM, [0, 0, 0, 2.02]).slice(3, 4)
  let pos = trilatTest(signals, {z: 0})
  // ensure that result is undefined
  expect(pos).toBe(undefined)
})

test('should return "undefined" for 0 points', () => {
  let pos = trilatTest([], {z: 0})
  // ensure that pos is undefined
  expect(pos).toBe(undefined)
})
