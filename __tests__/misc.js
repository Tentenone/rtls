/* global test, expect */

// returns approx center of a room
function getRoomCenter (room) {
  let pointCount = room.length
  let sum = room.reduce((acc, d) => Object.assign(acc, {
    x: acc.x + d.x,
    y: acc.y + d.y,
    z: acc.z + d.z
  }), {x: 0, y: 0, z: 0})

  return {
    x: sum.x / pointCount,
    y: sum.y / pointCount,
    z: sum.z / pointCount
  }
}

test('should find room center for square room', () => {
  let room = [
    {x: 0, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: 0, y: 10, z: 0},
    {x: 10, y: 10, z: 0}
  ]
  let center = getRoomCenter(room)
  expect(center.x).toBeCloseTo(5)
  expect(center.y).toBeCloseTo(5)
  expect(center.z).toBeCloseTo(0)
})

module.exports = {
  getRoomCenter
}

