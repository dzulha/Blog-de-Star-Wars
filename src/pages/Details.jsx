// ======================= IMPORTACIONES =========
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRotatingImageSrc from "../utils/useRotatingImageSrc";
import { getWikiExtractByName } from "../utils/wikiExtract";

// =======================  =========
const ENDPOINTS = {
  people: "https://www.swapi.tech/api/people",
  planets: "https://www.swapi.tech/api/planets",
  vehicles: "https://www.swapi.tech/api/vehicles",
};

export default function Details() {
  // =======================  =========
  const { type, uid } = useParams();

  // =======================  =========
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [extract, setExtract] = useState("");

  useEffect(() => {
    let abort = false;
    setLoading(true);
    setError("");
    setData(null);
    setExtract("");

    (async () => {
      try {
        if (!ENDPOINTS[type]) throw new Error("Tipo no válido");
        const res = await fetch(`${ENDPOINTS[type]}/${uid}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!abort) setData(json.result);
      } catch (e) {
        console.error("Error cargando detalles:", e);
        if (!abort) setError("No se pudo cargar la información.");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => { abort = true; };
  }, [type, uid]);

  // =======================  =========
  const name =
    (data?.properties?.name || data?.properties?.title || "").toString();

  // =======================  =========
  const { src, onError } = useRotatingImageSrc(type, name, uid);

  // =======================  =========
  useEffect(() => {
    let abort = false;
    if (!name) return;

    (async () => {
      try {
        const txt = await getWikiExtractByName(name, type);
        if (!abort && txt) setExtract(txt);
      } catch {
      }
    })();

    return () => { abort = true; };
  }, [type, name]);

  // =======================  =========
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-warning" role="status" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error || "No hay datos para mostrar."}</div>
      </div>
    );
  }

  // =======================  =========
  const props = data.properties || {};

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {/* =======================  ========= Imagen grande */}
        <div className="col-12 col-lg-5">
          <img
            className="sw-detail-img"
            src={src}
            alt={name || "Item image"}
            onError={onError}
          />
        </div>

        {/* =======================  ========= Título  */}
        <div className="col-12 col-lg-7">
          <h2 className="text-light bg-dark p-3 rounded">
            {(name || "—").toUpperCase()}
          </h2>

          {/* =======================  ========= Descripción (Wikipedia) */}
          {extract && (
            <div className="bg-dark text-light p-3 rounded border border-secondary mb-3">
              <p className="mb-0" style={{ whiteSpace: "pre-line" }}>{extract}</p>
            </div>
          )}

          <div className="bg-dark text-light p-3 rounded border border-secondary">
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">

              {/* =======================  ========= PEOPLE */}
              {type === "people" && (
                <>
                  <Spec label="GENDER" value={props.gender} />
                  <Spec label="HEIGHT" value={props.height} />
                  <Spec label="MASS" value={props.mass} />
                  <Spec label="HAIR" value={props.hair_color} />
                  <Spec label="EYES" value={props.eye_color} />
                  <Spec label="BIRTH YEAR" value={props.birth_year} />
                </>
              )}

              {/* =======================  ========= PLANETS */}
              {type === "planets" && (
                <>
                  <Spec label="CLIMATE" value={props.climate} />
                  <Spec label="TERRAIN" value={props.terrain} />
                  <Spec label="POPULATION" value={props.population} />
                  <Spec label="DIAMETER" value={props.diameter} />
                  <Spec label="GRAVITY" value={props.gravity} />
                  <Spec label="ORBITAL PERIOD" value={props.orbital_period} />
                </>
              )}

              {/* =======================  =========  VEHICLES */}
              {type === "vehicles" && (
                <>
                  <Spec label="MODEL" value={props.model} />
                  <Spec label="MANUFACTURER" value={props.manufacturer} />
                  <Spec label="CREW" value={props.crew} />
                  <Spec label="PASSENGERS" value={props.passengers} />
                  <Spec label="MAX SPEED" value={props.max_atmosphering_speed} />
                  <Spec label="COST" value={props.cost_in_credits} />
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================  =========
function Spec({ label, value }) {
  return (
    <div className="col">
      <small className="text-secondary">{label}</small>
      <div className="fw-semibold">{value || "—"}</div>
    </div>
  );
}
