import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  biblicalPlaces,
  categoryLabels,
  confidenceLabels,
  type BiblicalPlace,
  type BiblicalPlaceCategory,
} from "../../data/biblicalPlaces";
import ReferenceNav from "../../components/ReferenceNav";
import styles from "./MapPage.module.css";

type CategoryFilter = BiblicalPlaceCategory | "all";

const markerIcon = L.divIcon({
  className: styles.marker,
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

const categories: CategoryFilter[] = [
  "all",
  "city",
  "mountain",
  "water",
  "region",
  "wilderness",
];

interface MapFocusProps {
  place: BiblicalPlace;
}

const MapFocus: React.FC<MapFocusProps> = ({ place }) => {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(place.coordinates, 8, { duration: 0.7 });
  }, [map, place]);

  return null;
};

const normalize = (value: string) => value.trim().toLowerCase();

const MapPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selectedPlaceId, setSelectedPlaceId] = useState(biblicalPlaces[0].id);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = normalize(query);

    return biblicalPlaces.filter((place) => {
      const matchesCategory = category === "all" || place.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        normalize(place.biblicalName).includes(normalizedQuery) ||
        normalize(place.modernName).includes(normalizedQuery) ||
        normalize(place.region).includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const selectedPlace =
    filteredPlaces.find((place) => place.id === selectedPlaceId) ??
    filteredPlaces[0] ??
    biblicalPlaces.find((place) => place.id === selectedPlaceId) ??
    biblicalPlaces[0];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>지도맵</h1>
          <p>성경 속 지명을 기준으로 오늘날 부르는 지명과 위치를 함께 봅니다.</p>
        </div>
        <div className={styles.stats}>
          <strong>{filteredPlaces.length}</strong>
          <span>지명</span>
        </div>
      </header>

      <ReferenceNav />

      <section className={styles.toolbar} aria-label="지도맵 필터">
        <input
          className={styles.searchInput}
          type="search"
          placeholder="성경 지명, 오늘날 지명, 지역 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.filters}>
          {categories.map((item) => (
            <button
              key={item}
              className={item === category ? styles.activeFilter : styles.filter}
              type="button"
              onClick={() => setCategory(item)}
            >
              {categoryLabels[item]}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.mapWorkspace}>
        <aside className={styles.placeList} aria-label="성경 속 지명 목록">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <button
                key={place.id}
                className={place.id === selectedPlace.id ? styles.activePlace : styles.placeButton}
                type="button"
                onClick={() => setSelectedPlaceId(place.id)}
              >
                <span className={styles.placeName}>{place.biblicalName}</span>
                <span className={styles.modernName}>{place.modernName}</span>
              </button>
            ))
          ) : (
            <p className={styles.empty}>검색 결과가 없습니다.</p>
          )}
        </aside>

        <div className={styles.mapPanel}>
          <MapContainer
            center={selectedPlace.coordinates}
            zoom={7}
            scrollWheelZoom
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFocus place={selectedPlace} />
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={place.coordinates}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelectedPlaceId(place.id),
                }}
              >
                <Popup>
                  <div className={styles.popup}>
                    <strong>{place.biblicalName}</strong>
                    <span>{place.modernName}</span>
                    <small>{place.bibleRefs.join(", ")}</small>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <article className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <span className={styles.categoryBadge}>{categoryLabels[selectedPlace.category]}</span>
            <span className={styles.confidence}>{confidenceLabels[selectedPlace.confidence]}</span>
          </div>
          <h2>{selectedPlace.biblicalName}</h2>
          <dl>
            <div>
              <dt>오늘날 지명</dt>
              <dd>{selectedPlace.modernName}</dd>
            </div>
            <div>
              <dt>지역</dt>
              <dd>{selectedPlace.region}</dd>
            </div>
            <div>
              <dt>관련 구절</dt>
              <dd>{selectedPlace.bibleRefs.join(", ")}</dd>
            </div>
          </dl>
          <p>{selectedPlace.description}</p>
        </article>
      </section>
    </div>
  );
};

export default MapPage;
