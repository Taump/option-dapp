import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeActiveAA } from "../../store/actions/aa";

export const InnerRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();

  if (location.hash) {
    const address = location.hash.slice(1);
    dispatch(changeActiveAA(address));
  }

  return children;
};
