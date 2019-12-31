import { SafeEmitter, SafeSingleEmitter } from 'fancy-emitter'
import Board, { Spot, Position } from './Board.js'
import Piece, { Color } from './Piece.js'
import { spotToColor, colorToSpot, isColor } from './helpers.js'
import validMoves from './validMoves.js'

export default class {

  /** @readonly current player's color. */
  current!: Color

  /** @readonly the other player's color. */
  get waiting() {
    return this.current == Color.BLACK
      ? Color.WHITE
      : Color.BLACK
  }

  /** Game is over and winner has been set. */
  readonly winner = new SafeSingleEmitter<Color>()

  /** The board has been changed. */
  readonly change = new SafeEmitter

  /** Activated when the players turn changes */
  readonly turn = new SafeEmitter<Color>(
    // Bind color value to this emitter
    color => this.current = color,

    // Update valid moves for each piece
    color => this.pieces.get(color)!
      .forEach(piece => piece.validMoves = validMoves(this.board, piece.position)),
    
    // End game and activate winner if no valid moves are left
    color => 0 == Math.max(...[...this.pieces.get(color)!].map(piece => piece.validMoves!.size))
      && this.winner.activate(this.waiting)
  )

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
    this.change.activate()
  }
  
  /** Destroys a position on the board and flips the players turn. */
  destroy([x, y]: Position) {
    this.board[y][x] = Spot.DESTROYED
    this.change.activate()
    this.turn.activate(this.waiting)
  }
}
