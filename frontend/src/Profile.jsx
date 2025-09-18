import { useState, useEffect } from "react";
import ContainerBooked from "./ContainerBooked";
import "./profile.css";
import { useNavigate, Link } from "react-router-dom";
const Profile = () => {
  const [booked, setBooked] = useState([]);
  const user_id = localStorage.getItem("user_id");

  // distance calculator
  const distanceCalc = (refLat, refLong, lat, long) => {
    const dLat = lat - refLat;
    const dLong = long - refLong;
    const avgLat = (refLat + lat) / 2;
    let res = Math.sqrt(
      Math.pow(dLat * 111, 2) +
        Math.pow(dLong * 111 * Math.cos((avgLat * Math.PI) / 180), 2)
    );
    return Math.ceil(res * 100) / 100;
  };

  // duration calculator
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (diffMs <= 0) return "0 mins";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(diffMins / (60 * 24));
    const hours = Math.floor((diffMins % (60 * 24)) / 60);
    const mins = diffMins % 60;

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (mins > 0) result += `${mins}m`;

    return result.trim();
  };

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/profile?user_id=${user_id}`
        );
        const data = await res.json();
        console.log(data);
        setBooked(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (user_id) {
      fetchHandler();
    }
  }, [user_id]);

  // get user location once
  const [refLat, setRefLat] = useState(null);
  const [refLong, setRefLong] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setRefLat(pos.coords.latitude);
          setRefLong(pos.coords.longitude);
        },
        (err) => console.error("Error getting location:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);
  const navigate = useNavigate();
  function logOutHandler() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="row container-fluid">
      <div className="profile_title col">
        Hello {user_id}{" "}
        <div className="subtitle"> These are your current bookings->-></div>
        <Link to="/">
          <button className="profile-logout">Home</button>
        </Link>
        <button className="profile-logout" onClick={logOutHandler}>
          Logout
        </button>
      </div>
      <div className="main_body_profile col">
        <div className="booked_lots">
          {booked.length > 0 ? (
            booked.map((item) => (
              <ContainerBooked
                key={item.public_code}
                loctn={item.area_name}
                price={item.price}
                dist={
                  refLat && refLong
                    ? distanceCalc(
                        refLat,
                        refLong,
                        item.location_lat,
                        item.location_long
                      )
                    : "Locating..."
                }
                duration={calculateDuration(item.start_time, item.end_time)}
                start_time={new Date(item.start_time).toLocaleString()}
              />
            ))
          ) : (
            <p>No bookings found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
