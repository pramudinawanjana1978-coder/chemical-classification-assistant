import { useEffect, useRef, useState } from "react";
import { SearchIcon, MicIcon, CloseIcon } from "./Icons.jsx";
import NoticeCard from "./NoticeCard.jsx";

const EXAMPLES = ["Copper sulphate", "Sodium metal", "Oxalate", "Hydrochloric acid"];

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined;

function describeSpeechError(code) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission was denied. Allow microphone access in your browser settings and try again.";
    case "audio-capture":
      return "No microphone was found. Connect a microphone and try again.";
    case "no-speech":
      return "No speech was detected. Please try again.";
    case "network":
      return "A network error interrupted speech recognition.";
    default:
      return "Speech recognition failed. Please try again.";
  }
}

export default function SearchPanel({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [localNotice, setLocalNotice] = useState(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  // Single entry point used by typing (button / Enter / examples) AND voice.
  const submit = (text) => {
    const cleaned = (text ?? "").trim();
    if (!cleaned) {
      setLocalNotice({ title: "Empty input", text: "Please enter a chemical name before searching." });
      return;
    }
    setLocalNotice(null);
    onSearch(cleaned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(query);
  };

  const handleClear = () => {
    setQuery("");
    setLocalNotice(null);
    inputRef.current?.focus();
  };

  const startListening = () => {
    if (!SpeechRecognitionAPI) {
      setLocalNotice({
        title: "Voice unavailable",
        text: "Voice recognition is not supported by this browser.",
      });
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    setLocalNotice(null);
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      setLocalNotice({ title: "Speech recognition error", text: describeSpeechError(event.error) });
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setQuery(transcript);
        submit(transcript);
      }
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setLocalNotice({
        title: "Microphone unavailable",
        text: "Could not start the microphone. Please try again.",
      });
    }
  };

  return (
    <section className="glass card search-card">
      <h1 className="section-title">Search Chemical</h1>
      <p className="section-sub">Type a chemical name or use your microphone</p>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className={`search-input-wrap ${listening ? "is-listening" : ""}`}>
          <span className="search-input-icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Enter chemical name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            aria-label="Chemical name"
          />
          {query && (
            <button type="button" className="icon-btn clear-btn" onClick={handleClear} aria-label="Clear input">
              <CloseIcon />
            </button>
          )}
        </div>

        <div className="search-actions">
          <button
            type="button"
            className={`mic-btn ${listening ? "listening" : ""}`}
            onClick={startListening}
            aria-label={listening ? "Stop listening" : "Search by voice"}
            aria-pressed={listening}
            disabled={loading}
          >
            <MicIcon size={22} />
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            <SearchIcon size={18} />
            Search
          </button>
        </div>
      </form>

      {listening && (
        <p className="listening-text" role="status">
          <span className="pulse-dot" /> Listening...
        </p>
      )}

      <p className="examples">
        <span>Try:</span>{" "}
        {EXAMPLES.map((ex, i) => (
          <span key={ex}>
            <button
              type="button"
              className="example-chip"
              onClick={() => {
                setQuery(ex);
                inputRef.current?.focus();
              }}
            >
              {ex}
            </button>
            {i < EXAMPLES.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      {localNotice && (
        <NoticeCard type="error" title={localNotice.title} onClose={() => setLocalNotice(null)}>
          {localNotice.text}
        </NoticeCard>
      )}
    </section>
  );
}
