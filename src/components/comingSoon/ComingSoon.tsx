import "./ComingSoon.css";

interface ComingSoonProps {
    name: string;
    description: string;
    href: string;
}

export function ComingSoon(props: ComingSoonProps) {
    return(
        <div className="comingsoon">
            <img className="comingsoon_logo" alt="logo" src="/images/bitmoi.png" />
            <div className="comingsoon_info">
                <p>{`${props.name}는 준비중...`}</p>
                <p>{`${props.description}`}</p>
            </div>
            <img
                className="comingsoon_back"
                onClick={() => {
                window.location.href = `/${props.href}`;
                }}
                src="/images/left_arrow.png"
                alt="back"
            />
        </div>
    )
}