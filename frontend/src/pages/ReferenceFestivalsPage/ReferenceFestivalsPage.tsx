import React, { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import ReferenceNav from "../../components/ReferenceNav";
import {
  biblicalFestivals,
  traditionLabels,
  type FestivalTradition,
} from "../../data/biblicalFestivals";
import styles from "./ReferenceFestivalsPage.module.css";

type TraditionFilter = FestivalTradition | "all";

const filters: TraditionFilter[] = ["all", "jewish", "church"];

const ReferenceFestivalsPage: React.FC = () => {
  const [tradition, setTradition] = useState<TraditionFilter>("all");

  const filteredFestivals = useMemo(() => {
    if (tradition === "all") return biblicalFestivals;
    return biblicalFestivals.filter((festival) => festival.tradition === tradition);
  }, [tradition]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>절기 정보</h1>
          <p>성경 속 유대 절기와 교회 절기의 의미, 시기, 관련 구절을 정리합니다.</p>
        </div>
        <ReferenceNav />
      </header>

      <div className={styles.filters} aria-label="절기 분류">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === tradition ? styles.activeFilter : styles.filter}
            onClick={() => setTradition(filter)}
          >
            {traditionLabels[filter]}
          </button>
        ))}
      </div>

      <section className={styles.list} aria-label="절기 목록">
        {filteredFestivals.map((festival) => (
          <article key={festival.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.iconBox}>
                <CalendarDays size={22} />
              </span>
              <div>
                <h2>{festival.name}</h2>
                <span>{traditionLabels[festival.tradition]}</span>
              </div>
            </div>
            <dl>
              <div>
                <dt>시기</dt>
                <dd>{festival.season}</dd>
              </div>
              <div>
                <dt>관련 구절</dt>
                <dd>{festival.bibleRefs.join(", ")}</dd>
              </div>
            </dl>
            <p>{festival.summary}</p>
            <div className={styles.tags}>
              {festival.themes.map((theme) => (
                <span key={theme}>{theme}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ReferenceFestivalsPage;
