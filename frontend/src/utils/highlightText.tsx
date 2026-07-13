import React from 'react';

/**
 * 텍스트에서 검색어와 일치하는 부분을 <mark>로 감싸서 강조합니다.
 */
export const highlightText = (
  text: string,
  query: string
): React.ReactNode => {
  if (!query || query.trim().length === 0) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index}>{part}</mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};
