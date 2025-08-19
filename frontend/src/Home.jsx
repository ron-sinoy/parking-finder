import "./Home.css";
import Container from "./Container";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [leftArray, setLeftArray] = useState([]);
  const [rightArray, setRightArray] = useState([]);
  const [display, setDisplay] = useState();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [radius, setRadius] = useState(1);
  const [refLat, setRefLat] = useState(null);
  const [refLong, setRefLong] = useState(null);

  // Get live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRefLat(position.coords.latitude);
          setRefLong(position.coords.longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          toast.error("Unable to get your location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  function formatDateTime(input) {
    if (!input) return "";
    const [date, time] = input.split("T");
    return `${date} ${time}:00`;
  }

  function submitHandler() {
    const payload = {
      lot_id: selected,
      user_id: "U0000010",
      start_time: formatDateTime(startTime),
      end_time: formatDateTime(endTime),
      booking_status: "confirmed",
    };

    fetch("http://localhost:3000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Booking Confirmed");
      })
      .catch((err) => {
        console.error("Error posting booking:", err);
        toast.error("Error posting booking");
      });
  }

  function fetchHandler() {
    if (!startTime || !endTime) {
      toast.error(`Enter time period`);
      return;
    } else if (startTime >= endTime) {
      toast.error(`Invalid Time Duration`);
      return;
    }

    if (refLat === null || refLong === null) {
      toast.error("Location not available yet");
      return;
    }

    fetch(
      `http://localhost:3000/home?refLat=${refLat}&refLong=${refLong}&strt=${startTime}&end=${endTime}`
    )
      .then((response) => response.json())
      .then((data) => {
        const mid = Math.ceil(data.length / 2);
        setLeftArray(data.slice(0, mid));
        setRightArray(data.slice(mid));
      })
      .catch((err) => console.log(err));
  }

  function logOutHandler() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="container-fluid row border border-warning">
      <div className="container-fluid col-9 border border-primary">
        <div className="row">
          <div className="container-fluid col">
            {leftArray
              .filter((item) => item.distance <= radius)
              .map((item) => (
                <Container
                  key={item.lot_id}
                  dist={item.distance}
                  price={`Rs.${item.price}`}
                  loctn={item.area_name}
                  onClick={() => {
                    setSelected(item.lot_id);
                    setDisplay(item.area_name);
                  }}
                />
              ))}
          </div>
          <div className="container-fluid col">
            {rightArray
              .filter((item) => item.distance <= radius)
              .map((item) => (
                <Container
                  key={item.lot_id}
                  dist={item.distance}
                  price={`Rs.${item.price}`}
                  loctn={item.area_name}
                  onClick={() => {
                    setSelected(item.lot_id);
                    setDisplay(item.area_name);
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="container-fluid col-3">
        {display ? `Near ${display}` : ""}

        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div>
          <label>Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
          >
            <option value="1">1km</option>
            <option value="3">3km</option>
            <option value="5">5km</option>
            <option value="10">10km</option>
            <option value="20">20km</option>
            <option value="30">30km</option>
            <option value="50">50km</option>
          </select>
        </div>

        <button onClick={fetchHandler}>Apply</button>
        <button onClick={submitHandler}>Continue</button>
      </div>
      <button onClick={logOutHandler}>LogOut</button>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Home;
