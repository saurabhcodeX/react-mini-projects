import { useState } from "react";

const COLORS = [
  { name: "red",      dark: true  },
  { name: "green",    dark: true  },
  { name: "blue",     dark: true  },
  { name: "olive",    dark: true  },
  { name: "gray",     dark: true  },
  { name: "yellow",   dark: false },
  { name: "pink",     dark: true  },
  { name: "purple",   dark: true  },
  { name: "lavender", dark: false },
  { name: "white",    dark: false },
  { name: "black",    dark: true  },
];

export default function App() {
  const [bgColor, setBgColor] = useState("black");

  return (
    <div
      className="w-full h-screen duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="fixed inset-x-0 bottom-12 flex justify-center px-2">
        <div className="flex flex-wrap justify-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg">
          {COLORS.map(({ name, dark }) => (
            <button
              key={name}
              onClick={() => setBgColor(name)}
              className="rounded-full px-4 py-1 shadow-lg outline-none capitalize transition-transform hover:scale-110 active:scale-95"
              style={{
                backgroundColor: name,
                color: dark ? "white" : "black",
                outline: bgColor === name ? "2px solid rgba(0,0,0,0.4)" : "none",
                outlineOffset: "2px",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}