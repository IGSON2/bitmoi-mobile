import "./LoginBlur.css"

export function LoginBlur(){
    return(
        <div className="login_blur">
            <div className="login_blur_blur"></div>
            <div className="login_blur_login">
                <div className="login_blur_login_title">회원만 할 수 있는 기능입니다.<br/>로그인 하시겠습니까?</div>
                <div className="login_blur_buttons">
                    <button className="login_blur_cancel" onClick={() => {window.location.href = "/invest";}}>취소</button>
                    <button className="login_blur_signin" onClick={() => {window.location.href = "/login";}}>로그인 및 회원가입</button>
                </div>
            </div>
        </div>
    )
}