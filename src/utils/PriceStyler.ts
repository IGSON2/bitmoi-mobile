export function FormatPosNeg(num: number): string {
  const parts: string[] = num.toString().split(".");
  const integerPart: string = parts[0];
  const decimalPart: string = parts[1] || "";

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (num >= 0) {
    if (num === 0) {
      return "0";
    }
    return `+${formattedInteger}${decimalPart === "" ? "" : "."}${decimalPart}`;
  } else {
    return `${formattedInteger}${decimalPart === "" ? "" : "."}${decimalPart}`;
  }
}
