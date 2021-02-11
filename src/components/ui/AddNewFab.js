import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal } from "../../actions/ui";

export const AddNewFab = () => {
  const { activeEvent } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();

  const handleNewFab = () => {
    dispatch(uiOpenModal());
  };
  return (
    <button className="btn btn-primary fab" onClick={handleNewFab}>
      <i className={activeEvent ? "fas fa-edit" : "fas fa-plus"}></i>
    </button>
  );
};
