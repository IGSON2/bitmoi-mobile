import React, { useEffect, useState } from "react";
import "./LimitedTimeModal.css";
import { MockInvestWarning } from "./LimitedElements/MockInvestWarning";

interface LimitedTimeModalProps {
  storageKey: string;
}
export const MockInvestWarningKey = "mockInvestWarning";

export function LimitedTimeModal(porps: LimitedTimeModalProps) {
  const [isShow, setIsShow] = useState<boolean>(false);

  const [componentToRender, setComponentToRender] =
    useState<JSX.Element | null>(null);

  useEffect(() => {
    const current = new Date();
    const storedTime = Number(localStorage.getItem(porps.storageKey));

    if (storedTime) {
      if (current.getTime() - storedTime < 1000 * 60 * 60 * 24) {
        return;
      }
    }
    setIsShow(true);
    localStorage.setItem(porps.storageKey, current.getTime().toString());

    switch (porps.storageKey) {
      case MockInvestWarningKey:
        setComponentToRender(<MockInvestWarning closer={setIsShow} />);
    }
  }, []);

  if (isShow && componentToRender) {
    return <div className="limited_time_modal">{componentToRender}</div>;
  } else {
    return null;
  }
}
