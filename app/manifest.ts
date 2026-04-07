import type { MetadataRoute } from "next";

// Web App Manifest — scoped to /studio (Gigasuede). The rest of jordanbailey.app
// is a normal site; only the studio is meant to be installed to the homescreen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gigasuede Studio",
    short_name: "Gigasuede",
    description: "A private content engine for one. Atlanta, GA.",
    id: "/studio",
    start_url: "/studio",
    scope: "/studio",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0d0206",
    theme_color: "#260610",
    icons: [
      {
        src: "/studio/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
