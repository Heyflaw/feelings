// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount, useDisconnect } from "wagmi";

// 1) Import dynamique de l’iframe (pas de SSR)
const GenerativeSketchIframe = dynamic(
  () => import("@/components/GenerativeSketchIframe"),
  { ssr: false }
);

export default function HomePage() {
  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const { login } = useLoginWithAbstract();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [joinRequested, setJoinRequested] = useState(false);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isConnected && address && joinRequested && !joined) {
      fetch("/api/join-whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
        .then(async (res) => {
          if (res.ok) {
            setMessage(
              `✅ You’re all set! You’ve been added to the whitelist. !\nAddress : ${address}`
            );
            setJoined(true);
          } else {
            const err = await res.text();
            setMessage(`❌ Erreur : ${err}`);
          }
        })
        .catch(() => {
          setMessage("❌ Erreur réseau.");
        })
        .finally(() => {
          setJoinRequested(false);
        });
    }
  }, [isConnected, address, joinRequested, joined]);

  const handleJoinClick = () => {
    setJoinRequested(true);
    if (!isConnected) {
      login();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setJoined(false);
    setMessage("");
  };

  return (
    <main className="desktop-1">
      <header className="hero__header">
        <div className="hero__title">FEELINGS</div>
      </header>

      <div className="content">
        <div className="left-content">
          <div className="hero__content">
            {/* 1. Intro-text */}
            <div className="intro-text">
              <div className="intro-titre">A story of resilience.</div>
              <div className="text-feeling">
                Born from a tough year, <b>Feelings</b> is a generative art
                project coded in p5.js. It’s about bringing emotions, both the
                good and the bad, to life, transforming them into something
                visible. It’s a story of constraints, opportunities, paths, a
                journey through trials, a story of resilience that shapes us.
                Hit "Generate" to discover a new one.
              </div>
              <div className="mint-info">
                <p>
                  <strong>Mint price:</strong> FREE
                </p>
                <p>
                  <strong>Supply:</strong> TBD
                </p>
                <p>
                  <strong>Date:</strong> TBD
                </p>
              </div>

              <div className="button">
                <div
                  className="generate-btn"
                  onClick={() => setRegenerateTrigger((t) => t + 1)}
                >
                  Generate
                </div>
              </div>
            </div>

            {/* 2. Whitelist section */}
            <div className="wl-content">
              <div className="frame-10">
                <div className="wl-titre">Join the whitelist.</div>
                <div className="wl-text">
                  Connect your wallet to secure your spot and be part of the
                  drop.👇
                </div>
              </div>

              {!joined ? (
                <div className="button" onClick={handleJoinClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 60 50"
                    className="button__icon"
                    aria-hidden="true"
                  >
                    <path d="M33.7221 31.0658L43.997 41.3463L39.1759 46.17L28.901 35.8895C28.0201 35.0081 26.8589 34.5273 25.6095 34.5273C24.3602 34.5273 23.199 35.0081 22.3181 35.8895L12.0432 46.17L7.22205 41.3463L17.4969 31.0658H33.7141H33.7221Z" />
                    <path d="M35.4359 28.101L49.4668 31.8591L51.2287 25.2645L37.1978 21.5065C35.9965 21.186 34.9954 20.4167 34.3708 19.335C33.7461 18.2613 33.586 17.0033 33.9063 15.8013L37.6623 1.76283L31.0713 0L27.3153 14.0385L35.4279 28.093L35.4359 28.101Z" />
                    <path d="M15.7912 28.101L1.76028 31.8591L-0.00158691 25.2645L14.0293 21.5065C15.2306 21.186 16.2316 20.4167 16.8563 19.335C17.4809 18.2613 17.6411 17.0033 17.3208 15.8013L13.5648 1.76283L20.1558 0L23.9118 14.0385L15.7992 28.093L15.7912 28.101Z" />
                  </svg>
                  <div className="wl-btn">Connect to join the whitelist</div>
                </div>
              ) : (
                <div className="button" onClick={handleDisconnect}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 60 50"
                    className="button__icon"
                    aria-hidden="true"
                  >
                    <path d="M33.7221 31.0658L43.997 41.3463L39.1759 46.17L28.901 35.8895C28.0201 35.0081 26.8589 34.5273 25.6095 34.5273C24.3602 34.5273 23.199 35.0081 22.3181 35.8895L12.0432 46.17L7.22205 41.3463L17.4969 31.0658H33.7141H33.7221Z" />
                    <path d="M35.4359 28.101L49.4668 31.8591L51.2287 25.2645L37.1978 21.5065C35.9965 21.186 34.9954 20.4167 34.3708 19.335C33.7461 18.2613 33.586 17.0033 33.9063 15.8013L37.6623 1.76283L31.0713 0L27.3153 14.0385L35.4279 28.093L35.4359 28.101Z" />
                    <path d="M15.7912 28.101L1.76028 31.8591L-0.00158691 25.2645L14.0293 21.5065C15.2306 21.186 16.2316 20.4167 16.8563 19.335C17.4809 18.2613 17.6411 17.0033 17.3208 15.8013L13.5648 1.76283L20.1558 0L23.9118 14.0385L15.7992 28.093L15.7912 28.101Z" />
                  </svg>
                  <div className="wl-btn">Se déconnecter</div>
                </div>
              )}

              {message && (
                <div
                  className="connection-status"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Sketch P5 via iframe */}
        <div className="right-content">
          <div className="rectangle-1">
            <GenerativeSketchIframe
              key={regenerateTrigger}
              regenerateTrigger={regenerateTrigger}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
