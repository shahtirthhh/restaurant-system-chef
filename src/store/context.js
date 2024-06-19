import React, { useState } from "react";

export const Context = React.createContext({
  socket: null,
  setSocket: (socket) => {},

  notification: { color: null, data: null },
  setNotification: ({ visible, color, data, loading = false }) => {},
});
// eslint-disable-next-line
export default (props) => {
  const [socketValue, setSocketValue] = useState(null);

  const [notificationValue, setNotificationValue] = useState({
    color: "null",
    data: "null",
    visible: false,
    loading: false,
  });
  return (
    <Context.Provider
      value={{
        socket: socketValue,
        notification: notificationValue,

        setSocket: setSocketValue,
        setNotification: setNotificationValue,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
