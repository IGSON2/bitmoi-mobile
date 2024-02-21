import "./MypageHeader.css";

interface MypageHeaderProps {
  title: string;
}
export function MypageHeader(props: MypageHeaderProps) {
  return (
    <div className="mypage_header">
      <img
        className="mypage_header_back"
        onClick={() => {
          window.location.href = "/mypage";
        }}
        src="/images/left_arrow.png"
        alt="back"
      />
      <div className="mypage__header_title">{props.title}</div>
    </div>
  );
}
