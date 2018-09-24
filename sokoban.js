/* updated by Mariana on 05/02/2018*/

"use strict";

//setting the game variables
var tableName = "boardTable";
var man = '@';
var wall = '#';
var box = 'O';
var goal = '.';
var empty = ' ';

//setting the level initial number
var level = 0;

//setting variables for moving the object on the board
var board;
var goalPosition;

//counting the movements
var movements = 0;

//Boolean to set if the game has started a new level or not
var newLevel = false;

//game levels
var boardLevel = [[
["#", "#", "#", "#", "#", "#", "#", "#"],
["#", " ", " ", " ", ".", " ", " ", "#"],
["#", ".", " ", "O", " ", ".", " ", "#"],
["#", " ", " ", " ", " ", " ", " ", "#"],
["#", " ", " ", " ", "O", " ", " ", "#"],
["#", " ", " ", " ", "@", " ", " ", "#"],
["#", " ", " ", " ", "O", " ", " ", "#"],
["#", " ", " ", "#", "#", " ", " ", "#"],
["#", " ", " ", " ", " ", " ", " ", "#"],
["#", "#", "#", "#", "#", "#", "#", "#"]
],
[
["#", "#", "#", "#", "#", "#"],
["#", " ", " ", ".", " ", "#"],
["#", ".", "O", " ", ".", "#"],
["#", " ", " ", " ", " ", "#"],
["#", " ", " ", "O", " ", "#"],
["#", " ", " ", " ", " ", "#"],
["#", " ", " ", "O", " ", "#"],
["#", "#", " ", "#", " ", "#"],
["#", "@", " ", " ", " ", "#"],
["#", "#", "#", "#", "#", "#"]
]];


//function creates a class name for each kind of image in the board and display it
function setImage( element ){
	var x;
	if ( element == man ) {
		x = document.createElement( 'img' );
		x.className = 'boardMan';
		x.src = 'assets/mario.png';
	} else if ( element == wall ) {
		x = document.createElement( 'img' );
		x.className = 'boardWall';
		x.src = 'assets/wall.png';
	} else if ( element == box ) {
		x = document.createElement( 'img' );
		x.className = 'boardBox';
		x.src = 'assets/square.png';
	} else if ( element == goal ) {
		x = document.createElement( 'img' );
		x.className = 'boardGoal';
		x.src = 'assets/goal.png';
	}
	else {
		x = document.createTextNode( element );
	}
	return x;
}

//refreshes the HTML table with the information provided from the board
function updateBoard( board, tableId ) {
	//clear the current HTML in the table
	var tab = document.getElementById( tableId );
	tab.innerHTML = '';

//look through the array rows and columns and displays information in the screen

	//create the table row and column elements dinamically based on the board array
	for ( var line in board ) {
		//for each row in the array one tr is created
		var row = document.createElement( 'tr' );
		for ( var col in board[line] ) {
			//for each column in the array row, one td is creaded
			var td = document.createElement( 'td' );
			//create content from the board element
			//////////////////var content = document.createTextNode( board[line][col] );
			var content = setImage( board[line][col] );
			//add content to the td
			td.appendChild( content );
			//add td to the row
			row.appendChild( td );
		}
		//add the row to the table
		tab.appendChild( row );
	}
}


//finds the man position in the board and returns this position as array of coordinates y and x
function findMan( b ) {
	var position = [];
	//for each row in the board
	for ( var line in b ) {
		//for each element in the row searches the position of the man
		var linePosition = b[line].indexOf( man );
		//if the value matches (is bigger than 0 because the method 'indexOf' returns -1 if the value never occurs)
		if ( linePosition >= 0 ) {
			//add the matching element position to the coordinates array
			position = [Number( line ), linePosition]; //the line value was being stored by the indexOf as a string, so I turned that to a number
			//return the coordinates array
			return position;
		}
	}
}

//find all the elements matching 'e' in the board. Returns an array of coordinates
function findElem( e, b ) {
	var position = [];
	//for each row in the board
	for ( var line in b ) {
		//for each element of the row
		for ( var elem in b[line] ) {
			//check if the element matches 'e'
			if ( b[line][elem] == e ) {
				//add the matching element position to the coordinates array
				position.push( [line, elem] );
			}
		}
	}
	//return the array of results
	return position;
}

//Returns the original floor value to the board, either empty or goal
function getEmpty( x,y ){
	//scans the goal position array to see if the current position is a goal
	//goal position is an array of two elements arrays
	for ( var pos in goalPosition ) {
		var gpX = goalPosition[pos][0];
		var gpY = goalPosition[pos][1];
		//verifies if this goal position corresponds to the position sent to the function
		if ( gpX == x && gpY == y ) {
			//if there is a correspondence, the value of the goal variable will be returned
			return goal;
		}
	}
	//if there is not a correspondence, the floor value will be empty
	return empty;
}

