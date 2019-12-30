import Board, { Spot, Position } from './Board.js'
import Piece, { Color } from './Piece.js'
import { spotToColor, colorToSpot, isColor } from './helpers.js'

export default class {

  private readonly pieces = new Map<Color, Set<Piece>>()
    .set(Color.BLACK, new Set)
    .set(Color.WHITE, new Set)

  constructor(public board = Board) {
    // Add pieces to board
    for (const [y, row] of board.entries())
      for (const [x, spot] of row.entries())
        if (isColor(spot))
          this.pieces
            .get(spotToColor(spot))!
            .add(new Piece(spotToColor(spot), [x, y]))
  }

  /**
   * Moves a piece to a new position on the board without checking.
   * Clears the spot on the board where the piece was and updates the piece and the board.
   */
  move(piece: Piece, [x, y]: Position) {
    this.board[piece.position[1]][piece.position[0]] = Spot.EMPTY
    piece.position = [x, y]
    this.board[y][x] = colorToSpot(piece.color)
  }

  /** Destroys a position on the board. */
  destroy([x, y]: Position) {
    this.board[y][x] = Spot.DESTROYED
  }

  /** Gets all valid positions to move to from a given starting position. */
  validMoves([startX, startY]: Position) {
    const ret = new Set<Position>()

    // up
    for (let y = startY - 1;
      y >= 0 && this.board[y][startX] == Spot.EMPTY;
      y--)
      ret.add([startX, y])


    // down
    for (let y = startY + 1;
      y < this.board.length && this.board[y][startX] == Spot.EMPTY;
      y++)
      ret.add([startX, y])

    // left
    for (let x = startX - 1;
      x >= 0 && this.board[startY][x] == Spot.EMPTY;
      x--)
      ret.add([x, startY])

    // right
    for (let x = startX + 1;
      x < this.board[startY].length && this.board[startY][x] == Spot.EMPTY;
      x++)
      ret.add([x, startY])

    // up & left
    for (let y = startY - 1, x = startX - 1;
      y >= 0 && x >= 0 && this.board[y][x] == Spot.EMPTY;
      y-- , x--)
      ret.add([x, y])

    // down & left
    for (let y = startY + 1, x = startX - 1;
      y < this.board.length && x >= 0 && this.board[y][x] == Spot.EMPTY;
      y++ , x--)
      ret.add([x, y])

    // up & right
    for (let y = startY - 1, x = startX + 1;
      y >= 0 && x < this.board[y].length && this.board[y][x] == Spot.EMPTY;
      y-- , x++)
      ret.add([x, y])

    // down & right
    for (let y = startY + 1, x = startX + 1;
      y < this.board.length && x < this.board[y].length && this.board[y][x] == Spot.EMPTY;
      y++ , x++)
      ret.add([x, y])

    return ret
  }
}
