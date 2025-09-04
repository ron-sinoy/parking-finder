import { useState, useEffect } from "react";
import Container from "./Container";

const Profile = () => {
  const [booked, setBooked] = useState([]);
  const user_id = localStorage.getItem("user_id");

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

  return (
    <div>
      <div className="profile_title">Hello {user_id}</div>
      <div className="booked_lots">
        {booked.length > 0 ? (
          booked.map((item) => (
            <Container
              key={item.public_code}
              loctn={item.area_name}
              dist={new Date(item.start_time).toLocaleString()}
              price={new Date(item.end_time).toLocaleString()}
            />
          ))
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
