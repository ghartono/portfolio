/*
Author: Gionaldo Hartono
Date: November 25th, 2014

Best works on mozilla!

This is a game on running away from monsters, luring them to things that can kill them!
*/

//Create canvas
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var resetButton = document.getElementById("reset");

//game size
var gridNum = 10;
var gridX = canvas.width/gridNum;
var gridY = canvas.height/gridNum;


//event listeners
document.addEventListener("keypress", keyboardAction, false); //when press any button on keyboard
resetButton.addEventListener("click", startGame, false);


//time and scores
var timer = 0;
var score = 0;
var highScore = 0;


//bunch of intervals
var gameLoop = setInterval(doGameLoop, 30); //refresh canvas 
var timerInterval = setInterval(timeCount, 1000); //timer in seconds
var scoreInterval = setInterval(addScoreByTime, 50); //add score for time
var moveInterval = setInterval(moveLimit, 250); //limit the move of the players per second so that they will not cheat, and limit monster movement
var monsterInterval = setInterval(forceMonsterMove, 1000); //force monster to move every 1 second so that user will not waste time
var treasureInterval = setInterval(spawnTreasure, 3000); //chance to spawn treasure every 3 seconds

//boolean for state of the game
var canMove = true; //to limit movement
var monsterIsDead = false; //check if monster is dead
var treasureIsSpawned = false; //check if treasure exist
var gameIsOver = false; // to end game

//gameover screen
var gameover = new Image;
gameover.src = "gameover.jpg";

//background of canvas
var backgroundImg = new Image();
backgroundImg.onload = function () {
    "use strict";
    c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
};
backgroundImg.src = "background.jpg";

//character image, location
var yourChar = new Image();
//draw on start
var mainChar = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor( Math.random() * gridNum ) * gridY, health: 3};
yourChar.onload = function () {
    "use strict";
	c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY);
};
yourChar.src = "character.bmp";


//object traps image, location
var objectImg = new Image();
//draw on start
var object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY };
objectImg.onload = function () {
    "use strict";
	c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
};
//random image of object traps
if(Math.floor(Math.random() * 2) == 1)
{
	objectImg.src = "flames.png";
}
else
{
	objectImg.src = "beartrap.png";
}

//object 2, treasure chests image, location
var object2Img = new Image();
var object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y:  Math.floor ( Math.random () * gridNum ) * gridY };
object2Img.src = "object2.png";

//monster image, location
var enemyImg = new Image();
//draw on start
var enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
enemyImg.onload = function () {
	"use strict";
	c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
};
//pick image of monster randomly
if(Math.floor(Math.random () * 2) == 1)
{
	enemyImg.src = "enemy2.png";
}
else
{
	enemyImg.src = "enemy.png";
}

//main game refresher
function doGameLoop()
{
	"use strict";
	$('#score').html(score); //keep changing score
	$('#timer').html(timer); //keep changing timer
	
	if(!gameIsOver) //game is still playing
	{
		c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height); 
		c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
		if(treasureIsSpawned) //if treasure exists
		{
			c.drawImage(object2Img, object2.x, object2.y, gridX, gridY); //draw treasure
		}
		if(!monsterIsDead) //if monster is not dead
		{
			c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY); //draw monster
		}

		c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY); //draw character
	}
	else //if game is over draw game over screen
	{
		c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height); //display gameover screen
	}
	
	/*
	collision or interactions
	*/
	
	//collision between character and monster
	if(mainChar.x == enemy1.x && mainChar.y == enemy1.y) 
	{
		gameOver(); //game is over
	}
	
	//collision between character and treasure object
	else if(mainChar.x == object2.x && mainChar.y == object2.y) 
	{
		c.fillStyle = "#22B14C"; //color same as background
		c.fillRect(mainChar.x, mainChar.y, gridX, gridY); //change collide location to nothing
		//loop to make sure the treasure spawned is not at the character location
		do
		{
			object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
		}while(object2.x == mainChar.x && object2.y == mainChar.y);
		
		treasureIsSpawned = false; //treasure does not exist anymore
		score += 10000; //add score
	}
	
	//collision between monster and trap object
	else if(object1.x == enemy1.x && object1.y == enemy1.y) 
	{
		c.fillStyle = "#22B14C"; //color same as background
		c.fillRect(object1.x, object1.y, gridX, gridY); //change collide location to nothing
		monsterIsDead = true; //monster is dead
		object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY }; //change location of object trap
		var prevEnemyLoc = { x: enemy1.x, y: enemy1.y };
		//loop to make sure enemy is not in same location as new object location or previous enemy location
		do
		{
			enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY}; //change location of monster
		}while((enemy1.x == prevEnemyLoc.x && enemy1.y == prevEnemyLoc.y) || (enemy1.x == object1.x && enemy1.y == object1.y));
		
		//change new monster image
		if(Math.floor(Math.random () * 2) == 1)
		{
			enemyImg.src = "enemy2.png";
		}
		else
		{
			enemyImg.src = "enemy.png";
		}
		//change new object image		
		if(Math.floor(Math.random() * 2) == 1)
		{
			objectImg.src = "flames.png";
		}
		else
		{
			objectImg.src = "beartrap.png";
		}
		
		score += 5000; //add score
		monsterIsDead = false; //monster is not dead anymore (changed location)
	}
	
	//if the game is indeed over , change canvas to display gameover screen (this is just to make sure)
	if(gameIsOver)
	{
		c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height); //display gameover screen
		score = 0; //reset score to 0
		timer = 0; //reset time to 0
	}
}

