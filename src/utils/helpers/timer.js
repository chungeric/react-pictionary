const ROUND_TIME = 10;

export function startTimer(time = ROUND_TIME) {
  let timerz = time;
  let gameTimer = setInterval( () => {
    if (timerz == 0) {
      timerz = ROUND_TIME;
    }
    timerz--;
    // console.log(timer);

  }, 1000);
}
