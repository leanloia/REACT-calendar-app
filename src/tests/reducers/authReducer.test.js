import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";

import { checkingFinish, login, logout, startLogin } from "../../actions/auth";
import { authReducer } from "../../reducers/authReducer";
// import { types } from "../../types/types";

const initState = {
  checking: true,
};

describe("Pruebas en authReducer", () => {
  test("debe devolver el state inicial", () => {
    const state = authReducer(initState, {});
    expect(state).toEqual(initState);
  });

  test("login debe devolver el state correcto", async () => {
    const log = await login({
      uid: "algo",
      name: "otro algo",
    });
    const state = authReducer(initState, log);

    expect(state).toEqual({
      checking: false,
      uid: "algo",
      name: "otro algo",
    });
  });

  test("debe devolver el estado correcto al logout", async () => {
    const log = await login({
      uid: "9122018",
      name: "lean",
    });

    const logoutAction = logout();

    const state = authReducer(initState, log);
    const logOutState = authReducer(state, logoutAction);

    expect(logOutState).toEqual({
      checking: false,
    });
  });

  test("debe cambiar el valor del checking al terminar", () => {
    const finishCheck = checkingFinish();
    const state = authReducer(initState, finishCheck);

    expect(state).toEqual({
      checking: false,
    });
  });
});