//resets all the intervals and re-draws the canvas when reset game button is pushed (if game is over only)
function startGame()
{
	"use strict";
	if(gameIsOver) //only do so if game is indeed over, just to make sure
	{

		//reset all the intervals (make sure)
		clearInterval(gameLoop);
		clearInterval(timerInterval);
		clearInterval(scoreInterval);
		clearInterval(moveInterval);
		clearInterval(monsterInterval);
		clearInterval(treasureInterval);
		
		//reset state of game
		gameIsOver = false;
		treasureIsSpawned = false;
		monsterIsDead = false;
		
		//reset all the locations
		mainChar = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor( Math.random() * gridNum ) * gridY, health: 3};
		enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY}
		object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY };
		object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
		
		//redraw all items
		c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
		c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
		c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY);
		c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
		
		//start the intervals again
		gameLoop = setInterval(doGameLoop, 16);
		timerInterval = setInterval(timeCount, 1000);
		scoreInterval = setInterval(addScoreByTime, 50);
		moveInterval = setInterval(moveLimit, 250);
		monsterInterval = setInterval(forceMonsterMove, 1000);
		treasureInterval = setInterval(spawnTreasure, 3000);
		
		//change image of enemy randomly
		if(Math.floor(Math.random () * 2) == 1)
		{
			enemyImg.src = "enemy2.png";
		}
		else
		{
			enemyImg.src = "enemy.png";
		}
		//change image of object randomly
		if(Math.floor(Math.random() * 2) == 1)
		{
			objectImg.src = "flames.png";
		}
		else
		{
			objectImg.src = "beartrap.png";
		}
	}
	else //game is not over, so cannot restart game
	{
		alert("Game is not over");
	}
}

//add time for every 1 second, called by timerInterval
function timeCount()
{
	"use strict";
	timer += 1;
}

//every 3 seconds, decide whether to spawn the treasure chest on the map
function spawnTreasure()
{
	"use strict";
	if(!treasureIsSpawned) // if treasure does not exist
	{
		"use strict";
		//there is a probability to spawn treasure chest
		var decideTreasure = Math.floor(Math.random() * 6) + 1;	
		if(decideTreasure > 4)
		{
			object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y:  Math.floor ( Math.random () * gridNum ) * gridY }; //change location
			//find a spot until it is not at the same position as other things
			do
			{
				object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y:  Math.floor ( Math.random () * gridNum ) * gridY }; //change location
			}while((object2.x == yourChar.x && object2.y == yourChar.y) || (object2.x == object1.x && object2.y == object1.y) 
			|| (object2.x == enemy1.x && object2.y == enemy1.y));
			treasureIsSpawned = true; //treasure is spawned
		}
	}
	else //if treasure already exists, remove it after 3 seconds
	{
		treasureIsSpawned = false; //remove treasure chest
	}
}

