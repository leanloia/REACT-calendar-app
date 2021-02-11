import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    const resp = await fetchSinToken("auth", { email, password }, "POST");
    const body = await resp.json();

    if (body.ok) {
      // guardo token en local...
      localStorage.setItem("Token", body.token);
      // ... y guardo la fecha de inicio de dicho token
      localStorage.setItem("Token-init-date", new Date().getTime());

      dispatch(
        login({
          uid: body.uid,
          name: body.name,
        })
      );
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

export const startRegister = (name, email, password) => {
  return async (dispatch) => {
    const resp = await fetchSinToken(
      "auth/new",
      { name, email, password },
      "POST"
    );
    const body = await resp.json();

    if (body.ok) {
      // guardo token en local...
      localStorage.setItem("Token", body.token);
      // ... y guardo la fecha de inicio de dicho token
      localStorage.setItem("Token-init-date", new Date().getTime());

      dispatch(
        login({
          uid: body.uid,
          name: body.name,
        })
      );
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

export const startChecking = () => {
  return async (dispatch) => {
    const resp = await fetchConToken("auth/renew", {}, "GET");
    const body = await resp.json();

    if (body.ok) {
      // guardo token en local...
      localStorage.setItem("Token", body.token);
      // ... y guardo la fecha de inicio de dicho token
      localStorage.setItem("Token-init-date", new Date().getTime());

      dispatch(
        login({
          uid: body.uid,
          name: body.name,
        })
      );
    } else {
      dispatch(checkingFinish());
    }
  };
};

export const checkingFinish = () => {
  return { type: types.authCheckingFinish };
};

export const login = (user) => {
  return {
    type: types.authLogin,
    payload: user,
  };
};

export const startLogout = () => {
  return async (dispatch) => {
    localStorage.clear();
    dispatch(logout());
  };
};

export const logout = () => {
  return {
    type: types.authLogout,
  };
};
