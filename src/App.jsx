import { useState } from "react";
import "./App.css";

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const emptyEntry = () => ({
  date: getToday(),
  sunrise: "",
  sunset: "",
  dayTemperature: "",
  moonrise: "",
  moonset: "",
  nightTemperature: "",
});

function App() {
  const [screen, setScreen] = useState("home");

  const [entry, setEntry] = useState(emptyEntry());

  const [archive, setArchive] = useState(() => {
    const saved = localStorage.getItem("sunMoonArchive");

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const updateEntry = (field, value) => {
    setEntry((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveEntry = () => {
    const newArchive = [
      ...archive.filter((item) => item.date !== entry.date),
      entry,
    ];

    newArchive.sort((a, b) => b.date.localeCompare(a.date));

    localStorage.setItem(
      "sunMoonArchive",
      JSON.stringify(newArchive)
    );

    setArchive(newArchive);

    // Neuer leerer Eintrag
    setEntry(emptyEntry());

    alert("Eintrag gespeichert");
  };

  const openArchive = () => {
    setScreen("archive");
  };

  const openHome = () => {
    setScreen("home");
    setEntry(emptyEntry());
  };

  if (screen === "archive") {
    return (
      <div className="app">
        <div className="container">

          <div className="archive-header">
            <button
              className="back-button"
              onClick={openHome}
            >
              ←
            </button>

            <h1>ARCHIVE</h1>
          </div>

          {archive.length === 0 ? (
            <div className="empty-archive">
              NO ENTRIES YET
            </div>
          ) : (
            <div className="archive-list">
              {archive.map((item) => (
                <button
                  className="archive-item"
                  key={item.date}
                  onClick={() => {
                    setEntry(item);
                    setScreen("view");
                  }}
                >
                  {formatDate(item.date)}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    );
  }

  if (screen === "view") {
    return (
      <div className="app">
        <div className="container">

          <div className="archive-header">
            <button
              className="back-button"
              onClick={openArchive}
            >
              ←
            </button>

            <h1>{formatDate(entry.date)}</h1>
          </div>

          <div className="saved-field">
            <span>SUNRISE</span>
            <strong>{entry.sunrise || "—"}</strong>
          </div>

          <div className="saved-field">
            <span>SUNSET</span>
            <strong>{entry.sunset || "—"}</strong>
          </div>

          <div className="saved-field length-field">
            <span>LENGTH</span>
            <strong>
              {calculateLength(entry.sunrise, entry.sunset)}
            </strong>
          </div>

          <div className="saved-field">
            <span>DAYTIME TEMPERATURE</span>
            <strong>
              {entry.dayTemperature
                ? `${entry.dayTemperature}°`
                : "—"}
            </strong>
          </div>

          <div className="spacer"></div>

          <div className="saved-field">
            <span>MOONRISE</span>
            <strong>{entry.moonrise || "—"}</strong>
          </div>

          <div className="saved-field">
            <span>MOONSET</span>
            <strong>{entry.moonset || "—"}</strong>
          </div>

          <div className="saved-field length-field">
            <span>LENGTH</span>
            <strong>
              {calculateLength(entry.moonrise, entry.moonset)}
            </strong>
          </div>

          <div className="saved-field">
            <span>NIGHT TEMPERATURE</span>
            <strong>
              {entry.nightTemperature
                ? `${entry.nightTemperature}°`
                : "—"}
            </strong>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">

        {/* Datum */}
        <input
          className="date-input"
          type="date"
          value={entry.date}
          onChange={(e) =>
            updateEntry("date", e.target.value)
          }
        />

        <div className="spacer"></div>

        {/* SUNRISE */}
        <div className="input-wrapper">
          {!entry.sunrise && (
            <span className="input-placeholder">
              SUNRISE
            </span>
          )}

          <input
            type="time"
            value={entry.sunrise}
            onChange={(e) =>
              updateEntry("sunrise", e.target.value)
            }
          />
        </div>

        {/* SUNSET */}
        <div className="input-wrapper">
          {!entry.sunset && (
            <span className="input-placeholder">
              SUNSET
            </span>
          )}

          <input
            type="time"
            value={entry.sunset}
            onChange={(e) =>
              updateEntry("sunset", e.target.value)
            }
          />
        </div>

        {/* DAY TEMPERATURE */}
        <div className="temperature-wrapper">
          {!entry.dayTemperature && (
            <span className="input-placeholder">
              DAY TEMPERATURE
            </span>
          )}

          <input
            type="number"
            value={entry.dayTemperature}
            onChange={(e) =>
              updateEntry("dayTemperature", e.target.value)
            }
          />

          {entry.dayTemperature && (
            <span className="temperature-symbol">°</span>
          )}
        </div>

        <div className="spacer"></div>

        {/* MOONRISE */}
        <div className="input-wrapper">
          {!entry.moonrise && (
            <span className="input-placeholder">
              MOONRISE
            </span>
          )}

          <input
            type="time"
            value={entry.moonrise}
            onChange={(e) =>
              updateEntry("moonrise", e.target.value)
            }
          />
        </div>

        {/* MOONSET */}
        <div className="input-wrapper">
          {!entry.moonset && (
            <span className="input-placeholder">
              MOONSET
            </span>
          )}

          <input
            type="time"
            value={entry.moonset}
            onChange={(e) =>
              updateEntry("moonset", e.target.value)
            }
          />
        </div>

        {/* NIGHT TEMPERATURE */}
        <div className="temperature-wrapper">
          {!entry.nightTemperature && (
            <span className="input-placeholder">
              NIGHT TEMPERATURE
            </span>
          )}

          <input
            type="number"
            value={entry.nightTemperature}
            onChange={(e) =>
              updateEntry("nightTemperature", e.target.value)
            }
          />

          {entry.nightTemperature && (
            <span className="temperature-symbol">°</span>
          )}
        </div>

        <div className="spacer"></div>

        {/* BUTTONS */}
        <button
          className="save-button"
          onClick={saveEntry}
        >
          SAVE
        </button>

        <button
          className="archive-button"
          onClick={openArchive}
        >
          ARCHIVE
        </button>

      </div>
    </div>
  );
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
}

function calculateLength(start, end) {
  if (!start || !end) {
    return "—";
  }

  const [startHours, startMinutes] = start
    .split(":")
    .map(Number);

  const [endHours, endMinutes] = end
    .split(":")
    .map(Number);

  let startTotal = startHours * 60 + startMinutes;
  let endTotal = endHours * 60 + endMinutes;

  // Wenn die Endzeit am nächsten Tag liegt
  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  const difference = endTotal - startTotal;

  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
export default App;