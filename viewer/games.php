<html>
<head>
<title>
Chess Games
</title>
<meta name="Author" content="Bardi Einarsson">
</head>

<body bgcolor="#000000" link="#ff0000" vlink="#ffffff" alink="#ffffff">
<p>
<?php
function link_write($link) {
  echo '<font face="verdana,arial,helvetica" color="#ffffff" size="1"><td><a href="chess.php?game='
    . $link . '" target="view">'
    . pretty_link($link) . '</a></td></font>' . "\n";
}
function pretty_link($link) {
  $pretty = preg_split('/xvx/', $link);
  return strtoupper(substr($pretty[0], 0, 1))
                  . substr($pretty[0], 1)
       . '&nbsp;v&nbsp;' 
       . strtoupper(substr($pretty[1], 0, 1))
                  . substr($pretty[1], 1);
}
$handle = opendir('data');
$name = null;
$match = null;
$base = null;
$arr = array();
while (false !== ($file = readdir($handle))) {
    preg_match('/(.*)\.js$/', $file, $match);
    $base = @($match[1]);
    if ($base && 'default' != $base) {
      array_push($arr, $base);
    }
}
sort($arr);
reset($arr);
echo '<center><table><tr>' . "\n";
while (list(, $val) = each($arr)) {
  link_write($val);
}
echo '</tr></table></center>' . "\n";
closedir($handle);
?>
</body>
</html>
