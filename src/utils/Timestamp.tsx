export function Timeformatter(unixTime: string, isUTC: boolean): string {
  var scoreTime = new Date(unixTime);
  if (isUTC) {
    scoreTime = new Date(scoreTime.getTime() - 9 * 60 * 60 * 1000);
  }
  const formattedTime =
    scoreTime.getUTCFullYear().toString().slice(2, 4) +
    "." +
    (scoreTime.getUTCMonth() + 1).toString().padStart(2, "0") +
    "." +
    scoreTime.getUTCDate().toString().padStart(2, "0") +
    " " +
    (scoreTime.getUTCHours() % 24).toString().padStart(2, "0") +
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
    return hour.toString() + "시간 " + min.toString() + "분";
  }
  return (
    day.toString() +
    "일 " +
    hour.toString() +
    "시간 " +
    `${min > 0 ? min.toString() + "분" : ""}`
  );
}
