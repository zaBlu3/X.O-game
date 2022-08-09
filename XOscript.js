let gameSize;
let moves = [];
let saved = [];
let record = "No record yet!";
let gameEnded = false;
let playerTurn;
let board;
let winCon;
const endMenu = document.getElementById("endMenu");
const startMenu = document.getElementsByClassName("menu")[0];
const finishMenu = document.getElementsByClassName("menu")[1];
const turn = document.getElementById("turn");
const gameBoard = document.getElementById("gameBoard");
function hide_show_Div(div) {
	div.style.display == "none"
		? (div.style.display = "flex")
		: (div.style.display = "none");
}
function changeSize(size) {
	if (size < 3 || size > 9) return; // doesnt support more than 9 becuase on this winCon array
	hide_show_Div(startMenu);
	gameSize = +size;
	let table = document.createElement("table");
	for (let i = 1; i <= gameSize; i++) {
		let tr = document.createElement("tr");
		for (let j = 1; j <= gameSize; j++) {
			let td = document.createElement("td");
			td.id = "" + i + j;
			td.onclick = function () {
				addPic(td.id);
			};

			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	gameBoard.appendChild(table);
	playerTurn = document.getElementById("X").checked ? "x" : "o";
	turn.innerText = `now its ${playerTurn} turn`;
	board = makeBoard();
	winCon = creatWinCons();
}
function makeBoard() {
	let arr = Array.from(Array(gameSize), () => Array(gameSize).fill(""));
	return arr;
}
function creatWinCons() { // creat possible win con
	let arr = new Array();
	let diag1 = Array.from(Array(gameSize), (v, i) => i + `${i}`);
	let diag2 = Array.from(Array(gameSize), (v, i) => i + `${gameSize - i - 1}`);
	arr.push(diag1, diag2);
	for (let i = 0; i < gameSize; i++) {
		let col = Array.from(Array(gameSize), (v, j) => j + `${i}`);
		let row = Array.from(Array(gameSize), (v, j) => `${i}` + j);
		arr.push(row, col);
	}

	return arr;
}

function addPic(id) {
	let td = document.getElementById(id);
	if (td.innerHTML != "" || gameEnded) { //check if already contain or game ended
		return;
	}
	let imgElem = document.createElement("img");
	imgElem.src = `./${playerTurn}.png`;
	imgElem.value = playerTurn;
	imgElem.width = imgElem.height = "100";
	board[id[0] - 1][id[1] - 1] = playerTurn;//id contain row and col for example id is 11 so the first row and first colm which is board[0][0]
	td.appendChild(imgElem);
	moves.push([imgElem, id]);//moves contain the  img element and the id (his place)
	checkBoard()
	changeTurn();
}

function undo() {
	if (!moves.length) return alert("no moves to undo");
	let temp = moves.pop();
	
	/*temp is elemnt of move which contains array and the second place of that array is the id (for example 11 - which as explained before is repesenting the first cell of the board)
	there for temp[1][0] is 1 and temp[1][1] is also 1 and to get the first cell of the board array we need to -1 so we get board[0][0] */
	board[temp[1][0] - 1][temp[1][1] - 1] = "";
	temp[0].remove();//temp[0] contains the img elemnt so we remove it

	if(gameEnded) resetTurnStyle();//reset the style
	gameEnded = false;//incase we did undo on the last move
	changeTurn();
}

function showRecord() {
	alert(`record -  ${record} `);
}

function save() {
	if (!moves.length) return alert("no moves to save");
	saved = Array.from(moves);
}

function load() {
	if (!saved.length) return alert("no board saved");
	while (moves.length != 0) undo();
	saved.forEach((element) => addPic(element[1]));
}

function changeTurn() {
	playerTurn = playerTurn == "x" ? "o" : "x";
	if(!gameEnded) turn.innerText = `now its ${playerTurn.toUpperCase()} turn`;
}

function checkBoard() {
	let win = [];
	for (let index = 0; index < board.length; index++) {
		for (let J = 0; J < board.length; J++) {
			if (board[index][J] === playerTurn) {
				win.push(index + `${J}`);
			}
		}
	} // make array that represents all player cells
	if (checkWin(win)) endGame(playerTurn.toUpperCase() + " IS THE WINNER!!");
	else if (checkDraw()) endGame("Draw!!");

}
function endGame(string) {
	endMenu.innerText = string;
	turn.classList.add(playerTurn) // add style based of winner
	turn.innerText = string == "Draw!!" ? "No \n Winner" : "* "+ playerTurn.toUpperCase()+ " * \n !!WON!!" ;
	hide_show_Div(finishMenu);
	gameEnded = true;
	
}

function checkDraw() {
	if (moves.length == gameSize ** 2) return true;
	return false;
}

function checkWin(winBoard) {
	for (let index = 0; index < winCon.length; index++) {
		if (winCon[index].every((i) => winBoard.includes(i))) {
			if (typeof record == "string" || record > moves.length)
				record = moves.length;
			return true;
		}
	}
	return false;
}
function resetGame() { //reset the whole game to choose deffrent size and turn 
	let gameBoard = document.getElementById("gameBoard");
	turn.innerText="";
	gameBoard.innerText = "";
	record = "No record yet!";
	hide_show_Div(finishMenu);
	hide_show_Div(startMenu);
	resetVlaues();
	
}
function resetTurnStyle(){
	turn.classList.remove("x", "o"); // reset style of turn to normal

}
function resetVlaues(){//reset game values
	moves = [];
	saved = [];
	gameEnded = false;
	resetTurnStyle()

}

function resetBoard() { // only reset board
	if (moves.length == 0) return alert("no moves has been done yet");
	playerTurn = moves[0][0].value;
	turn.innerText = `now its ${playerTurn.toUpperCase()} turn`;
	resetVlaues();
	board = makeBoard();
	let arrOfTd = [...document.getElementsByTagName("TD")];
	arrOfTd.forEach((element) => (element.innerHTML = ""));
}
