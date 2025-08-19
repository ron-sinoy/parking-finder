import "./Container.css";

const Container = ({ dist, price, loctn, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="container-fluid row border border-primary"
    >
      <div className="col-4">{dist}</div>
      <div className="col-8">
        <div>{price}</div>
        <div>{loctn}</div>
      </div>
    </div>
  );
};

export default Container;