//add score for every x seconds
function addScoreByTime()
{
	"use strict";
	score += 2;
}

//limit the moves of the user to once every 0.25 seconds so that there's no cheating
function moveLimit()
{
	"use strict";
	canMove = true; //set so that user can move
}

//this function is to force call the monsterMove. I tried and this function must exist. Do this every 0.75 seconds
function forceMonsterMove()
{
	"use strict";
	monsterMove(); //move monster
}

//this is the main movement function
function keyboardAction(event)
{
	"use strict";
	var key = event.which; //get the key pressed
	if(!gameIsOver) //game must be not over yet to move
	{
		if(canMove) //if movement is not restricted
		{
			switch(key) //depends on which key is pressed, do something
			{
				//move up, W
				case 119:
				case 87: 
					if(mainChar.y!= 0) //stay inside canvas
					{
						mainChar.y -= gridY; //move character up
					}
					if(Math.floor(Math.random () * 10) > 2)
					chanceMonsterMove(); //chance that monster moves if player moves
					canMove = false; //limit movement
					break;
				
				//move left, A
				case 97: 
				case 65:
					if(mainChar.x != 0) //stay inside canvas
					{
						mainChar.x -= gridX; //move character to the left
					}
					if(Math.floor(Math.random () * 10) > 2)
					chanceMonsterMove(); //chance that monster moves if player moves
					canMove = false; //limit movement
					break;
				
				//move right, D
				case 100: 
				case 68:
					if(mainChar.x != canvas.width - gridX) //stay inside canvas
					{
						mainChar.x += gridX; //move character to the right
					}
					chanceMonsterMove(); //chance that monster moves if player moves
					canMove = false; //limit movement
					break;
				
				//move down, S
				case 115: 
				case 83:
					if(mainChar.y != canvas.height - gridY) //stay inside canvas
					{
						mainChar.y += gridY; //move character down
					}
					chanceMonsterMove(); //chance to monster moves if player moves
					canMove = false; //limit movement
					break;
			}
		}
	}
}


//algorithm for monster movement
function monsterMove()
{
	"use strict";
	if(!gameIsOver) //if the game is still playing
	{
		score += 100; //add score for movement
		var randomX = randomizeSteps(), //random algorithm
		randomY = randomizeSteps(); //random algorithm
		if(enemy1.x > mainChar.x) //if monster is to the right of the player
		{
			enemy1.x -= randomX * gridX; //move closer to the player
		}
		else if(enemy1.x < mainChar.x) //if enemy is to the left of the player
		{
			enemy1.x += randomX * gridX; //move closer to the player
		}
		if(enemy1.y > mainChar.y) //if enemy is to the bottom of the player
		{
			enemy1.y -= randomY * gridY; //move closer to the player
		}
		else if(enemy1.y < mainChar.y) //if enemy is to the top of the player
		{
			enemy1.y += randomY * gridY; //move closer to the player
		}
	}
}

//there's a high chance that if the player moves, monster moves too
function chanceMonsterMove()
{
	"use strict";
	if(Math.floor(Math.random () * 10) > 1)
	{
		monsterMove();
	}
}

//decide how many steps to take for monsters' algorithm
function randomizeSteps()
{
	"use strict";
	//random algorithm for steps decision
	var random = Math.floor(Math.random() * 7);	
	if(random > 2)
	{
		return 1; //one step
	}
	else 
	{
		return 0; //no move
	}
	
}

//what to do when game over
function gameOver()
{
	"use strict";
	
	//remove treasure chest to make sure it doesnt exist on next start game
	treasureIsSpawned = false;
	c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height); //draw the gameover screen
	
	//make sure to clear all the intervals
	clearInterval(gameLoop); 
	clearInterval(scoreInterval);
	clearInterval(timerInterval);
	clearInterval(moveInterval);
	clearInterval(monsterInterval);
	clearInterval(treasureInterval);
	
	//change high score to current score if it is bigger
	if(score > highScore)
	{
		highScore = score;
		$('#highScore').html(highScore + ", with time " + timer ); //display so on the page
	}
	
	//reset score and timer
	score = 0;
	timer = 0;
	gameIsOver = true; //game is over
	c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height); //display gameover screen
}
