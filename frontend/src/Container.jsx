import "./container.css";
import videoBg from "./assets/gradient_bg.mp4";

const Container = ({ dist, price, loctn, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={`container-fluid row ${
        selected ? "container_main_body_selected" : "container_main_body_dark"
      }`}
    >
      {/* Video background only if selected */}
      {selected && (
        <video autoPlay muted loop className="bg-video" src={videoBg} />
      )}

      <div className="col-4 container_dist">{dist} km</div>
      <div className="col-8 container_details">
        <div className="container_price">{price}</div>
        <div className="container_location">{loctn}</div>
      </div>
    </div>
  );
};

export default Container;
