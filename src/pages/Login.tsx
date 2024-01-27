import "./Login.css";

export const Login = () => {
  function login() {
    const apiURL = process.env.REACT_APP_API_URL || "https://api.bitmoi.co.kr";
    window.location.href = `${apiURL}/oauth`;
  }
  return (
    <div className="login">
      <h3 className="login_title">Bitmoi</h3>
      <img className="login_logo" src="/images/bitmoi.png" />
      <div className="login_info">
        {"비트모이는 구글 이메일이 있어야 서비스 이용이 가능합니다."}
      </div>
      <img
        className="login_oauth"
        src="/images/google_login.png"
        onClick={login}
      />
    </div>
  );
};
