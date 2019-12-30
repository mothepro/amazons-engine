export const enum Spot {
  /** Spot is valid for moving to. */
  EMPTY,
  /** Spot was inaccessible from the start. (Used to set the shape of the board) */
  REMOVED,
  /** Spot was destroyed by a missile. */
  DESTROYED,
  /** A black piece occupys this spot. */
  BLACK,
  /** A white piece occupys this spot. */
  WHITE,
}

export type Board = Spot[][]
export type index = number
export type Position = [index, index]

/** The default state for the default board. */
export default [
  [Spot.EMPTY, Spot.EMPTY, Spot.BLACK, Spot.EMPTY, Spot.EMPTY, Spot.BLACK, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.BLACK, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.BLACK ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.WHITE, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.WHITE ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.WHITE, Spot.EMPTY, Spot.EMPTY, Spot.WHITE, Spot.EMPTY, Spot.EMPTY ],
]
