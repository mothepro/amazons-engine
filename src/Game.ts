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
  validMoves([x, y]: Position) {
    const ret = new Set<Position>()

    // up
    for (let newY = y - 1; newY >= 0; newY--) {
      if (this.board[newY][x] != Spot.EMPTY)
        break
      ret.add([x, newY])
    }

    // down
    for (let newY = y + 1; newY < this.board.length; newY++) {
      if (this.board[newY][x] != Spot.EMPTY)
        break
      ret.add([x, newY])
    }

    // left
    for (let newX = x - 1; newX >= 0; newX--) {
      if (this.board[y][newX] != Spot.EMPTY)
        break
      ret.add([newX, y])
    }

    // right
    for (let newX = x + 1; newX < this.board[y].length; newX++) {
      if (this.board[y][newX] != Spot.EMPTY)
        break
      ret.add([newX, y])
    }

    return ret
  }
}
