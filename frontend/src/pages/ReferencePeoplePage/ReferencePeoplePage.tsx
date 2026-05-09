import React, { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import ReferenceNav from "../../components/ReferenceNav";
import { biblicalPeople } from "../../data/biblicalPeople";
import styles from "./ReferencePeoplePage.module.css";

const normalize = (value: string) => value.trim().toLowerCase();

const ReferencePeoplePage: React.FC = () => {
  const [query, setQuery] = useState("");

  const filteredPeople = useMemo(() => {
    const normalizedQuery = normalize(query);

    return biblicalPeople.filter((person) => {
      if (!normalizedQuery) return true;

      return (
        normalize(person.name).includes(normalizedQuery) ||
        normalize(person.period).includes(normalizedQuery) ||
        normalize(person.role).includes(normalizedQuery) ||
        person.relatedPlaces.some((place) => normalize(place).includes(normalizedQuery))
      );
    });
  }, [query]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>인물 정보</h1>
          <p>성경 인물의 시대, 역할, 관련 장소와 주요 구절을 살펴봅니다.</p>
        </div>
        <ReferenceNav />
      </header>

      <label className={styles.searchBox}>
        <Search size={20} />
        <input
          type="search"
          placeholder="인물, 시대, 역할, 장소 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <section className={styles.grid} aria-label="성경 인물 목록">
        {filteredPeople.map((person) => (
          <article key={person.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.iconBox}>
                <UserRound size={22} />
              </span>
              <div>
                <h2>{person.name}</h2>
                <span>{person.period}</span>
              </div>
            </div>
            <dl className={styles.meta}>
              <div>
                <dt>역할</dt>
                <dd>{person.role}</dd>
              </div>
              <div>
                <dt>관련 장소</dt>
                <dd>{person.relatedPlaces.join(", ")}</dd>
              </div>
              <div>
                <dt>주요 구절</dt>
                <dd>{person.bibleRefs.join(", ")}</dd>
              </div>
            </dl>
            <p>{person.summary}</p>
          </article>
        ))}
      </section>

      {filteredPeople.length === 0 && (
        <p className={styles.empty}>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default ReferencePeoplePage;
