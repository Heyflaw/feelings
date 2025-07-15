"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount, useDisconnect } from "wagmi";

const GenerativeSketchIframe = dynamic(
  () => import("@/components/GenerativeSketchIframe"),
  { ssr: false }
);

// Fonction pour échapper les caractères HTML (corrigée avec les entités HTML appropriées)
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Composant isolé pour gérer GenerativeSketchIframe
const SketchSection = React.memo(
  ({ regenerateTrigger }: { regenerateTrigger: number }) => {
    console.log(
      "SketchSection rendered with regenerateTrigger:",
      regenerateTrigger
    );
    return (
      <section className="sketch-section">
        <GenerativeSketchIframe regenerateTrigger={regenerateTrigger} />
      </section>
    );
  },
  (prevProps, nextProps) =>
    prevProps.regenerateTrigger === nextProps.regenerateTrigger
);
SketchSection.displayName = "SketchSection";

// Composant pour la section whitelist
const WhitelistSection = React.memo(
  ({
    isConnected,
    address,
    login,
    logout,
    disconnect,
  }: {
    isConnected: boolean;
    address: string | undefined;
    login: () => void;
    logout: () => void;
    disconnect: () => void;
  }) => {
    const [joinRequested, setJoinRequested] = useState(false);
    const [joined, setJoined] = useState(false);
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);
    const [maxWallets, setMaxWallets] = useState(100);

    const percent = Math.round((count / maxWallets) * 100);
    const isFull = count >= maxWallets;

    // GET total et maxWallets au montage
    useEffect(() => {
      console.log("Fetching whitelist data");
      fetch("/api/join-whitelist")
        .then((res) => res.json())
        .then(({ total, maxWallets }) => {
          setCount(total ?? 0);
          setMaxWallets(maxWallets ?? 100);
        })
        .catch(() => {
          setCount(0);
          setMaxWallets(100);
        });
    }, []);

    // Vérif de l’adresse connectée
    useEffect(() => {
      if (!isConnected || !address) {
        setJoined(false);
        return;
      }
      console.log("Checking wallet address:", address);
      fetch("/api/join-whitelist")
        .then((res) => res.json())
        .then(({ list }) => setJoined(list.includes(address)))
        .catch(() => setJoined(false));
    }, [isConnected, address]);

    // POST join
    useEffect(() => {
      if (joinRequested && address) {
        console.log("Sending join request for address:", address);
        fetch("/api/join-whitelist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        })
          .then(async (res) => {
            const data = await res.json();
            console.log("API response:", data);
            if (res.ok) {
              setMessage(`✅ ${escapeHtml(data.message)}`);
              setJoined(true);
              setCount(data.total ?? count);
              setMaxWallets(data.maxWallets ?? maxWallets);
            } else if (res.status === 409) {
              setMessage(`⚠️ ${escapeHtml(data.message)}`);
              setJoined(true);
              setCount(data.total ?? count);
              setMaxWallets(data.maxWallets ?? maxWallets);
            } else {
              setMessage(`❌ ${escapeHtml(data.message)}`);
              setCount(data.total ?? count);
              setMaxWallets(data.maxWallets ?? maxWallets);
            }
          })
          .catch(() => {
            setMessage("❌ Network error.");
            setCount(count);
          })
          .finally(() => setJoinRequested(false));
      }
    }, [joinRequested, address, count, maxWallets]);

    const handleJoinClick = () => {
      console.log("Join button clicked");
      setJoinRequested(true);
      login();
    };

    const handleDisconnect = () => {
      console.log("Disconnect button clicked");
      disconnect();
      logout();
      setJoined(false);
      setMessage("");
    };

    return (
      <section className="wl-section">
        <div className="wl-header">
          <div className="wl-titre">Join the list.</div>
          <p className="wl-text">
            Connect your wallet to secure your spot and be part of the drop.👇
          </p>
        </div>

        {isFull ? (
          <>
            <div className="button disabled">
              <div className="wl-btn">LIST FULL FOR NOW</div>
            </div>
            <p className="full-message">
              Heads up! The list’s completely full right now, but we’re opening
              up more spots soon. Follow{" "}
              <a
                href="https://x.com/Heyflaw"
                target="_blank"
                rel="noopener noreferrer"
              >
                @Heyflaw
              </a>{" "}
              on X and turn on notifications 🔔 to be the first to know!
            </p>
          </>
        ) : !joined ? (
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
            <div className="wl-btn">CONNECT TO JOIN THE LIST</div>
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
            <div className="wl-btn">DISCONNECT</div>
          </div>
        )}

        <div className="progress-wrapper">
          <div className="progress">
            <div className="progress-value" style={{ width: `${percent}%` }} />
          </div>
          <p className="progress-text">
            {count} / {maxWallets} listed ({percent}%)
          </p>
        </div>

        {message && (
          <div
            className="connection-status"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </section>
    );
  }
);
WhitelistSection.displayName = "WhitelistSection";

export function ClientHome() {
  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const { login, logout } = useLoginWithAbstract();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Debug HomePage lifecycle
  useEffect(() => {
    console.log("HomePage mounted");
    return () => console.log("HomePage unmounted");
  }, []);

  // Debug regenerateTrigger changes
  useEffect(() => {
    console.log("regenerateTrigger changed:", regenerateTrigger);
  }, [regenerateTrigger]);

  return (
    <main className="desktop-1">
      <header className="hero__header">
        <div className="hero__title">FEELINGS</div>
      </header>

      <div className="content">
        <section className="intro-section">
          <div className="intro-titre">A story of resilience.</div>
          <p className="text-feeling">
            Born from a tough year, <b>Feelings</b> is a generative art
            project coded in p5.js. It’s about bringing emotions, both the
            good and the bad, to life, transforming them into something
            visible. Hit
            <b> Generate </b> to discover a new one.
          </p>
          <div className="mint-info">
            <p>
              <strong>Mint price:</strong> FREE
            </p>
            <p>
              <strong>Supply:</strong> 222 (22 reserved)
            </p>
            <p>
              <strong>Date:</strong> TBD
            </p>
          </div>
          <div
            className="button generate-btn"
            onClick={() => {
              console.log(
                "Generate button clicked, incrementing regenerateTrigger"
              );
              setRegenerateTrigger((t) => t + 1);
            }}
          >
            Generate
          </div>
        </section>

        <SketchSection regenerateTrigger={regenerateTrigger} />

        <WhitelistSection
          isConnected={isConnected}
          address={address}
          login={login}
          logout={logout}
          disconnect={disconnect}
        />
      </div>
    </main>
  );
}