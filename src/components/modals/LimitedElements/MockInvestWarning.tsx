import "./MockInvestWarning.css";

const contents = [
  "연습모드는 USDP를 사용하여",
  "종목, 시간이 특정 과거시점에서 모의투자하는",
  "서비스입니다.",
  "",
  "USDP는 연습모드에서 사용되는 포인트로",
  "현금으로 충전, 환전이 불가능하며",
  "매일 접속시 1회 자동충전이 됩니다.",
];

interface MockInvestWarningProps {
  closer: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

export const MockInvestWarning = (props: MockInvestWarningProps) => {
  return (
    <div className="mock_invest_warning">
      <div className="mock_invest_warning_title">유의사항</div>
      <br />
      {contents.map((content, index) => {
        return content === "" ? (
          <br key={index} />
        ) : (
          <p className="mock_invest_warning_content" key={index}>
            {content}
          </p>
        );
      })}
      <br />
      <button
        onClick={() => {
          console.log(props.closer);
          if (props.closer) {
            props.closer(false);
          }
        }}
      >
        확인하고 진행
      </button>
    </div>
  );
};
