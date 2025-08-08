// ======================= IMPORTACIONES =========
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRotatingImageSrc from "../utils/useRotatingImageSrc";
import { getWikiExtractByName } from "../utils/wikiExtract";

// ======================= comentario =========
// Endpoints de SWAPI.tech por tipo
const ENDPOINTS = {
  people: "https://www.swapi.tech/api/people",
  planets: "https://www.swapi.tech/api/planets",
  vehicles: "https://www.swapi.tech/api/vehicles",
};

export default function Details() {
  // ======================= comentario =========
  // Params de la ruta: /details/:type/:uid
  const { type, uid } = useParams();

  // ======================= comentario =========
  // Estado de datos y UI
  const [data, setData] = useState(null);     // respuesta cruda de SWAPI (result)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");     // mensaje de error opcional
  const [extract, setExtract] = useState(""); // descripción de Wikipedia

  // ======================= comentario =========
  // Fetch de detalles (seguro, con abort y manejo de errores)
  useEffect(() => {
    let abort = false;
    setLoading(true);
    setError("");
    setData(null);
    setExtract(""); // limpiamos la descripción al cambiar de item

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

  // ======================= comentario =========
  // Derivamos el nombre una vez que hay datos (people.name o films.title)
  const name =
    (data?.properties?.name || data?.properties?.title || "").toString();

  // ======================= comentario =========
  // Imagen a partir de (type, name, uid); usa placeholder si falla
  const { src, onError } = useRotatingImageSrc(type, name, uid);

  // ======================= comentario =========
  // Cargar extracto de Wikipedia (1-3 líneas) cuando ya tenemos el nombre
  useEffect(() => {
    let abort = false;
    if (!name) return;

    (async () => {
      try {
        const txt = await getWikiExtractByName(name, type);
        if (!abort && txt) setExtract(txt);
      } catch {
        /* si falla, simplemente no mostramos extracto */
      }
    })();

    return () => { abort = true; };
  }, [type, name]);

  // ======================= comentario =========
  // Estados de carga / error
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

  // ======================= comentario =========
  // Render principal
  const props = data.properties || {};

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {/* ======================= comentario ========= Imagen grande (col izquierda) */}
        <div className="col-12 col-lg-5">
          <img
            className="sw-detail-img"   // <-- define estilos en styles.css
            src={src}
            alt={name || "Item image"}
            onError={onError}
          />
        </div>

        {/* ======================= comentario ========= Título + descripción + specs (col derecha) */}
        <div className="col-12 col-lg-7">
          <h2 className="text-light bg-dark p-3 rounded">
            {(name || "—").toUpperCase()}
          </h2>

          {/* ======================= comentario ========= Descripción (Wikipedia) si existe */}
          {extract && (
            <div className="bg-dark text-light p-3 rounded border border-secondary mb-3">
              <p className="mb-0" style={{ whiteSpace: "pre-line" }}>{extract}</p>
            </div>
          )}

          <div className="bg-dark text-light p-3 rounded border border-secondary">
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">

              {/* ======================= comentario ========= Campos: PEOPLE */}
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

              {/* ======================= comentario ========= Campos: PLANETS */}
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

              {/* ======================= comentario ========= Campos: VEHICLES */}
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

// ======================= comentario =========
// Celda de especificación reusable
function Spec({ label, value }) {
  return (
    <div className="col">
      <small className="text-secondary">{label}</small>
      <div className="fw-semibold">{value || "—"}</div>
    </div>
  );
}
