import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt =
  "Chism Chicken Ranch, Pasture-Raised Poultry in Marshall, Michigan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const bytes = await readFile(join(process.cwd(), "public/photos/pens.jpg"));
  const bg = `data:image/jpeg;base64,${bytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <img
          src={bg}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, rgba(26,23,18,0.94) 0%, rgba(26,23,18,0.72) 34%, rgba(26,23,18,0.32) 62%, rgba(26,23,18,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            width: "100%",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#E7C07E",
              fontSize: "25px",
              fontWeight: 700,
              letterSpacing: "5px",
              textTransform: "uppercase",
              marginBottom: "16px",
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}
          >
            Chism Chicken Ranch · Est. 2013
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#FBF6EA",
                fontSize: "80px",
                fontWeight: 700,
                lineHeight: 1.02,
                textShadow: "0 3px 20px rgba(0,0,0,0.75)",
              }}
            >
              Pasture-raised poultry,
            </div>
            <div
              style={{
                display: "flex",
                color: "#E7C07E",
                fontStyle: "italic",
                fontSize: "80px",
                fontWeight: 600,
                lineHeight: 1.1,
                textShadow: "0 3px 20px rgba(0,0,0,0.75)",
              }}
            >
              raised right.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "22px",
              color: "#EDE6D6",
              fontSize: "26px",
              textShadow: "0 2px 14px rgba(0,0,0,0.75)",
            }}
          >
            <span>Non-GMO fed</span>
            <span style={{ color: "#E7C07E" }}>·</span>
            <span>Humanely raised</span>
            <span style={{ color: "#E7C07E" }}>·</span>
            <span>Marshall, Michigan</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
