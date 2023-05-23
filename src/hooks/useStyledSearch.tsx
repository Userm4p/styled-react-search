import { useEffect, useMemo, useRef, useState, useCallback } from "react";

interface Props {
  resultBackgroundColor: string;
  resultTextColor: string;
  resultIndexBackgroundColor: string;
  resultIndexTextColor: string;
}

export const useStyledSearch = ({
  resultBackgroundColor,
  resultIndexBackgroundColor,
  resultIndexTextColor,
  resultTextColor,
}: Props) => {
  const container = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [resultIndex, setResultIndex] = useState(0);
  const [positions, setPositions] = useState<string[]>([]);

  const styleText = (text: string, i: number) => {
    if (search === "") return text;

    const searchText = search.replace(/[*+?$()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`(${searchText})`, "g");

    const split = text.split(regex);

    if (split.length === 1) return text;

    const result: string[] = [];

    for (let index = 0; index < split.length; index++) {
      const word = split[index];
      const id = `result-${i}-${index}`;
      const backgroundColor =
        positions[resultIndex] === id
          ? resultIndexBackgroundColor
          : resultBackgroundColor;
      const color =
        positions[resultIndex] === id ? resultIndexTextColor : resultTextColor;
      if (word !== search) {
        result.push(word);
        continue;
      }
      const styled = `<span id=${id} style="background-color:${backgroundColor}; color:${color}">${word}</span>`;
      result.push(styled);
    }
    return result.join("");
  };

  const handleGo = (position: number) => {
    const element = document.getElementById(positions[position]);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    setResultIndex(position);
  };

  const handleGoToNext = () => {
    handleGo(resultIndex + 1);
  };

  const handleGoToPrevious = () => {
    handleGo(resultIndex - 1);
  };

  const canGoToNext = useMemo(() => {
    return resultIndex < positions.length - 1;
  }, [resultIndex, positions.length]);

  const canGoToPrevious = useMemo(() => {
    return resultIndex > 0;
  }, [resultIndex]);

  const findChildrenIds = useCallback((children: HTMLCollection) => {
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      if (child.children.length > 0) findChildrenIds(child.children);

      if (child.id === "") continue;

      setPositions((prev) => [...prev, child.id]);
    }
  }, []);

  useEffect(() => {
    const containerRef = container.current;

    if (!containerRef) {
      return;
    }

    const children = containerRef.children;

    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const childChildren = child.children;
      findChildrenIds(childChildren);
    }

    return () => {
      containerRef?.scrollTo(0, 0);
      setPositions([]);
      setResultIndex(0);
    };
  }, [search, findChildrenIds]);

  return {
    search,
    container,
    positions,
    resultsLength: positions.length,
    resultIndex,
    canGoToNext,
    canGoToPrevious,
    styleText,
    setSearch,
    handleGoToNext,
    handleGoToPrevious,
  };
};
