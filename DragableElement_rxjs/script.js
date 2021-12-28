let frame = document.getElementsByClassName('dragable')[0];

let down = rxjs.fromEvent(frame, 'touchstart');
let move = rxjs.fromEvent(document, 'touchmove');
let up = rxjs.fromEvent(document, 'touchend');

let downPosition = down.pipe(
  rxjs.map(e => ({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      originX: e.target.getBoundingClientRect().left,
      originY: e.target.getBoundingClientRect().top
    }
  ))
)

move = move.pipe(
  rxjs.takeUntil(up)
)

afterDownWatchMove = down.pipe(
  rxjs.concatMapTo(move),
  rxjs.map(e => ({
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  })),
  rxjs.withLatestFrom(downPosition)
).subscribe(positions => {
  let currPos = positions[0];
  let pastPos = positions[1];
  
  frame.style.top = pastPos.originY + (currPos.y - pastPos.y) + 'px';
  frame.style.left = pastPos.originX + (currPos.x - pastPos.x) + 'px';
  
}) 
