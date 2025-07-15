import { ClientHome } from "./ClientHome"; // Import nommé

export const metadata = {
  title: "Feelings – Generative Art",
  description:
    "Feelings is a generative art project coded in p5.js, transforming emotions into visible art.",
  openGraph: {
    title: "Feelings – Generative Art",
    description:
      "Born from a tough year, Feelings is a generative art project coded in p5.js. Create and share unique artworks.",
    images: [
      {
        url: "/image-feelings.png", // Image mise à jour ; assurez-vous qu'elle existe dans /public/
        width: 1200,
        height: 630,
        alt: "Feelings Generative Art",
      },
    ],
    url: "https://feelings-rho.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feelings – Generative Art",
    description:
      "Born from a tough year, Feelings is a generative art project coded in p5.js. Create and share unique artworks.",
    images: ["/image-feelings.png"], // Image mise à jour
  },
};

export default function Page() {
  return <ClientHome />;
}
