// view
function View_setBoard(board) {
    this.board = board
}
function View_gif(square) {
    return this[this.board[square] + this.board.squares[square]]
}
function View_place(square, piece) {
    if (this.rendered) {
        var i = image(this.name + square)
        i.src = this.gif(square)
    } 
}
function View_i(square) {
    var image = '<img border="0" hspace="0" vspace="0" name="' + this.name + square + '" src="' + this.gif(square) +'">'
    return '<a href="javascript:view.clicked(\'' + square + '\')">' + image + '</a>'
}
function View_renderRow(num) {
    p(this.i("a" + num))
    p(this.i("b" + num))
    p(this.i("c" + num))
    p(this.i("d" + num))
    p(this.i("e" + num))
    p(this.i("f" + num))
    p(this.i("g" + num))
    p(this.i("h" + num))
}
function View_render() {
    this.rendered = true
//  i(this.ws)
    this.renderRow("8")
    br()
    this.renderRow("7")
//  i(this.ws)
    br()
//  i(this.ws)
    this.renderRow("6")
    br()
    this.renderRow("5")
//  i(this.ws)
    br()
//  i(this.ws)
    this.renderRow("4")
    br()
    this.renderRow("3")
//  i(this.ws)
    br()
//  i(this.ws)
    this.renderRow("2")
    br()
    this.renderRow("1")
//  i(this.ws)
    br()
}
function View_clicked(square) {
    if (null == this.command) {
        this.command = square
    } else {
        if (square != this.command) {
            var queeningType = this.board.queeningType(this.command, square)
            this.command += square
            if (null != queeningType) {
                var pt = null
                while (pt != "q" && pt != "n" && pt != "r" && pt != "b") {
                    if (null != pt) {
                        alert(pt + " is not understood\nq for queen\nn for knight\nr for rook\nb for bishop")
                    }
                    pt = prompt("Queening to q, n, r, or b", "q")
                }
                if ("q" != pt) {
                    this.command += queeningType + pt
                }
            }
            this.board.clobbered = this.board.move(this.command)
            this.command = null
        }
    }
}
function View(name) {
    this.name = name
    this.board = null
    this.rendered = false
    this.command = null
}
view = new View("first")
function g(str) {
//  return str + ".gif"
    return "img/" + str + "35.gif"
}
View.prototype.setBoard = View_setBoard
View.prototype.clicked = View_clicked
View.prototype.gif = View_gif
View.prototype.place = View_place
View.prototype.i = View_i
View.prototype.renderRow = View_renderRow
View.prototype.render = View_render
View.prototype.ws = g("ws")
View.prototype.xxw = g("i")
View.prototype.xxb = g("i")
View.prototype.wkw = g("wk")
View.prototype.bkw = g("bk")
View.prototype.wqw = g("wq")
View.prototype.bqw = g("bq")
View.prototype.wrw = g("wr")
View.prototype.brw = g("br")
View.prototype.wbw = g("wb")
View.prototype.bbw = g("bb")
View.prototype.wnw = g("wn")
View.prototype.bnw = g("bn")
View.prototype.wpw = g("wp")
View.prototype.bpw = g("bp")
View.prototype.wkb = g("wk")
View.prototype.bkb = g("bk")
View.prototype.wqb = g("wq")
View.prototype.bqb = g("bq")
View.prototype.wrb = g("wr")
View.prototype.brb = g("br")
View.prototype.wbb = g("wb")
View.prototype.bbb = g("bb")
View.prototype.wnb = g("wn")
View.prototype.bnb = g("bn")
View.prototype.wpb = g("wp")
View.prototype.bpb = g("bp")
// end view
