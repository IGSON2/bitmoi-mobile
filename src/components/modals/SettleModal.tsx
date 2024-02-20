import "./SettleModal.css";
interface SettleModalProps {
  total_pnl: number;
}
export function SettleModal(total_pnl: SettleModalProps) {
  const pnl = total_pnl.total_pnl;
  return (
    <div className="settleModal">
      <p>
        {`포지션 비정상 종료로 인해 발생한 미정산 ${
          pnl < 0 ? "손실금" : "수익금"
        }`}{" "}
        <span style={pnl < 0 ? { color: "red" } : { color: "blue" }}>
          {pnl}
        </span>{" "}
        USDP가 정산되었습니다.
      </p>
    </div>
  );
}
