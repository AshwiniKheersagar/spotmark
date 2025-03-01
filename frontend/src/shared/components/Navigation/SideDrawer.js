import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./SideDrawer.css";

const SideDrawer = props => {
  const nodeRef = useRef(null); // ✅ Add ref to avoid findDOMNode error

  const content = (
    <CSSTransition 
      in={props.show} 
      timeout={200} 
      classNames="slide-in-left" 
      unmountOnExit
      nodeRef={nodeRef} // ✅ Pass nodeRef to CSSTransition
    >
      <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
