// movelist
function MoveList_moveStr(undoToken) {
    var len = undoToken.length
    var square1 = undoToken.substring(0, 2)
    var oldpiece1 = undoToken.substring(2, 4)
    var square2 = undoToken.substring(6, 8)
    var oldpiece2 = undoToken.substring(8, 10)
    // 12 => not (castling, ep or pawn promotion)
    if (12 == len) {
        if ("wp" == oldpiece1 || "bp" == oldpiece1) {
            if (oldpiece2 == this.board.nopiece) {
                return square2
            }
            return square1.substring(0, 1) + square2
        }
        return oldpiece1.substring(1, 2).toUpperCase() + square2
    }
    // 24 => castling or illegal ep
    if (24 == len && "k" == oldpiece1.substring(1,2)) {
        if ("e1" == square1 && "g1" == square2) {
            return "O-O"
        }
        if ("e8" == square1 && "g8" == square2) {
            return "O-O"
        }
        if ("e1" == square1 && "c1" == square2) {
            return "OOO"
        }
        if ("e8" == square1 && "c8" == square2) {
            return "OOO"
        }
    }
    // ep or pawn promotion (len == 18) or illegal ep
    var newpiece = undoToken.substring(16, 18)
    // final piece nopiece => ep
    if (newpiece == this.board.nopiece) {
        return square1.substring(0, 1) + square2
    }
    // pawn promotion
    if (oldpiece2 == this.board.nopiece) {
        return square2 + newpiece.substring(1, 2).toUpperCase()
    }
    return square1.substring(0, 1) + square2 + newpiece.substring(1, 2).toUpperCase()
}
function MoveList_part(moveStr, ply) {
    if (null == moveStr) {
        return "     "
    }
    var len = moveStr.length
    var pp = moveStr.substring(len - 1, len)
    var promotionFlag = "Q" == pp || "N" == pp || "R" == pp || "B" == pp
    var frontSpacer = (promotionFlag ? " " : "") + "    ".substring(0, 4 - len)
    var backSpacer = promotionFlag ? "" : " "
    return frontSpacer + '<a href="javascript:board.setPly(' + ply  + ')">' 
           + moveStr + "</a>" + backSpacer
}
function MoveList_line(moveNumber, whiteMoveStr, blackMoveStr) {
    var moveNumberStr = "" + moveNumber
    var ply = moveNumber + moveNumber - this.moveNumber - this.moveNumber
              - (this.whiteToMove ? 0 : 1)
    moveNumberStr = "   ".substring(0, 3 - moveNumberStr.length) +
                    moveNumberStr + ". "
    return '<b>' + moveNumberStr + this.part(whiteMoveStr, ply + 1) + " " 
                         + this.part(blackMoveStr, ply + 2) + '</b>'
}
function MoveList_startCell() {
    pln("<td align=\"left\" valign=\"top\">")
    pln("<pre>")
//  pln("                ")
//  pln("                ")
//  pln("                ")
//  pln("                ")
//       11.  Ba3    a6
}
function MoveList_endCell() {
    pln("</pre>")
    pln("</td>")
}
function MoveList_ambiguityCook(number, color, moveStr) {
    var loc = this.ambiguities.indexOf(("" + (1000 + number)).substring(1, 4) + color)
    if (-1 == loc) {
        return moveStr
    }
    return moveStr.substring(0, 1) + this.ambiguities.substring(loc + 4, loc + 5) +
           moveStr.substring(1, moveStr.length)
}
function MoveList_render() {
    var undoToken = null
    var number = this.moveNumber
    var white = this.whiteToMove
    var whiteStr = null
    var blackStr = null
    this.startCell()
    while (true) {
        undoToken = this.board.nextUndoToken()
        if (null == undoToken) {
            if (!white) {
                pln(this.line(number, whiteStr, null))
            }
            this.endCell()
            break
        }
        this.board.undoAt += 2 + undoToken.length
        if (white) {
            whiteStr = this.ambiguityCook(number, "w", this.moveStr(undoToken))
        }
        else {
            blackStr = this.ambiguityCook(number, "b", this.moveStr(undoToken))
            pln(this.line(number, whiteStr, blackStr))
//          if (0 == (1 + number - this.moveNumber) % 20) {
//              this.endCell()
//              this.startCell()
//          }
            ++number
        }
        white = !white
    }
    this.board.start()
}
function MoveList(name, position, moves, ambiguities, moveNumber, whiteToMove) {
    this.name = name
    this.moveNumber = moveNumber
    this.whiteToMove = whiteToMove
    this.board = new Board("movelistfirst")
    this.board.init(position, moves)
    this.ambiguities = ambiguities
    this.board.start()
}
moveList = new MoveList("first", data.position, data.moves, data.ambiguities,
                                 data.moveNumber, data.whiteToMove)
MoveList.prototype.moveStr = MoveList_moveStr
MoveList.prototype.ambiguityCook = MoveList_ambiguityCook
MoveList.prototype.part = MoveList_part
MoveList.prototype.line = MoveList_line
MoveList.prototype.startCell = MoveList_startCell
MoveList.prototype.endCell = MoveList_endCell
MoveList.prototype.render = MoveList_render
// end movelist
