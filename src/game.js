BOARD_IMAGE_SIZE = 480;
MARK_IMAGE_SIZE  = 99;
FIRST_BAR        = 150;
SECOND_BAR       = 310;
BAR_THICKNESS    = 20;

var canvas = document.getElementById("canvas");
var ctx    = canvas.getContext("2d");
canvas.width  = BOARD_IMAGE_SIZE;
canvas.height = BOARD_IMAGE_SIZE;

var bgImage = new Image();
var xImage  = new Image();
var oImage  = new Image();
bgImage.src = "../images/board.png";
xImage.src  = "../images/x.png";
oImage.src  = "../images/o.png";

bgImage.onload = function () {
    ctx.drawImage(bgImage, 0, 0);
};

var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
var mark = 'x';

canvas.addEventListener("click", addMark, false);

function addMark(event) {
    var x = event.x;
    var y = event.y;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    if (isIllegalMove(x, y)) {
        return;
    }

    var row = getRowOrColFromCoordinate(y);
    var col = getRowOrColFromCoordinate(x);

    if (board[row][col] === 0) {
        board[row][col] = mark;

        var drawX = getCoordinateToDrawAt(col);
        var drawY = getCoordinateToDrawAt(row);
        var drawImage;

        if (mark === 'x') {
            drawImage = xImage;
        } else {
            drawImage = oImage;
        }

        ctx.drawImage(drawImage, drawX, drawY);
        mark = switchMark(mark);
        endGame(didPlayerWin(row, col), switchMark(mark));
    }
};

function switchMark(mark) {
    if (mark === 'x') {
        return 'o';
    } else if (mark === 'o') {
        return 'x';
    }
};

function endGame(didPlayerWin, mark) {
    if (didPlayerWin) {
        alertAndUpdateWinner("Player " + mark.toUpperCase() + " won!", "player" + mark.toUpperCase());
        reset();
    } else if (isBoardFull()) {
        alertAndUpdateWinner("Draw!", "draws");
        reset();
    }
};

function alertAndUpdateWinner(alertText, id) {
    alert(alertText);
    var wins = parseInt(document.getElementById(id).innerHTML) + 1;
    document.getElementById(id).innerHTML = wins;
};

function isIllegalMove(x, y) {
    if (x >= FIRST_BAR && x <= FIRST_BAR + BAR_THICKNESS || x >= SECOND_BAR && x <= SECOND_BAR + BAR_THICKNESS) {
        return true;
    } else if (y >= FIRST_BAR && y <= FIRST_BAR + BAR_THICKNESS || y >= SECOND_BAR && y <= SECOND_BAR + BAR_THICKNESS) {
        return true;
    }

    return false;
};

function getCoordinateToDrawAt(rowOrCol) {
    return ((rowOrCol * 2) + 1) * BOARD_IMAGE_SIZE / 6 - MARK_IMAGE_SIZE / 2;
};

function getRowOrColFromCoordinate(coordinate) {
    var rowOrCol = 0;

    if (coordinate > FIRST_BAR + BAR_THICKNESS && coordinate < SECOND_BAR) {
        rowOrCol = 1;
    } else if (coordinate > SECOND_BAR + BAR_THICKNESS) {
        rowOrCol = 2;
    }

    return rowOrCol;
};

function didPlayerWin(row, col) {
    // vertical
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        return true;
    }

    // horizontal
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        return true;
    }

    // diagonal top left to bottom right
    if (row === col && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    }

    // diagonal bottom left to top right
    if (row + col === 2 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    }

    return false;
};

function isBoardFull() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0)
                return false;
        }
    }

    return true;
};

function reset() {
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0);
    mark = 'x';
};

reset();
