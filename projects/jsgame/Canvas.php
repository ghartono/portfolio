<?php 
$fn = "file.txt"; 
$file = fopen($fn, "a+"); 
$size = filesize($fn); 

if($_POST['addition']) fwrite($file, $_POST['addition']); 

$text = fread($file, $size); 
fclose($file); 
?> 
<form action="<?=$PHP_SELF?>" method="post"> 
<textarea><?=$text?></textarea><br/> 
<input type="text" name="addition"/> 
<input type="submit"/> 
</form>
<html>
	Time:<p id="timer"></p>
	<table align="center">
	<tr width="100%">
		<td>
			<canvas id="canvas" width="600" height="600" style="border:1px solid #000000;"></canvas><br>
		</td>
	</tr>
	</table>
	<table align="center" border="1" width = "1024">
	<tr>
		<td align="center" width="25%">
			Score: <p id="score">0</p>
			High Score: <p id ="highScore">0</p>
		</td>
		<td align="center">
			<button id="reset">Restart Game</button>
			<form action="highscore.php" method="post">  
				<input type="text" name="highScoreValue"/> 
				<input type="submit" /> 
			</form>
		</td>
		<td>
			<p id="output">A</p>
		</td>
	</tr>
	</table>
	<script src="Canvas.js"></script>
	<script src="highscore.js"></script>
	<script src="jquery-1.11.1.js"></script>
</html>
