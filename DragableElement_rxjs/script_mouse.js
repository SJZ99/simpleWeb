let frame = document.getElementsByClassName('dragable')[0];

let down = rxjs.fromEvent(frame, 'mousedown');
let move = rxjs.fromEvent(document, 'mousemove');
let up = rxjs.fromEvent(document, 'mouseup');

// move = move.pipe(
//     rxjs.takeUntil(up)
// )

down.pipe(
    rxjs.concatMapTo(
        move.pipe(
            rxjs.takeUntil(up)
        )
    )
).subscribe(e => {
    console.log('down', e);
})

move.subscribe(e => {
    console.log('move')
})

up.subscribe(e => {
    console.log('up')
})

