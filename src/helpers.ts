import { Spot } from './Board.js'
import { Color } from './Piece.js'

export function spotToColor(spot: Spot) {
  switch (spot) {
    case Spot.BLACK:
      return Color.BLACK
    case Spot.WHITE:
      return Color.WHITE
  }
  throw Error(`Spot must be ${Spot.BLACK} or ${Spot.WHITE}. Found ${spot}`)
}

export function colorToSpot(color: Color) {
  switch (color) {
    case Color.BLACK:
      return Spot.BLACK
    case Color.WHITE:
      return Spot.WHITE
  }
}
