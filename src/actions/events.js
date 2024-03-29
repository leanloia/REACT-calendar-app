import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    try {
      const resp = await fetchConToken("events", event, "POST");
      const body = await resp.json();
      const { uid, name } = getState().auth;

      if (body.ok) {
        event.id = body.event.id;
        event.user = {
          _id: uid,
          name,
        };
        dispatch(eventAddNew(event));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

const eventAddNew = (event) => {
  return {
    type: types.eventAddNew,
    payload: event,
  };
};

export const eventSetActive = (event) => {
  return {
    type: types.eventSetActive,
    payload: event,
  };
};

export const eventClearActiveEvent = () => {
  return {
    type: types.eventClearActiveEvent,
  };
};

export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken(`events/${event._id}`, event, "PUT");
      const body = await resp.json();

      if (body.ok) {
        dispatch(eventUpdated(event));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
};

const eventUpdated = (event) => {
  return {
    type: types.eventUpdated,
    payload: event,
  };
};

export const startEventDeleted = (event) => {
  return async (dispatch, getState) => {
    const { _id } = getState().calendar.activeEvent;
    try {
      const resp = await fetchConToken(`events/${_id}`, {}, "DELETE");
      const body = await resp.json();

      if (body.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
};

const eventDeleted = () => {
  return {
    type: types.eventDeleted,
  };
};

export const eventStartLoading = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken("events");
      const body = await resp.json();

      const events = prepareEvents(body.eventos);
      // console.log(events);
      dispatch(eventLoaded(events));
    } catch (error) {
      console.error(error);
    }
  };
};

const eventLoaded = (events) => {
  return {
    type: types.eventLoaded,
    payload: events,
  };
};
