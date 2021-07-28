import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { Navbar } from "../ui/Navbar";
import { messages } from "../../helpers/calendar-messages-esp";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarModal } from "./CalendarModal";
import { AddNewFab } from "../ui/AddNewFab";
import { uiOpenModal } from "../../actions/ui";
import {
  eventClearActiveEvent,
  // eventDeleted,
  eventSetActive,
  eventStartLoading,
} from "../../actions/events";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import { DeleteEventFab } from "../ui/DeleteEventFab";

moment.locale("es");

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
  // traigo eventos del state
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const {uid} = useSelector(state => state.auth)

  // uso useState para llevar registro del estado de la última vista (y si no, utilizo 'month' por defecto)
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventStartLoading());
  }, [dispatch]);

  // método para el doble click en un evento
  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  };

  // método para el single click en un evento
  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e));
  };

  // método que registra el cambio de 'vista' en el calendar (si paso de día, semana, mes, agenda)
  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem("lastView", e);
  };

  // funcion getter del style, dada por BigCalendar
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: (uid === event.user._id) ? "#367CF7" : '#465660',
      borderRadius: "0px",
      opacity: 0.8,
      display: "block",
      color: "white",
    };

    return { style };
  };

  const onSelectedSlot = (e) => {
    dispatch(eventClearActiveEvent());
  };

  return (
    <div className="calendar-screen">
      <Navbar />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        // prop determinada para el style getter
        eventPropGetter={eventStyleGetter}
        // prop components para personalizar como se ve el evento reemplazando el default
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelectEvent}
        onView={onViewChange}
        // seteo la 'vista' predefinida para cada vez que recargo porque llevo registro de la última que ví (en el state)
        view={lastView}
        selectable={true}
        onSelectSlot={onSelectedSlot}
        onDoubleClick={onDoubleClick}
      />

      <AddNewFab />
      {activeEvent ? <DeleteEventFab /> : null}

      <CalendarModal />
    </div>
  );
};
