import "./LoginModal.css";

interface LoginModalProps {
  reqUrl: string;
}

export function LoginModal(lmp: LoginModalProps) {
  return (
    <div className={`login_modal fixed-component`}>
      <div className={`login_modal_blur fixed-component`}></div>
      <div className={`login_modal_login fixed-component`}>
        <div className="login_modal_login_title">
          회원만 할 수 있는 기능입니다.
          <br />
          로그인 하시겠습니까?
        </div>
        <div className="login_modal_buttons">
          <button
            className="login_modal_cancel"
            onClick={() => {
              window.location.href = "/invest";
            }}
          >
            취소
          </button>
          <button
            className="login_modal_signin"
            onClick={() => {
              window.location.href = `/login/${lmp.reqUrl}`;
            }}
          >
            로그인 및 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
