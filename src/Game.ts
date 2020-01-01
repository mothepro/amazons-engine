import { SafeEmitter, SafeSingleEmitter } from 'fancy-emitter'
import Board, { Spot, Position, Color, isColor } from './Board.js'
import validMoves from './validMoves.js'

export default class {

  /** @readonly current player's color. */
  current!: Color

  /** @readonly the other player's color. */
  get waiting(): Color {
    return this.current == Spot.BLACK
      ? Spot.WHITE
      : Spot.BLACK
  }

  /** Game is over and winner has been set. */
  readonly winner = new SafeSingleEmitter<Color>()

  /** The board has been changed. */
  readonly boardChanged = new SafeEmitter(() => this.resetValidMoves())

  /** Activated when the players turn changes */
  readonly turn = new SafeEmitter<Color>(
    // Bind color value to this emitter
    color => this.current = color,
    // End the game if there aren't any moves left
    () => this.checkPlayable()
  )

  /** Activated when a piece has moved. */
  readonly moved = new SafeEmitter<Position>(
    // Bind all changes to this to the board changing
    this.boardChanged.activate,
  )

  /** Activated when a spot on the board is destroyed. */
  readonly destroyed = new SafeEmitter<Position>(
    // Bind all changes to this to the board changing
    this.boardChanged.activate,
    // Next turn
    () => this.turn.activate(this.waiting)
  )

  /** 
   * All piece's color, position & their valid moves.
   * keyed by the piece's position stringified. (Using an array as a key isn't possible due to references vs value)
   */
  readonly pieces = new Map<string, {
    color: Color,
    position: Position,
    moves: Set<Position>,
  }>()

  constructor(readonly board = Board) { 
    this.resetValidMoves()
  }

  /** Starts the game with `color`'s turn first. */
  start(color: Color = Spot.BLACK) {
    this.turn.activate(color)
  }

  /**
   * Moves a piece to a new position on the board without checking.
   * Clears the spot on the board where the piece was and updates the piece and the board.
   */
  move([fromX, fromY]: Position, [toX, toY]: Position) {
    const previous = this.board[fromY][fromX]
    this.board[fromY][fromX] = Spot.EMPTY
    this.board[toY][toX] = previous
    this.moved.activate([toX, toY])
  }

  /** Destroys a position on the board and flips the players turn. */
  destroy([x, y]: Position) {
    this.board[y][x] = Spot.DESTROYED
    this.destroyed.activate([x, y])
  }

  private resetValidMoves() {
    this.pieces.clear()

    for (const [y, row] of this.board.entries())
      for (const [x, spot] of row.entries())
        if (isColor(spot))
          this.pieces.set([x, y].toString(), {
            color: spot,
            position: [x, y],
            moves: validMoves(this.board, [x, y]),
          })
  }

  /** Activates the winner emitter if no plays are possible. */
  private checkPlayable() {
    const currentPiecesMoveCount = [...this.pieces]
      .filter(([_, { color }]) => this.current == color)
      .map(([_, { moves }]) => moves.size)

    // End game and activate with the other player if no valid moves are left
    if (0 == Math.max(...currentPiecesMoveCount))
      this.winner.activate(this.waiting)

    return this.winner.triggered
  }
}
