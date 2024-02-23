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
    const storedTime = localStorage.getItem(porps.storageKey);

    if (storedTime) {
      const stored = new Date(storedTime);
      if (current.getTime() - stored.getTime() < 1000 * 60 * 60 * 24) {
        return;
      }
    }
    console.log(storedTime);
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
