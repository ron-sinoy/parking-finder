import "./container_booked.css";

const ContainerBooked = ({ dist, price, loctn, start_time, duration }) => {
  return (
    <div className="container_main_body_booked">
      <div className="container_location_booked">
        {" "}
        <div className="labels">location</div>
        {loctn}
      </div>
      <div className="row">
        <div className="col">
          <div className="container_distance_booked ">
            <div className="labels">distance</div>
            {dist} km
          </div>
          <div className="labels">start time</div>
          {start_time}
        </div>
        <div className="col">
          <div className="container_duration_booked">
            <div className="labels">duration</div>
            {duration}
          </div>
          <div className="container_price_booked ">
            <div className="labels">price</div>
            Rs{price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerBooked;
