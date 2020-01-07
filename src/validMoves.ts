import { Board, Position, Spot } from './Board.js'
import LooseSet from '@mothepro/loose-set'

/** Gets all valid positions to move to from a given starting position. */
export default function (board: Board, [startX, startY]: Position) {
  const ret = new LooseSet<Position>()

  // up
  for (let y = startY - 1;
    y >= 0 && board[y][startX] == Spot.EMPTY;
    y--)
    ret.add([startX, y])


  // down
  for (let y = startY + 1;
    y < board.length && board[y][startX] == Spot.EMPTY;
    y++)
    ret.add([startX, y])

  // left
  for (let x = startX - 1;
    x >= 0 && board[startY][x] == Spot.EMPTY;
    x--)
    ret.add([x, startY])

  // right
  for (let x = startX + 1;
    x < board[startY].length && board[startY][x] == Spot.EMPTY;
    x++)
    ret.add([x, startY])

  // up & left
  for (let y = startY - 1, x = startX - 1;
    y >= 0 && x >= 0 && board[y][x] == Spot.EMPTY;
    y-- , x--)
    ret.add([x, y])

  // down & left
  for (let y = startY + 1, x = startX - 1;
    y < board.length && x >= 0 && board[y][x] == Spot.EMPTY;
    y++ , x--)
    ret.add([x, y])

  // up & right
  for (let y = startY - 1, x = startX + 1;
    y >= 0 && x < board[y].length && board[y][x] == Spot.EMPTY;
    y-- , x++)
    ret.add([x, y])

  // down & right
  for (let y = startY + 1, x = startX + 1;
    y < board.length && x < board[y].length && board[y][x] == Spot.EMPTY;
    y++ , x++)
    ret.add([x, y])

  return ret
}
