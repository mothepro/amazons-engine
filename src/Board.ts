export const enum Spot {
  /** Spot is valid for moving to. */
  EMPTY,
  /** A black piece occupys this spot. */
  BLACK,
  /** A white piece occupys this spot. */
  WHITE,
  /** Spot was inaccessible from the start. (Used to set the shape of the board) */
  REMOVED,
  /** Spot was destroyed by a missile. */
  DESTROYED,
}

export type Color = Spot.BLACK | Spot.WHITE
export type Board = Spot[][]
export type Position = [number, number]

/** The default state for the default board. */
export default JSON.parse(JSON.stringify([
  [Spot.EMPTY, Spot.EMPTY, Spot.BLACK, Spot.EMPTY, Spot.EMPTY, Spot.BLACK, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.BLACK, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.BLACK ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.WHITE, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.WHITE ],
  [Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY, Spot.EMPTY ],
  [Spot.EMPTY, Spot.EMPTY, Spot.WHITE, Spot.EMPTY, Spot.EMPTY, Spot.WHITE, Spot.EMPTY, Spot.EMPTY ],
])) as Board

export const isColor = (spot: Spot): spot is Color =>
  spot == Spot.WHITE || spot == Spot.BLACK
