/* eslint-disable @next/next/no-img-element -- ImageResponse renders its own image markup. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Proximus Shev. John Amoako Appiah, developer and thoughtful builder.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/ps-logo.png"));
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", color: "#f4f8ff", background: "linear-gradient(125deg, #061321, #143f69)", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}><img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={90} height={90} style={{ objectFit: "contain" }} /><span style={{ fontSize: 30, fontWeight: 700 }}>PROXIMUS SHEV</span></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}><span style={{ fontSize: 28, color: "#6edcff" }}>John Amoako Appiah</span><span style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, maxWidth: 940 }}>Ideas into products people remember.</span></div>
    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid #6edcff66", fontSize: 23, color: "#c6daef" }}><span>Frontend. Full-stack. Thoughtful design.</span><span>Explore my work.</span></div>
  </div>, size);
}
