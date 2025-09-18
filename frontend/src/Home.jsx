import "./home.css";
import Container from "./Container";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [display, setDisplay] = useState();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [radius, setRadius] = useState(1);
  const [refLat, setRefLat] = useState(null);
  const [refLong, setRefLong] = useState(null);

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
      .then(() => {
        toast.success("Booking Confirmed");
      })
      .catch((err) => {
        console.error("Error posting booking:", err);
        toast.error("Error posting booking");
      });
  }

  function fetchHandler() {
    if (!startTime || !endTime) {
      toast.error("Enter time period");
      return;
    } else if (startTime >= endTime) {
      toast.error("Invalid Time Duration");
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
        setDataArray(data);
      })
      .catch((err) => console.log(err));
  }

  function logOutHandler() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <div className=" main_title">
        Available Parking Slots
        <br /> in {radius}km
      </div>

      <div className=" main_body my-4">
        <div className="row flex-column-reverse flex-md-row d-flex justify-content-center">
          {/* Left side - Parking slots */}
          <div className="col-md-8 ">
            <div className="row sub_body">
              {dataArray
                .filter((item) => item.distance <= radius)
                .map((item) => (
                  <div key={item.lot_id} className="col-md-6 mb-3">
                    <Container
                      dist={item.distance}
                      price={`Rs.${item.price}`}
                      loctn={item.area_name}
                      selected={selected === item.lot_id}
                      onClick={() => {
                        setSelected(item.lot_id);
                        setDisplay(item.area_name);
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Right side - Selection controls */}
          <div className="col-md-4 mb-4 selection_pane">
            <div className="mb-3">
              <label className="form-label">Start Time:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Time:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Radius:</label>
              <select
                value={radius}
                className="form-select"
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

            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-custom" onClick={fetchHandler}>
                Apply
              </button>
              <button className="btn btn-custom" onClick={submitHandler}>
                Continue
              </button>
              <button className="btn btn-custom" onClick={logOutHandler}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <ToastContainer theme="dark" />
      </div>
    </>
  );
};

export default Home;
