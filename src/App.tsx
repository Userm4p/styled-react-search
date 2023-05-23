import { useStyledSearch } from "./hooks/useStyledSearch";
import { ArrowDown, ArrowUp } from "phosphor-react";
import { mockData } from "./mocks";
import "./App.css";
import { Input } from "./components/Input";

export default function App() {
  const {
    container,
    resultIndex,
    canGoToNext,
    resultsLength,
    canGoToPrevious,
    setSearch,
    handleGoToNext,
    handleGoToPrevious,
    styleText,
  } = useStyledSearch({
    resultBackgroundColor: "#f5f5f5",
    resultTextColor: "#000000",
    resultIndexBackgroundColor: "#fbff00",
    resultIndexTextColor: "#000000",
  });

  return (
    <div className="Container">
      <h1 className="Title">Styled Search</h1>
      <Input setSearch={setSearch} />
      <div className="Buttons_container">
        {resultIndex + 1} of {resultsLength}
        <button onClick={handleGoToPrevious} disabled={!canGoToPrevious}>
          <ArrowUp color="black" />
        </button>
        <button onClick={handleGoToNext} disabled={!canGoToNext}>
          <ArrowDown color="black" />
        </button>
      </div>
      <div className="Logs_container" ref={container}>
        {mockData.map((log, index) => {
          return (
            <div
              dangerouslySetInnerHTML={{
                __html: styleText(`${log.timestamp} - ${log.message}`, index),
              }}
              key={index}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
