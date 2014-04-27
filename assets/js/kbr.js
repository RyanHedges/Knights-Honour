var board,
    game = new Chess('n7/8/8/8/8/8/8/7N w - - 0 1'),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');
    var startPOS = ["Nh1","Na8"]
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

function compareHistory(target) {
  // loop through history array
  // compare target to move history
  // return null if match
  var his = game.history()
  his.pop()
  his.unshift(startPOS[0], startPOS[1])
  for(var i=0; i < (his.length-1); i++) {
    console.log("For")
    if(target === his[i].substr(1)) {
      console.log("hey we are in compareHistory")
      return null
    }
  }
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
  });

  if (source === target) {
    return 'snapback';
  } else {
    var history = compareHistory(target)
    if (history === null){
      game.undo()
      console.log('Illegal move');
      return 'snapback';
    }
  }
  // illegal move
  if (move === null) {
    console.log('Illegal move');
    return 'snapback';
  }
  greySquare(source);
  updateStatus();
};

var onSnapEnd = function() {
  board.position(game.fen());

};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var cfg = { 
  draggable: true,
  moveSpeed: 'slow',
  position: 'n7/8/8/8/8/8/8/7N',
  // position: 'start',
  // position: {
  //   d4: 'bN',
  //   e5: 'wN',
  //   a1: 'wK',
  //   h8: 'bK'
  // },

  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = new ChessBoard('board', cfg);

updateStatus();
