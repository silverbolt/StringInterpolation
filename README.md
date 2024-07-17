# StringInterpolation
eg:
  parseString(tmpString, contenxt)
    |--tmpString = 'part1：${a.v}，part2：@{b.v}'，
    |--context = { a: {v:1}, b: {v:2}  }
  | output: "part1：1，part2：2"
