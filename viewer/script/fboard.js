// board
function Board_place(square, piece) {
    if (this.undoOn) {
        this.undoStr += square + this[square] + piece
        this.undoAt += 6
    }
    this[square] = piece
    for (var i in this.views) {
        this.views[i].place(square, piece)
    }
}
function Board_clear() {
    for (var i in this.squares) {
        this.place(i, this.nopiece)
    }
}
function Board_setupToken(str, at) {
    if (at + 4 <= str.length) {
        return str.substring(at, at + 4)
    }
    return null
}
function Board_setup(str) {
    var at = 0
    var square = null
    var piece = null
    var token = null
    while (true) {
        token = this.setupToken(str, at)
        if (null == token) {
            break;
        }
        square = token.substring(0, 2)
        piece = token.substring(2, 4)
        this.place(square, piece)
        at += 4
    }
}
function Board_nextUndoToken() {
    var end = this.undoStr.indexOf(this.moveDelimiter, this.undoAt)
    if (-1 == end) {
        return null
    }
    return this.undoStr.substring(this.undoAt, end)
}
function Board_next() {
    var str = this.nextUndoToken()
    if (null == str) {
        return
    }
    ++this.ply
    var at = 0
    var len = str.length
    var square = null
    var oldpiece = null
    var piece = null
    var token = null
    while (true) {
        if (null != token) {
            square = token
            oldpiece = str.substring(at, at + 2)
            at += 2
            piece = str.substring(at, at + 2)
            at += 2
            this.place(square, piece)
        }
        if (at >= len) {
            this.undoAt += 2 + len
            break
        }
        token = str.substring(at, at + 2)
        at += 2
    }
}
function Board_end() {
    var len = this.undoStr.length
    while (this.undoAt < len) {
        this.next()
    }
}
function Board_previousUndoToken() {
    if (0 == this.undoAt) {
        return null
    }
    var beg = 2 + this.undoStr.lastIndexOf(this.moveDelimiter, this.undoAt - 4)
    beg = 1 == beg ? 0 : beg
    return this.undoStr.substring(beg, this.undoAt - 2)
}
function Board_previous() {
    var str = this.previousUndoToken()
    if (null == str) {
        return
    }
    --this.ply
    var len = str.length
    var at = len
    var square = null
    var oldpiece = null
    var piece = null
    var token = null
    while (true) {
        if (null != token) {
            piece = token
            oldpiece = str.substring(at - 2, at)
            at -= 2
            square = str.substring(at - 2, at)
            at -= 2
            this.place(square, oldpiece)
        }
        if (at <= 0) {
            break
        }
        token = str.substring(at - 2, at)
        at -= 2
    }
    this.undoAt -= 2 + len
}
function Board_start() {
    while (this.undoAt > 0) {
        this.previous()
    }
}
function Board_setPly(ply) {
    if (this.clobbered) {
        this.start()
        this.move(this.moves)
        this.start()
	this.clobbered = false
    }
    if (ply == this.ply) {
        return
    }
    if (ply < this.ply) {
        while (ply != this.ply) {
            this.previous()
        }
    }
    while (this.undoAt < this.undoStr.length && ply != this.ply) {
        this.next()
    }
}
// King has NOT moved - process king, completely, then rook
function Board_fischerRandomCastle(square1, square2) {
    var king = this[square1]
    var rook = this[square2]
    var kingsquare = null
    var rooksquare = null
    if (!("wk" == king && "wr" == rook || "bk" == king && "br" == rook)) {
        return false
    }
    if ("wk" == king && "1" != square1.substring(1,2)) {
        return false
    }
    if ("bk" == king && "8" != square1.substring(1,2)) {
        return false
    }
    if (square2 > square1) {
	if ("wk" == king) {
          kingsquare = "g1"
	  rooksquare = "f1"
        }
	else {
          kingsquare = "g8"
	  rooksquare = "f8"
	}
    }
    else {
	if ("wk" == king) {
          kingsquare = "c1"
	  rooksquare = "d1"
        }
	else {
          kingsquare = "c8"
	  rooksquare = "d8"
	}
    }
    this.place(square1, this.nopiece)
    this.place(kingsquare, king)
    this.place(square2, this.nopiece)
    this.place(rooksquare, rook)
    return true
}
// King has already moved - process rook
function Board_castle(square1, square2) {
    var rsquare = null
    var oldrsquare = null
    var rook = null
    if ("e1" == square1) {
        if ("wk" == this[square2]) {
            if ("g1" == square2) {
                rook = "wr"
                oldrsquare = "h1"
                rsquare = "f1"
            }
            if ("c1" == square2) {
                rook = "wr"
                oldrsquare = "a1"
                rsquare = "d1"
            }
        }
    }
    if ("e8" == square1) {
        if ("bk" == this[square2]) {
            if ("g8" == square2) {
                rook = "br"
                oldrsquare = "h8"
                rsquare = "f8"
            }
            if ("c8" == square2) {
                rook = "br"
                oldrsquare = "a8"
                rsquare = "d8"
            }
        }
    }
    if (null != rook) {
        this.place(oldrsquare, this.nopiece)
        this.place(rsquare, rook)
    }
}
function Board_ep(piece1, piece2, square1, square2) {
    if (("wp" == piece1 || "bp" == piece1)
        && square1.substring(0, 1) != square2.substring(0, 1)
        && this.nopiece == piece2) {
        this.place(square2.substring(0, 1) + square1.substring(1, 2), this.nopiece) 
    }
}
function Board_queening(square) {
    var piece = this[square]
    if ("wp" == piece && "8" == square.substring(1, 2)) {
        this.place(square, "wq")
    }
    if ("bp" == piece && "1" == square.substring(1, 2)) {
        this.place(square, "bq")
    }
}
function Board_queeningType(square1, square2) {
    var piece = this[square1]
    if ("wp" == piece && "8" == square2.substring(1, 2)) {
        return "w"
    }
    if ("bp" == piece && "1" == square2.substring(1, 2)) {
        return "b"
    }
    return null
}
function Board_moveToken(str, at) {
    var l = str.length
    var token = null
    var piece = null
    if (at + 4 <= l) {
        token = str.substring(at, at + 4)
        if (at + 6 <= l) {
            piece = str.substring(at + 4, at + 6)
            if (null != this.pieces[piece]) {
                token = str.substring(at, at + 6)
            }
        }
    }
    return token
}
function Board_equalToken(moveToken, undoToken) {
    if (null == undoToken) {
        return false
    }
    if (moveToken.substring(0, 2) != undoToken.substring(0,2)) {
        return false
    }
    if (moveToken.substring(2, 4) != undoToken.substring(6,8)) {
        return false
    }
    if (4 == moveToken.length) {
        return true
    }
    if (18 > undoToken.length) {
        return false
    }
    return moveToken.substring(4, 6) == undoToken.substring(16, 18)
}
// true if new move made == changed undoStr
function Board_move(str) {
    var truncatedUndoStr = false
    this.undoOn = true
    var at = 0
    var square1 = null
    var square2 = null
    var piece = null
    var piece2 = null
    var underPromotionPiece = null
    var token = null
    var undoToken = null
    var isOldMove = true
    while (true) {
        token = this.moveToken(str, at)
        if (null == token) {
            break
        }
        at += token.length
        if (6 == token.length) {
            underPromotionPiece = token.substring(4, 6)
        }
        if (isOldMove) {
            undoToken = this.nextUndoToken()
            isOldMove = this.equalToken(token, undoToken)
            if (!isOldMove) {
                this.undoStr = this.undoStr.substring(0, this.undoAt)
                truncatedUndoStr = true
            }
        }
        if (isOldMove) {
            this.undoOn = false
            this.next()
            this.undoOn = true
            continue
        }
        square1 = token.substring(0, 2)
        square2 = token.substring(2, 4)
        piece = this[square1]
        piece2 = this[square2]
	if (!this.fischerRandomCastle(square1, square2)) {
          this.place(square1, this.nopiece)
          this.place(square2, piece)
          this.castle(square1, square2)
	}
        if (null == underPromotionPiece) {
            this.queening(square2)
        }
        else {
            this.place(square2, underPromotionPiece)
            underPromotionPiece = null
        }
        this.ep(piece, piece2, square1, square2)
        this.undoStr += this.moveDelimiter
        ++this.ply
        this.undoAt += 2
    }
    this.undoOn = false
    return truncatedUndoStr
}
function Pieces() {
    this.xx = "xx"
    this.wk = "wk"
    this.bk = "bk"
    this.wq = "wq"
    this.bq = "bq"
    this.wr = "wr"
    this.br = "br"
    this.wb = "wb"
    this.bb = "bb"
    this.wn = "wn"
    this.bn = "bn"
    this.wp = "wp"
    this.bp = "bp"
}
function Squares() {
    this.a8 = "w"
    this.b8 = "b"
    this.c8 = "w"
    this.d8 = "b"
    this.e8 = "w"
    this.f8 = "b"
    this.g8 = "w"
    this.h8 = "b"
    this.a7 = "b"
    this.b7 = "w"
    this.c7 = "b"
    this.d7 = "w"
    this.e7 = "b"
    this.f7 = "w"
    this.g7 = "b"
    this.h7 = "w"
    this.a6 = "w"
    this.b6 = "b"
    this.c6 = "w"
    this.d6 = "b"
    this.e6 = "w"
    this.f6 = "b"
    this.g6 = "w"
    this.h6 = "b"
    this.a5 = "b"
    this.b5 = "w"
    this.c5 = "b"
    this.d5 = "w"
    this.e5 = "b"
    this.f5 = "w"
    this.g5 = "b"
    this.h5 = "w"
    this.a4 = "w"
    this.b4 = "b"
    this.c4 = "w"
    this.d4 = "b"
    this.e4 = "w"
    this.f4 = "b"
    this.g4 = "w"
    this.h4 = "b"
    this.a3 = "b"
    this.b3 = "w"
    this.c3 = "b"
    this.d3 = "w"
    this.e3 = "b"
    this.f3 = "w"
    this.g3 = "b"
    this.h3 = "w"
    this.a2 = "w"
    this.b2 = "b"
    this.c2 = "w"
    this.d2 = "b"
    this.e2 = "w"
    this.f2 = "b"
    this.g2 = "w"
    this.h2 = "b"
    this.a1 = "b"
    this.b1 = "w"
    this.c1 = "b"
    this.d1 = "w"
    this.e1 = "b"
    this.f1 = "w"
    this.g1 = "b"
    this.h1 = "w"
}
function Board_addView(view) {
    this.views[view.name] = view
}
function Board(name) {
    this.name = name
    this.views = new Object()
}
function Board_init(position, moves) {
    this.undoOn = false
    this.undoStr = ""
    this.undoAt = 0
    this.position = position
    this.moves = moves
    this.clear()
    this.setup(this.position)
    this.ply = 0
    this.move(this.moves)
    this.start()
}
board = new Board("first")
Board.prototype.clobbered = false
Board.prototype.init = Board_init
Board.prototype.setPly = Board_setPly
Board.prototype.start = Board_start
Board.prototype.next = Board_next
Board.prototype.previous = Board_previous
Board.prototype.end = Board_end
Board.prototype.moveDelimiter = "zz"
Board.prototype.move = Board_move
Board.prototype.moveToken = Board_moveToken
Board.prototype.nextUndoToken = Board_nextUndoToken
Board.prototype.previousUndoToken = Board_previousUndoToken
Board.prototype.equalToken = Board_equalToken
Board.prototype.fischerRandomCastle = Board_fischerRandomCastle
Board.prototype.castle = Board_castle
Board.prototype.ep = Board_ep
Board.prototype.queening = Board_queening
Board.prototype.queeningType = Board_queeningType
Board.prototype.addView = Board_addView
Board.prototype.place = Board_place
Board.prototype.setup = Board_setup
Board.prototype.setupToken = Board_setupToken
Board.prototype.clear = Board_clear
Board.prototype.squares = new Squares()
Board.prototype.pieces = new Pieces()
Board.prototype.nopiece = Board.prototype.pieces.xx
// end board
