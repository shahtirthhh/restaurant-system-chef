import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/context";
import Modal from "../components/Modal";

import no_orders from "../assets/no_orders.gif";
import spinner_orders from "../assets/spinner_orders.gif";
import error_image from "../assets/error.png";
import next from "../assets/next.png";
import previous from "../assets/previous.png";

const LiveOrder = () => {
  const socketContext = useContext(Context).socket;
  const setNotificationContext = useContext(Context).setNotification;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [liveOrders, setLiveOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});

  const fetch_latest_orders = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/chef-orders",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setLiveOrders(jsonData.orders);
      const groupedOrders = jsonData.orders.reduce((acc, order) => {
        if (!acc[order.tableNumber]) {
          acc[order.tableNumber] = [];
        }
        acc[order.tableNumber].push(order);
        return acc;
      }, {});
      setGroupedOrders(groupedOrders);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleOrderCancellation = (_id) => {
    setNotificationContext({
      visible: true,
      color: "red",
      data: `Order number: ${_id} has been canceled!`,
    });
    fetch_latest_orders();
  };

  useEffect(() => {
    socketContext?.on("check_for_order_cancellation", handleOrderCancellation);
    socketContext?.on("update_orders", () => {
      setNotificationContext({
        visible: true,
        color: "yellow",
        data: "📦 New order has been placed !",
      });
      fetch_latest_orders();
    });

    return () => {
      socketContext?.off(
        "check_for_order_cancellation",
        handleOrderCancellation
      );
    };
  }, [socketContext, setNotificationContext]);

  useEffect(() => {
    fetch_latest_orders();
  }, []);

  return (
    <div className="overflow-y-auto justify-center custom_scrollbar h-auto bg-secondary p-5 w-full flex flex-col  gap-2 ">
      {loading && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img
            className="w-24 h-24"
            src={spinner_orders}
            alt="loading_orders"
          />
          <span className="font-primary text-neutral-600  font-semibold text-2xl ">
            Getting latest orders ...
          </span>
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img className="w-28 h-28" src={error_image} alt="error" />
          <span className="font-primary text-red-500  font-semibold text-2xl ">
            An error occured !
          </span>
        </div>
      )}
      {!loading && liveOrders.length < 1 && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img className="w-36" src={no_orders} alt="error" />
          <span className="font-primary text-neutral-700  font-semibold text-2xl ">
            Waiting for new orders...
          </span>
        </div>
      )}
      {liveOrders.length > 0 && (
        <div className="flex flex-wrap gap-16 justify-evenly ">
          {Object.keys(groupedOrders).map((tableNumber) => (
            <div
              key={tableNumber}
              className=" bg-[#e3e3e3] rounded-xl shadow-lg p-3  w-full"
            >
              <Card
                fetch_orders={fetch_latest_orders}
                key={tableNumber}
                orders={groupedOrders[tableNumber]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ orders, fetch_orders }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const setNotificationContext = useContext(Context).setNotification;
  const socketContext = useContext(Context).socket;

  const nextOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + orders.length) % orders.length
    );
  };

  const [marking, setMarking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const set_order_as_served = async () => {
    setMarking(true);
    setIsModalOpen(false);
    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/mark_as_served",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({ _id: activeOrderId }),
        }
      );
      setMarking(false);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.marked) {
        socketContext.emit("order_marked_as_served", activeOrderId);
        fetch_orders();
      } else {
        setNotificationContext({
          visible: true,
          color: "red",
          data: jsonData.message,
        });
      }
    } catch (error) {
      setNotificationContext({
        visible: true,
        color: "red",
        data: "Operation failed !",
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setActiveOrderId(null);
    setMarking(false);
  };

  return (
    orders[currentIndex] && (
      <div className="flex md:flex-row flex-col gap-3 items-center h-full">
        <div className="flex gap-3 bg-secondary p-2 md:w-[10%] w-full h-full rounded-lg justify-center  items-center">
          <h2 className="sm:text-7xl text-3xl px-5 font-primary text-neutral-700 font-semibold ">
            {orders[currentIndex].tableNumber}
          </h2>
        </div>
        <div className="flex flex-col w-full h-full ">
          <div className="flex items-center justify-between ">
            {orders.length > 1 && (
              <button
                onClick={prevOrder}
                className="hover:scale-[1.05] transition-all"
              >
                <img
                  className="sm:w-14 w-8 sm:h-14 h-8"
                  src={previous}
                  alt=""
                />
              </button>
            )}
            <h2 className="sm:text-5xl text-xl px-5 font-primary text-neutral-700 font-semibold bg-secondary mx-3 p-2 rounded-xl w-full text-center">
              Order no: {orders[currentIndex]._id}
            </h2>

            {orders[currentIndex].canceled && (
              <span className="text-center font-primary font-semibold text-md text-red-500 ">
                Order canceled
              </span>
            )}

            {orders.length > 1 && (
              <button
                onClick={nextOrder}
                className="hover:scale-[1.05] transition-all"
              >
                <img className="sm:w-14 w-8 sm:h-14 h-8" src={next} alt="" />
              </button>
            )}
          </div>

          <table className=" flex flex-wrap gap-4 p-3 justify-center items-center">
            {orders[currentIndex].items.map((item) => {
              return (
                <tr className="shadow-lg px-10 py-2 bg-secondary rounded-xl">
                  <td className="font-primary sm:text-3xl text-lg tracking-wide  text-neutral-500 ">
                    {item.name}
                  </td>
                  <td className="pl-2 font-primary sm:text-3xl text-lg tracking-wide  text-neutral-500 ">
                    x{item.quantity}
                  </td>
                </tr>
              );
            })}
            <tr>
              <button
                disabled={marking}
                onClick={() => {
                  setMarking(true);
                  setActiveOrderId(orders[currentIndex]._id);
                  setIsModalOpen(true);
                }}
                className="disabled:bg-slate-400 px-4 py-2 font-primary sm:text-3xl text-lg text-neutral-700 font-semibold transition-all rounded-lg bg-green-400 hover:bg-green-600"
              >
                {orders[currentIndex]._id === activeOrderId && marking
                  ? "Serving..."
                  : "Serve"}
              </button>
            </tr>
          </table>
        </div>
        <Modal
          isOpen={isModalOpen}
          activeOrderId={activeOrderId}
          title={`Serve order: ${activeOrderId} ?`}
          type={"confirm"}
          message={"Are you sure to serve the order ?"}
          confirmText={"🍴 Serve order"}
          cancelText={"No"}
          onConfirm={set_order_as_served}
          onCancel={handleCancel}
        />
      </div>
    )
  );
};
export default LiveOrder;
