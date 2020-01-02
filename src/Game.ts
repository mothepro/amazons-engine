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

  /**
   * The board has been changed.
   * The pieces valid moves need to re calculated.
   * 
   * Activate this immediately to calculate the valid moves on initialization.
   */
  readonly boardChanged = new SafeEmitter(() => {
    this.pieces.clear()

    for (const [y, row] of this.board.entries())
      for (const [x, spot] of row.entries())
        if (isColor(spot))
          this.pieces.set([x, y].toString(), {
            color: spot,
            position: [x, y],
            moves: validMoves(this.board, [x, y]),
          })
  }).activate()

  /** Activated when the players turn changes */
  readonly turn = new SafeEmitter<Color>(
    /** Bind color value to this emitter */
    color => this.current = color,
    /** End the game if there aren't any moves left for this player. */
    () => 0 == [...this.pieces.values()]
      .filter(({ color }) => this.current == color)
      .map(({ moves }) => moves.size)
      .reduce((prev, curr) => prev + curr)
      && this.winner.activate(this.waiting)
  )

  /** Activated when a piece has moved. */
  readonly moved = new SafeEmitter<{
    /** New position of the piece. */
    position: Position
    /** Possible positions that can be destroyed. */
    destructible: Set<Position>
  }>(
    /** Starts the next turn automatically if destroying isn't possible. */
    ({destructible}) => destructible.size == 0 && this.turn.activate(this.waiting)
  )

  /** Activated when a spot on the board is destroyed. */
  readonly destroyed = new SafeEmitter<Position>(
    /** Break spot on the board */
    ([x, y]) => this.board[y][x] = Spot.DESTROYED,
    /** Bind all changes to this to the board changing */
    this.boardChanged.activate,
    /** Next turn */
    () => this.turn.activate(this.waiting)
  )

  /** 
   * All piece's color, position & their valid moves.
   * keyed by the piece's position stringified. (Using an array as a key isn't possible due to references vs value)
   */
  readonly pieces = new Map<string, {
    color: Color
    position: Position
    moves: Set<Position>
  }>()

  constructor(readonly board = Board) { }

  /** Starts the game with `color`'s turn first. */
  start(color: Color = Spot.BLACK) {
    this.turn.activate(color)
  }

  /**
   * Moves a piece to a new position on the board without checking.
   * Clears the spot on the board where the piece was and updates the piece and the board.
   */
  async move([fromX, fromY]: Position, [toX, toY]: Position) {
    this.board[toY][toX] = this.board[fromY][fromX]
    this.board[fromY][fromX] = Spot.EMPTY
    this.boardChanged.activate()

    // Wait for the board to change so we can reuse valid moves generated from boardChanged action
    await this.boardChanged.next
    this.moved.activate({ 
      position: [toX, toY],
      destructible: this.pieces.get([toX, toY].toString())!.moves
    })
  }

  /** Destroys a position on the board and flips the players turn. */
  destroy(position: Position) {
    this.destroyed.activate(position)
  }
}
