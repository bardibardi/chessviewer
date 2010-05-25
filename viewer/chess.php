<html>
<head>
<meta name="Author" content="Bardi Einarsson">
<!-- <meta http-equiv="refresh" content="90"> -->
<script language="JavaScript" src="script/fdata.js">
</script>
<?php echo '<!--' . "\n"; ?>
<script language="JavaScript" src="data/default.js">
</script>
<?php echo ' -->' . "\n"; ?>
<?php
$param = @($_GET['game']);
$param = $param ? $param : 'default';
$param = 'data/' . $param . '.js';
$param = file_exists($param) ? $param : 'data/default.js';
echo '<script language="JavaScript" src="' . $param . '">' . "\n";
echo '</script>' . "\n";
?>
<script language="JavaScript" src="script/util.js">
</script>
<script language="JavaScript" src="script/fview.js">
</script>
<script language="JavaScript" src="script/fboard.js">
</script>
<script language="JavaScript" src="script/fmovelist.js">
</script>
<script language="JavaScript">
// main
p("<title>" + data.caption + ", ")
p(data.whitePlayer + " v " + data.blackPlayer + ", ")
p(data.title1 + ", " + data.title2)
pln("</title>")
board.init(data.position, data.moves)
view.setBoard(board)
board.addView(view)
// end main
</script>
</head>

<body bgcolor="#ccffcc" link="blue" vlink="blue" alink="blue">
<center>
<!-- MAIN TABLE --><table bgcolor="#ffffff" border="1">
<tr>
<td valign="top">
<!-- RIGHT TABLE --><table border="0">
<tr><td>
<!-- BOARD TABLE --><table border="1"><tr><td><table background="img/brdslatebrown35.jpg" cellspacing="0" cellpadding="0">
<tr><td>
<script language="JavaScript">
view.render()
</script>
</td></tr>
<!-- END BOARD TABLE --></table></td></tr></table>
</td></tr>
<tr><td align="center"><p>
<form name = "fred">
<input type="button" name="start" value="<<" onClick="board.start()">
<input type="button" name="previous" value="  <  " onClick="board.previous()">
<input type="button" name="next" value="  >  " onClick="board.next()">
<input type="button" name="end" value=">>" onClick="board.end()">
</form>
</p></td></tr>
<tr><td align="center">
<script language="JavaScript">
p("<b>" + data.whitePlayer + " v " + data.blackPlayer + ",</b> " + data.caption + "</td></tr>")
</script>
<tr><td align="center">
<script language="JavaScript">
p("<i>" + data.title1 + "</i></td></tr>")
</script>
<tr><td align="center">
<script language="JavaScript">
p("<i>" + data.title2 + "</i></td></tr>")
</script>
<!-- END RIGHT TABLE --></table>
</td>
<td valign="top" height="400">
<!-- MOVE TABLE --><div style="width: 160px; height: 400px; overflow: auto;"><table border="0">
<tr>
<script language="JavaScript">
moveList.render()
</script>
</tr>
<!-- END MOVE TABLE --></table></div>
</td>
</tr>
<!-- END MAIN TABLE --></table>
</center>
</body>
</html>
