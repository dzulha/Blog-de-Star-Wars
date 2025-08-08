import { Link } from "react-router-dom";
import useRotatingImageSrc from "../utils/useRotatingImageSrc";

export default function ItemCard({ item, type, onFav }) {
  const { src, onError } = useRotatingImageSrc(type, item.name, item.uid);

  return (
    <div className="card h-100 bg-dark text-light border-secondary">
      <img
        className="sw-card-img"
        src={src}
        alt={item.name}
        loading="lazy"
        decoding="async"
        onError={onError}
      />
      <div className="card-body sw-card-body d-flex flex-column">
        <h5 className="card-title">{item.name}</h5>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/details/${type}/${item.uid}`} className="btn btn-primary">
            Learn more!
          </Link>
          <button className="btn btn-outline-warning ms-auto" onClick={onFav}>
            <i className="fa fa-heart" />
          </button>
        </div>
      </div>
    </div>
  );
}
