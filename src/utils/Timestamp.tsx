export function Timeformatter(unixTime: string, isChart: boolean): string {
  var scoreTime = new Date(unixTime);
  var timeGap = 9;
  if (isChart) {
    timeGap = 0;
    scoreTime = new Date(parseInt(unixTime));
  }
  const formattedTime =
    scoreTime.getUTCFullYear().toString().slice(2, 4) +
    "." +
    (scoreTime.getUTCMonth() + 1).toString().padStart(2, "0") +
    "." +
    scoreTime.getUTCDate().toString().padStart(2, "0") +
    " " +
    ((scoreTime.getUTCHours() + timeGap) % 24).toString().padStart(2, "0") +
    ":" +
    scoreTime.getUTCMinutes().toString().padStart(2, "0") +
    ":" +
    scoreTime.getUTCSeconds().toString().padStart(2, "0");
  return formattedTime;
}

export function ConvertSeconds(sec: number): string {
  const day = Math.floor(sec / 86400);
  const hour = Math.floor((sec % 86400) / 3600);
  const min = Math.floor((sec % 3600) / 60);
  if (day === 0) {
    return (
      hour.toString().padStart(2, "0") +
      "시간 " +
      min.toString().padStart(2, "0") +
      "분"
    );
  }
  return (
    day.toString() +
    "일 " +
    hour.toString().padStart(2, "0") +
    "시간 " +
    min.toString().padStart(2, "0") +
    "분"
  );
}