//move the man and the box in the canvas
function moveObj( position, direction, b ) {
	//row
	var x = position[0];
	//column
	var y = position[1];
	//new position in x
	var i = x;
	//new position in y
	var j = y;

	//if the key pressed was up
	if ( direction == 'up' ) {
		//move the man up
		i = x-1;
		//if the key pressed was down
	} else if ( direction == 'down' ) {
		//move the man down
		i = x+1;
		//if the key pressed was left
	} else if ( direction == 'left' ) {
		//move the man left
		j = y-1;
		//if the key pressed was right
	} else if ( direction == 'right' ) {
		//move the man right
		j = y+1;
	}

	var newPos = b[i][j];
	var oldPos = b[x][y];
	//if the new position is empty or is a goal, moves tha man to the new position and updates the floor value of the old position.
	if ( newPos == empty || newPos == goal ) {
		b[i][j] = oldPos;
		//if the goal was stored in the previous position, getEmpty will mantain the floor value of th variable goal
		b[x][y] = getEmpty( x,y );
		increaseSteps();
		//considering that there is no more than one box to push
	} else if ( newPos == box && oldPos != box ){
		//if the man can move and move the box
		if ( moveObj( [i,j], direction, b ) == true ) {
			b[i][j] = oldPos;
			//if the goal was stored in the previous position, getEmpty will mantain the floor value of th variable goal
			b[x][y] = getEmpty( x,y );
		}
	} else {
		//if none of the conditions were true, the man does not move
		return false;
	}

	//verifies if the box reached the goal
	if ( oldPos == box && getEmpty( i,j ) == goal ) {
		//check if other boxes are in the goal as well
		var matchBoxes = 0;
		var boxPosition = findElem( box, b );
		// console.log(boxPosition);
		//for each row in the goalPosition
		for ( var goalPos in goalPosition ) {
			//for each row in the boxPosition
			for ( var boxPos in boxPosition ) {
				//if there is match between the a coordinate of box and goal
				if ( goalPosition[goalPos][0] == boxPosition[boxPos][0] && goalPosition[goalPos][1] == boxPosition[boxPos][1] ){
					//increment one to matchBox
					matchBoxes++;
				}
			}
		}
		//if the number of goals are the same as matchboxes
		if ( goalPosition.length == matchBoxes ) {
			//display the win message to the player
			finishLevel();
		}
	}

	//updates the HTML table according to the board
	updateBoard( b, tableName );

	//returns true if the game has ended
	return true;
}

//Updates level and newLevel values and displays a message to the user
function finishLevel() {
	document.getElementById( 'message' ).innerHTML = 'Puzzle Solved! Press <strong>spacebar</strong> to go to the next level.';
	level++;
	newLevel = true;
	if ( level == boardLevel.length ) {
		console.log( 'Finish' );
		document.getElementById( 'message' ).innerHTML = '<strong>You are an expert! Congratulations!</strong><p> Reload the page to solve the puzzles again. </p>';
		document.onkeydown = keyBlock();
	}
}

//blocks the keyboard event in the window
function keyBlock() {
	window.event = false;
}

function startGame( level ){
	console.log( 'Start game level '+level );
	//resets movements to 0
	movements = 0;

	//calls the function to increase the steps in each movement
	increaseSteps();

	newLevel = false;

	board = boardLevel[level];

	//get the goal positions from the board array
	goalPosition = findElem( goal, board );

	//initializes the table board
	updateBoard( board, tableName );
}

//this function consider the object movement and increases the number of movements in the dom
function increaseSteps(){
	document.getElementById( 'steps' ).innerHTML = movements;
	movements++;
}

//starts the game when the page loads
window.onload = startGame( level );


//captures the keyboard events
document.onkeydown = function(){

	//get pressed key code
	var keyCode = window.event.keyCode;

	//key map
	var key = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		32: 'spacebar'
	};
	//if the newLevel is true
	if ( newLevel == true ) {
		//if the key pressed is spacebar
		if ( keyCode == 32 ) {
			//calls the function start game with a new level
			startGame( level );
			// console.log('new game');
			document.getElementById( 'message' ).innerHTML = '';
		}
	}
	//if key code is between the range of directional keys
	else if ( keyCode >= 37 && keyCode <= 40 ) {
		// findMan() returns the man position
		// key[keyCode] is the direction from the key map
		// The values above are passed to moveObj to move the man
		moveObj( findMan( board ),key[keyCode],board );
	}
}
