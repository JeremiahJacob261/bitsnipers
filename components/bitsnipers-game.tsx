"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import "@/styles/bitsnipers.css";

// --- Simple inline SVG icons (stroke inherits currentColor) ---
const IconTrophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M8 21h8" />
    <path d="M12 17a5 5 0 0 0 5-5V5H7v7a5 5 0 0 0 5 5Z" />
    <path d="M5 5h14" />
    <path d="M7 9H5a3 3 0 0 1-3-3V5h3" />
    <path d="M17 9h2a3 3 0 0 0 3-3V5h-3" />
  </svg>
);

const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconRefresh = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15A9 9 0 1 1 23 10" />
  </svg>
);

const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M20 21a8 8 0 1 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPlay = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <polygon points="8,5 20,12 8,19" />
  </svg>
);

const IconGlobe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </svg>
);

const IconList = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="18" r="1" />
  </svg>
);

const IconWallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M3 7h18v10H3z" />
    <path d="M16 12h3" />
    <path d="M3 7l2-2h10l2 2" />
  </svg>
);

const IconShirt = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M16 3l5 3-2 4-3-2v13H8V8L5 10 3 6l5-3 2 3h4l2-3z" />
  </svg>
);

// --- Demo data to drive the UI ---
type UserData = {
  email: string;
  profile: { username?: string | null; display_name?: string | null } | null;
  wallet: { usd_cents?: number; sol_lamports?: number };
  friends: Array<{ friend_email: string; created_at: string }>;
  leaderboard: Array<{
    email: string;
    name: string;
    total_usd: number;
    total_sol: number;
  }>;
  stats: { global_usd: number; global_sol: number };
};
const demoUser = {
  name: "Sniper",
  country: "US",
};

const demoLeaderboard: Array<{ name: string; winnings: number }> = [
  { name: "xXx_Labubu_xXx", winnings: 3853.8 },
  { name: "aj", winnings: 3598.66 },
  { name: "Quantum", winnings: 3050.72 },
  { name: "Nova", winnings: 2711.12 },
  { name: "Orion", winnings: 2150.4 },
];

const demoFriends: Array<{ name: string; playing: boolean }> = [
  { name: "Zero", playing: false },
  { name: "Mako", playing: true },
  { name: "Viper", playing: false },
];

const demoWallet = {
  usd: 0,
  sol: 0,
};

const demoStats = {
  playersInGame: 13,
  globalWinnings: 142_106,
};

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function BitSnipersGame() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [userEmail, setUserEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [socialTab, setSocialTab] = useState<
    "leaderboard" | "search" | "profile" | "friends"
  >("leaderboard");
  const [friendsTab, setFriendsTab] = useState<
    "friends" | "blocked" | "pending"
  >("friends");
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isCashOutOpen, setIsCashOutOpen] = useState(false);
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const [cashOutCurrency, setCashOutCurrency] = useState<"USD" | "SOL">("USD");
  const [destAddress, setDestAddress] = useState("");
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState("");
  const [affiliateData, setAffiliateData] = useState<any | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);

  const openSocial = (
    tab: "leaderboard" | "search" | "profile" | "friends"
  ) => {
    if (!ensureAuthOrOpenLogin()) return;
    setSocialTab(tab);
    setIsSocialOpen(true);
  };
  useEffect(() => {
    // Add hover effects to panels
    const panels = document.querySelectorAll(".panel");
    panels.forEach((panel) => {
      const handleMouseEnter = () => panel.classList.add("glow");
      const handleMouseLeave = () => panel.classList.remove("glow");

      panel.addEventListener("mouseenter", handleMouseEnter);
      panel.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        panel.removeEventListener("mouseenter", handleMouseEnter);
        panel.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    // Simulate live updates
    const interval = setInterval(() => {
      const liveIndicator = document.querySelector(
        ".live-indicator"
      ) as HTMLElement;
      if (liveIndicator) {
        liveIndicator.style.animation = "none";
        liveIndicator.offsetHeight; // Trigger reflow
        liveIndicator.style.animation = "pulse 2s infinite";
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Hydrate user data if session cookie exists
  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) setUserData(await res.json());
      } catch {}
    };
    hydrate();
  }, []);

  const unlockAudio = () => {
    if (!audioUnlocked && hoverSoundRef.current && clickSoundRef.current) {
      hoverSoundRef.current.play().catch(() => {});
      hoverSoundRef.current.pause();
      hoverSoundRef.current.currentTime = 0;

      clickSoundRef.current.play().catch(() => {});
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;

      setAudioUnlocked(true);
    }
  };

  const playHoverSound = () => {
    if (audioUnlocked && hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  const playClickSound = () => {
    if (audioUnlocked && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };
  // if the function below returns true, that is there is user data and the user is logged
  const ensureAuthOrOpenLogin = () => {
    if (!userData) {
      setIsLoginOpen(true);
      //the user is logged in
      return false;
    }
    return true;
  };

  const handleButtonInteraction = (e: React.MouseEvent) => {
    unlockAudio();
    playClickSound();
  };

  const handleButtonHover = () => {
    playHoverSound();
  };

  // --- Auth helpers (custom OTP) ---
  const requestMagicLink = async () => {
    if (!userEmail) return;
    try {
      setAuthLoading(true);
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send code");
      }
      setIsLoginOpen(false);
      setIsVerified(false);
      setConfirmationCode(["", "", "", "", "", ""]);
      setIsConfirmationOpen(true);
    } catch (e) {
      console.error("Email OTP request failed", e);
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyCode = async () => {
    const code = confirmationCode.join("");
    if (!userEmail || code.length !== 6) return;
    try {
      setAuthLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Invalid code");
      }
      setIsVerified(true);
      try {
        const me = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });
        if (me.ok) setUserData(await me.json());
      } catch {}
    } catch (e) {
      console.error("Verify OTP failed", e);
    } finally {
      setAuthLoading(false);
    }
  };

  const saveUsername = async () => {
    if (!username || username.trim().length < 3) return;
    try {
      setAuthLoading(true);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save username");
      }
      setIsConfirmationOpen(false);
    } catch (e) {
      console.error("Save username failed", e);
    } finally {
      setAuthLoading(false);
    }
  };

  // Affiliate fetch
  useEffect(() => {
    if (!isAffiliateOpen) return;
    const load = async () => {
      if (!ensureAuthOrOpenLogin()) return;
      try {
        setAffiliateLoading(true);
        const res = await fetch('/api/affiliate', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setAffiliateData(json.affiliate || null);
          if (json.affiliate?.code) setAffiliateCode(json.affiliate.code);
        }
      } finally {
        setAffiliateLoading(false);
      }
    };
    load();
  }, [isAffiliateOpen]);

  const saveAffiliateCode = async () => {
    if (!affiliateCode.trim()) return;
    try {
      setAffiliateLoading(true);
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: affiliateCode.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        setAffiliateData({ ...(affiliateData || {}), code: json.code });
      } else {
        console.error('Affiliate save failed');
      }
    } finally {
      setAffiliateLoading(false);
    }
  };

  // --- Wallet helpers ---
  const userUsdBalance = userData
    ? (userData.wallet.usd_cents || 0) / 100
    : demoWallet.usd;
  const userSolBalance = userData
    ? (userData.wallet.sol_lamports || 0) / 1_000_000_000
    : demoWallet.sol;
  const minCashOut = 0.21; // $0.20 + $0.01 fee example
  const cashOutPercent = userUsdBalance
    ? Math.min(100, (cashOutAmount / userUsdBalance) * 100)
    : 0;
  const insufficient = userUsdBalance < minCashOut;
  const amountInvalid =
    cashOutAmount <= 0 || cashOutAmount > userUsdBalance || cashOutAmount < minCashOut;
  const addressInvalid = destAddress.trim().length < 32; // naive Solana address check

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

        body {
          font-family: "Inter", sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          background-image: radial-gradient(
              circle at 25% 25%,
              rgba(59, 130, 246, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 75% 75%,
              rgba(59, 130, 246, 0.1) 0%,
              transparent 50%
            );
        }

        .hexagon-bg {
          background-image: url("images/background_tile.png");
          background-repeat: repeat;
          background-size: auto;
        }

        .panel {
          background: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          transition: all 0.3s ease;
          position: relative;
          transform: translateY(0);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4),
            0 4px 15px rgba(59, 130, 246, 0.3),
            0 2px 8px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 35px rgba(59, 130, 246, 0.6),
            0 8px 20px rgba(59, 130, 246, 0.4),
            0 4px 12px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .btn-primary:active {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5),
            0 4px 12px rgba(59, 130, 246, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: rgba(75, 85, 99, 0.8);
          border: 1px solid rgba(156, 163, 175, 0.2);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(75, 85, 99, 1);
          transform: translateY(-1px);
        }

        .btn-yellow {
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-yellow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 179, 8, 0.3);
        }

        .worm-bg {
          position: absolute;
          width: 300px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 150px;
          opacity: 0.1;
          filter: blur(20px);
        }

        .worm-bg.left {
          left: -100px;
          top: -50px;
          transform: rotate(-15deg);
        }

        .worm-bg.right {
          right: -100px;
          top: -50px;
          transform: rotate(15deg);
        }

        .live-indicator {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .character-preview {
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .character-segment {
          width: 20px;
          height: 20px;
          background: #eab308;
          border-radius: 50%;
          margin: 2px;
          display: inline-block;
        }

        .glow {
          box-shadow: 0 0 20px rgba(60, 60, 60, 0.3);
        }

        .game-btn {
          background: linear-gradient(to bottom, #ffd65c, #ffb400);
          border: none;
          border-radius: 8px;
          padding: 15px 60px;
          font-size: 16px;
          font-weight: bold;
          color: black;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 6px #cc8500;
          outline: none;
          transition: all 0.1s ease-in-out;
          margin-bottom: 10px;
        }

        .game-btn:active {
          transform: translateY(6px);
          box-shadow: 0 4px #cc8500;
          background: linear-gradient(to bottom, #d3b14c, #d69601);
        }

        .game-btn:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #cc8500;
        }

        #discord {
          background: linear-gradient(to bottom, #5865f2, #404eed);
          box-shadow: 0 6px #0f2284;
          position: fixed;
          z-index: 999;
          gap: 10px;
          display: flex;
          flex-direction: row;
          bottom: 50px;
          font-style: medium;
          color: whitesmoke;
          padding: 6px;
          justify-content: center;
          align-items: center;
          left: 50px;
          padding: 6px;
          width: auto;
        }

        #grey-btn {
          background: linear-gradient(to bottom, #959595, #656566);
          box-shadow: 0 6px #303131;
          color: #ffffff;
        }
        #submit-btn {
          background: linear-gradient(to bottom, #3f3f3f, #484848);
          box-shadow: 0 6px #cecece;
          color: #ffffff;
        }

        #cashout {
          background: transparent;
          box-shadow: 0 6px #1bda1b;
          padding: 12px;
          color: #10b981;
          border: 2px solid #10b981;
        }

        #addfunds {
          background: transparent;
          box-shadow: 0 6px #3434e4;
          padding: 12px;
          color: #3b82f6;
          border: 2px solid #3b82f6;
        }

        #addfunds:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #3434e4;
        }
        #addfunds:active {
          transform: translateY(6px);
          box-shadow: 0 2px #3434e4;
        }

        #discord:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #160279;
        }
        #cashout:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #1bda1b;
        }
        #grey-btn:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #525252;
        }
        #submit-btn:hover {
          transform: translateY(4px);
          box-shadow: 0 2px #7f7f7f;
        }

        #discord:active {
          transform: translateY(6px);
          box-shadow: 0 2px #160279;
        }
        #cashout:active {
          transform: translateY(6px);
          box-shadow: 0 2px #1bda1b;
        }
        #grey-btn:active {
          transform: translateY(6px);
          box-shadow: 0 2px #525252;
        }
        #submit-btn:active {
          transform: translateY(6px);
          box-shadow: 0 2px #d0d0d0;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .overlay.show {
          display: flex;
        }

        .dialog {
          background: #1b1b1b;
          border-radius: 12px;
          padding: 2rem;
          width: 350px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
          text-align: center;
          color: white;
          position: relative;
          animation: fadeInScale 0.3s ease;
          padding-left: 3rem;
          padding-right: 3rem;
        }

        @keyframes fadeInScale {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .dialog img {
          width: 80px;
          margin-bottom: 1rem;
        }

        .dialog h2 {
          margin: 0 0 1.5rem 0;
          font-size: 18px;
          color: #ccc;
        }

        .dialog input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #444;
          background: #222;
          color: white;
          margin-bottom: 1rem;
          outline: none;
        }

        .dialog button {
          width: 100%;
          padding: 10px;
          background: #333;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .dialog button.google {
          background: white;
          color: #444;
          font-weight: bold;
        }

        .dialog small {
          font-size: 12px;
          color: #aaa;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          cursor: pointer;
          font-size: 20px;
          color: #aaa;
        }
        .close-btn:hover {
          color: white;
        }
      `}</style>

      <audio ref={hoverSoundRef} src="sounds/hover.mp3" />
      <audio ref={clickSoundRef} src="sounds/switch_click.mp3" />

      <div className="hexagon-bg min-h-screen text-white p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <img
              src="images/icon.png"
              alt="logo"
              className="h-20 mx-auto mb-2"
            />
            <span className="text-orange-400 font-bold">
              Welcome,{" "}
              <span className="inline text-white">
                {userData?.profile?.username ||
                  userData?.profile?.display_name ||
                  demoUser.name}
              </span>
            </span>
          </div>
          <img
            src="images/logo2.png"
            alt="BitSnipers"
            className="h-20 mx-auto mb-2"
          />
          {userData ? (
            <div className="flex items-center gap-2">
              <button
                className="bg-neutral-800 py-2 px-3 rounded-lg font-medium flex items-center gap-2"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  openSocial("search");
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.12.61 1.82.33H10a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .7.4 1.31 1 1.51.7.28 1.36.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.61 1.12-.33 1.82V10c.9 0 1.65.75 1.65 1.65S20.3 15 19.4 15Z" />
                </svg>
              </button>
              <button
                className="btn-secondary py-2 px-3 rounded-lg font-medium flex items-center gap-2"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  openSocial("profile");
                }}
              >
                <IconUser className="w-4 h-4" />
              </button>
              <button
                className="btn-secondary py-2 px-3 rounded-lg font-medium"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  setSoundOn(!soundOn);
                }}
                aria-pressed={soundOn}
                title={soundOn ? "Mute" : "Unmute"}
              >
                {soundOn ? "🔊" : "🔈"}
              </button>
              <button
                className="btn-secondary py-2 px-3 rounded-lg font-medium"
                onMouseEnter={handleButtonHover}
                onMouseDown={async (e) => {
                  handleButtonInteraction(e);
                  await fetch("/api/auth/logout", { method: "POST" });
                  setUserData(null);
                  setIsVerified(false);
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-secondary py-2 px-3 rounded-lg font-medium flex items-center gap-2"
              onClick={() => setIsLoginOpen(true)}
              onMouseEnter={handleButtonHover}
              onMouseDown={handleButtonInteraction}
            >
              Login
            </button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Leaderboard & Friends */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <IconTrophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold">Leaderboard</h2>
                </div>
                <div className="live-indicator px-3 py-1 rounded-full text-xs font-semibold text-white">
                  Live
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {(userData?.leaderboard || demoLeaderboard).map(
                  (row: any, idx: number) => (
                    <div
                      key={(row.email || row.name) + idx}
                      className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg"
                    >
                      <span className="font-medium">{row.name}</span>
                      <span className="text-green-400 font-bold">
                        {currency((row.total_usd ?? row.winnings) || 0)}
                      </span>
                    </div>
                  )
                )}
              </div>

              <button
                className="game-btn"
                id="grey-btn"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  openSocial("leaderboard");
                }}
              >
                View Full Leaderboard
              </button>
            </div>

            {/* Friends */}
            <div className="panel rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <IconUsers className="w-6 h-6" />
                <h2 className="text-xl font-bold">Friends</h2>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="my-2 w-5 h-5 hover:text-orange-400"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15A9 9 0 1 1 23 10" />
                  </svg>
                  <span className="text-neutral-400">Refresh</span>
                </div>
                <span className="text-green-400">
                  {userData
                    ? userData.friends?.length || 0
                    : demoFriends.filter((f) => f.playing).length}{" "}
                  playing
                </span>
              </div>

              <div className="space-y-2 py-2">
                {!userData ? (
                  demoFriends.length === 0 ? (
                    <div className="text-center py-8">
                      <IconUser className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-neutral-400">
                        No friends... add some!
                      </p>
                    </div>
                  ) : (
                    demoFriends.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between p-3 bg-neutral-800/60 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <IconUser className="w-5 h-5" />
                          <span className="font-medium">{f.name}</span>
                        </div>
                        <span
                          className={
                            f.playing ? "text-green-400" : "text-neutral-400"
                          }
                        >
                          {f.playing ? "Playing" : "Offline"}
                        </span>
                      </div>
                    ))
                  )
                ) : userData.friends.length === 0 ? (
                  <div className="text-center py-8">
                    <IconUser className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-neutral-400">No friends yet.</p>
                  </div>
                ) : (
                  userData.friends.map((f) => (
                    <div
                      key={f.friend_email}
                      className="flex items-center justify-between p-3 bg-neutral-800/60 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <IconUser className="w-5 h-5" />
                        <span className="font-medium">{f.friend_email}</span>
                      </div>
                      <span className="text-neutral-400">
                        since {new Date(f.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                className="game-btn"
                id="grey-btn"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  openSocial("friends");
                }}
              >
                Add Friends
              </button>
            </div>

            {/* Discord */}
            <button
              className="game-btn"
              id="discord"
              onMouseEnter={handleButtonHover}
              onMouseDown={(e) => {
                if (!ensureAuthOrOpenLogin()) return;
                handleButtonInteraction(e);
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                role="img"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              <p>Join Discord!</p>
            </button>
          </div>

          {/* Center Panel - Game Options */}
          <div className="space-y-6">
            <div className="panel rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative h-[44px] w-[44px] flex items-center justify-center shrink-0 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-800 via-yellow-700 to-yellow-900 rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.4)]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-gold to-yellow-600 rounded-lg shadow-[0_4px_8px_rgba(255,215,0,0.3)] group-hover:shadow-[0_6px_12px_rgba(255,215,0,0.4)] transition-all duration-300"></div>
                  <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 via-gold to-yellow-500 rounded-md opacity-80"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/25 to-transparent rounded-lg opacity-60"></div>
                  <div className="absolute inset-0 rounded-lg border-2 border-yellow-800/60 shadow-inner"></div>
                  <div className="absolute inset-0 rounded-lg border border-yellow-300/40">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-all duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer will-change-transform bg-transparent hover:bg-white/10 active:bg-white/15 text-white/90 border-2 border-white/55 shadow-[0_3px_0_#6B7280] hover:shadow-[0_1px_0_#6B7280] active:shadow-[0_0px_0_#6B7280] hover:translate-y-[2px] active:translate-y-[3px] shrink-0 h-[44px] w-[44px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pen-square h-4 w-4"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                      </svg>
                    </button>
                  </div>
                  <span className="relative z-10 text-black font-black text-lg tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                    ?
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Login to set your name"
                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400"
                />
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-all duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer will-change-transform bg-transparent hover:bg-white/10 active:bg-white/15 text-white/90 border-2 border-white/55 shadow-[0_3px_0_#6B7280] hover:shadow-[0_1px_0_#6B7280] active:shadow-[0_0px_0_#6B7280] hover:translate-y-[2px] active:translate-y-[3px] shrink-0 h-[44px] w-[44px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pen-square h-4 w-4"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                  </svg>
                </button>
              </div>

              {/* Betting Options */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  className="game-btn"
                  style={{ padding: "16px" }}
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  $1
                </button>
                <button
                  className="game-btn"
                  style={{ padding: "16px" }}
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  $5
                </button>
                <button
                  className="game-btn"
                  style={{ padding: "16px" }}
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  $20
                </button>
              </div>

              {/* Join Game Button */}
              <button
                className="game-btn flex items-center justify-center gap-2"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                }}
              >
                <IconPlay className="w-4 h-4" />
                <span>JOIN GAME</span>
              </button>

              {/* Game Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  className="btn-secondary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  <IconGlobe className="w-4 h-4" /> {demoUser.country}
                </button>
                <button
                  className="btn-secondary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  <IconList className="w-4 h-4" /> Browse Lobbies
                </button>
              </div>

              {/* Game Stats */}
              <div className="space-y-2 mb-6">
                <div className="text-center">
                  <p className="text-neutral-400 text-sm">
                    {demoStats.playersInGame} Players In Game
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-400 text-sm">
                    {currency(
                      userData
                        ? userData.stats.global_usd
                        : demoStats.globalWinnings
                    )}{" "}
                    Global Player Winnings
                  </p>
                </div>
              </div>

              {/* Manage Affiliate */}
              <button
                className="game-btn"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                  setIsAffiliateOpen(true);
                }}
              >
                Manage Affiliate
              </button>
            </div>
          </div>

          {/* Right Panel - Wallet & Customize */}
          <div className="space-y-6">
            {/* Wallet */}
            <div className="panel rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <IconWallet className="w-6 h-6" />
                <h2 className="text-xl font-bold">Wallet</h2>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="text-neutral-400 cursor-pointer hover:underline hover:text-white">
                  Copy Address
                </span>
                <span className="text-neutral-400 cursor-pointer hover:underline hover:text-white">
                  Refresh Balance
                </span>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {userData
                    ? currency((userData.wallet.usd_cents || 0) / 100)
                    : currency(demoWallet.usd)}
                </div>
                <div className="text-neutral-400">
                  {userData
                    ? (
                        (userData.wallet.sol_lamports || 0) / 1_000_000_000
                      ).toFixed(4)
                    : demoWallet.sol.toFixed(4)}{" "}
                  SOL
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="game-btn"
                  id="addfunds"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={(e) => {
                    if (!ensureAuthOrOpenLogin()) return;
                    handleButtonInteraction(e);
                    setIsAddFundsOpen(true);
                  }}
                >
                  Add Funds
                </button>
                <button
                  className="game-btn"
                  id="cashout"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={(e) => {
                    if (!ensureAuthOrOpenLogin()) return;
                    handleButtonInteraction(e);
                    setIsCashOutOpen(true);
                  }}
                >
                  Cash Out
                </button>
              </div>
            </div>

            {/* Customize */}
            <div className="panel rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <IconShirt className="w-6 h-6" />
                <h2 className="text-xl font-bold">Customize</h2>
              </div>

              <div className="character-preview p-4 mb-4 text-center">
                <div className="flex justify-center items-center space-x-1 mb-2">
                  <div className="character-segment"></div>
                  <div className="character-segment"></div>
                  <div className="character-segment"></div>
                  <div className="character-segment"></div>
                  <div className="character-segment"></div>
                </div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>

              <button
                className="game-btn"
                id="grey-btn"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  if (!ensureAuthOrOpenLogin()) return;
                  handleButtonInteraction(e);
                }}
              >
                Change Appearance
              </button>
            </div>
          </div>
        </div>

        {/* Login Overlay */}
        <div
          className={`overlay ${isLoginOpen ? "show" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLoginOpen(false);
            }
          }}
        >
          <div className="dialog">
            <span className="close-btn" onClick={() => setIsLoginOpen(false)}>
              &times;
            </span>
            <h4>Log in or sign up</h4>
            <img
              src="/images/logo.png"
              alt="BitSnipers Logo"
              style={{ margin: "0 auto", display: "block" }}
            />

            <input
              type="email"
              className="border border-neutral-300 p-2 rounded font-thin tracking-wide"
              placeholder="your@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <button
              className="game-btn"
              id="submit-btn"
              onMouseEnter={handleButtonHover}
              onMouseDown={(e) => {
                handleButtonInteraction(e);
                requestMagicLink();
              }}
              disabled={authLoading}
            >
              {authLoading ? "Sending…" : "Submit"}
            </button>
            <button
              className="google"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={handleButtonHover}
              onMouseDown={handleButtonInteraction}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <small>
              By logging in I agree to the <a href="#">Terms</a> &{" "}
              <a href="#">Privacy Policy</a>
            </small>
            <p style={{ marginTop: "1rem", fontSize: "12px", color: "#888" }}>
              Encrypted with Cloudflare
            </p>
          </div>
        </div>

        {/* Email Confirmation Modal */}
        <div
          className={`overlay ${isConfirmationOpen ? "show" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsConfirmationOpen(false);
            }
          }}
        >
          <div className="bg-[#1c1c1c] text-white w-[360px] rounded-2xl p-6 relative shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setIsConfirmationOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Back Arrow */}
            <button
              className="absolute top-4 left-4 text-neutral-400 hover:text-white"
              onClick={() => {
                setIsConfirmationOpen(false);
                setIsLoginOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {isVerified ? (
              <div>
                {/* Success Icon */}
                <div className="flex justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
                    />
                  </svg>
                </div>
                <h2 className="text-center text-lg font-semibold mb-1">
                  You're in!
                </h2>
                <p className="text-center text-neutral-400 text-sm mb-6">
                  Your email has been verified. Pick a username.
                </p>

                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full p-2 rounded bg-[#2a2a2a] border border-neutral-600 mb-3"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  className="game-btn w-full"
                  id="submit-btn"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={(e) => {
                    handleButtonInteraction(e);
                    saveUsername();
                  }}
                  disabled={authLoading || username.trim().length < 3}
                >
                  {authLoading ? "Saving…" : "Save username"}
                </button>
              </div>
            ) : (
              <div>
                {/* Mail Icon */}
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-15 h-10 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.25 4.5A2.25 2.25 0 014.5 2.25h15a2.25 2.25 0 012.25 2.25v15a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 19.5v-15zm2.25 0L12 12.75 19.5 4.5h-15zM19.5 19.5V7.5l-7.5 7.5L4.5 7.5v12h15z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-center text-lg font-semibold mb-2 py-4">
                  Enter confirmation code
                </h2>
                <p className="text-center text-neutral-400 text-sm mb-6">
                  Please check{" "}
                  <span className="text-white font-medium">{userEmail}</span>{" "}
                  for an email from{" "}
                  <span className="text-white">BitSnipers</span> and enter your
                  code below.
                </p>

                {/* Code Inputs */}
                <div className="flex justify-between gap-2 mb-4">
                  {confirmationCode.map((digit, i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type="text"
                      value={digit}
                      onChange={(e) => {
                        if (/^[0-9]?$/.test(e.target.value)) {
                          const newCode = [...confirmationCode];
                          newCode[i] = e.target.value;
                          setConfirmationCode(newCode);
                          if (e.target.value && i < 5) {
                            const nextInput = document.getElementById(
                              `code-${i + 1}`
                            );
                            if (nextInput)
                              (nextInput as HTMLInputElement).focus();
                          }
                        }
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-bold rounded-lg bg-[#2a2a2a] border border-neutral-600 focus:border-yellow-400 focus:outline-none"
                      onMouseEnter={handleButtonHover}
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  className="game-btn w-full mb-4 my-2"
                  id="submit-btn"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={(e) => {
                    handleButtonInteraction(e);
                    verifyCode();
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? "Verifying…" : "Verify Code"}
                </button>

                {/* Resend Code */}
                <p className="text-center text-sm text-neutral-400 my-4">
                  Didn't get an email?{" "}
                  <button
                    className="text-yellow-400 hover:underline"
                    onMouseEnter={handleButtonHover}
                    onMouseDown={(e) => {
                      handleButtonInteraction(e);
                      requestMagicLink();
                    }}
                    disabled={authLoading}
                  >
                    Resend code
                  </button>
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-center items-center mt-6 text-xs text-neutral-500">
              <span>Secured by</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mx-1 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="font-semibold">BitSnipers</span>
            </div>
          </div>
        </div>
      </div>
      {/* Add Funds Modal */}
      {isAddFundsOpen && (
        <div
          className="overlay show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddFundsOpen(false);
          }}
        >
          <div className="bg-[#1c1c1c] text-white w-[360px] rounded-3xl p-6 relative shadow-xl flex flex-col gap-4">
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setIsAddFundsOpen(false)}
              onMouseEnter={handleButtonHover}
              onMouseDown={handleButtonInteraction}
            >
              ✕
            </button>
            <div className="p-5">
              <h2 className="text-sm font-semibold text-center mb-2 py-3">
                Add funds to your BitSnipers wallet
              </h2>
              <div className="flex flex-col gap-3 mt-2">
                <button
                  className="bg-neutral-900 border-2 cursor-pointer border-neutral-700 text-white py-3 px-4 rounded-lg flex items-center justify-between w-full hover:bg-neutral-700"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  <span className="text-neutral-300 flex items-center gap-2 text-sm font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M21 10H7" />
                      <path d="M21 6H3" />
                      <path d="M21 14H3" />
                      <path d="M21 18H7" />
                    </svg>
                    Transfer from an exchange
                  </span>
                </button>
                <button
                  className="bg-neutral-900 border-2 border-neutral-700 cursor-pointer text-white py-3 px-4 rounded-lg flex items-center justify-between w-full hover:bg-neutral-700"
                  onMouseEnter={handleButtonHover}
                  onMouseDown={handleButtonInteraction}
                >
                  <span className="flex items-center gap-2 text-neutral-300 text-sm font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M8 8h8v8H8z" />
                    </svg>
                    Receive funds
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1">
              <span>Protected by</span>
              <span className="font-semibold tracking-wide">BitSnipers</span>
            </div>
          </div>
        </div>
      )}
      {/* Affiliate Modal */}
      {isAffiliateOpen && (
        <div
          className="overlay show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAffiliateOpen(false);
          }}
        >
          <div className="bg-[#0f0f0f] text-white w-[840px] max-w-[95vw] rounded-xl p-6 relative shadow-2xl flex flex-col gap-6 border border-neutral-700/60">
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setIsAffiliateOpen(false)}
              onMouseEnter={handleButtonHover}
              onMouseDown={handleButtonInteraction}
            >
              ✕
            </button>
            <h2 className="text-sm tracking-wide font-semibold flex items-center gap-2 text-yellow-400">
                <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                >
                <circle cx="9" cy="8" r="4" />
                <path d="M15 21v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
                <circle cx="18" cy="10" r="3" />
                <path d="M23 21v-2a4.5 4.5 0 0 0-4.5-4.5H17" />
                </svg>
              AFFILIATE PROGRAM
            </h2>
            <div className="space-y-4 bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
              <label className="block text-xs font-medium mb-1 text-neutral-300">
                Your Affiliate Code
              </label>
              <input
                placeholder="your-code"
                value={affiliateCode}
                disabled={!!affiliateData?.code && affiliateData?.code !== affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              />
              <div>
                <button
                  className="game-btn !m-0 px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  id="submit-btn"
                  disabled={affiliateLoading || !affiliateCode.trim()}
                  onMouseEnter={handleButtonHover}
                  onMouseDown={(e) => {
                    handleButtonInteraction(e);
                    saveAffiliateCode();
                  }}
                >
                  {affiliateLoading ? 'Saving…' : 'Save Code'}
                </button>
              </div>
              <div className="pt-2">
                <p className="text-xs text-neutral-500 mb-1">Share Link</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="truncate">
                    {`https://damnbruh.com/?ref=${affiliateData?.code || affiliateCode || 'yourcode'}`}
                  </span>
                  <button
                    className="btn-secondary px-2 py-1 rounded text-[10px]"
                    onMouseDown={(e) => {
                      handleButtonInteraction(e);
                      navigator.clipboard.writeText(`https://damnbruh.com/?ref=${affiliateData?.code || affiliateCode}`);
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4">
              <h3 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Stats</h3>
              <div className="grid grid-cols-5 gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400">Percent Fee</span>
                  <span className="font-semibold">{affiliateData?.percent_fee ?? 0}%</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400">Total Users</span>
                  <span className="font-semibold">{affiliateData?.total_users ?? 0}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400">Total Earnings</span>
                  <span className="font-semibold text-yellow-400">{((affiliateData?.total_sol_lamports || 0) / 1_000_000_000).toFixed(4)} SOL</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400">Earnings (USD)</span>
                  <span className="font-semibold">{currency(((affiliateData?.total_usd_cents || 0) / 100))}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400">Games Played</span>
                  <span className="font-semibold">{affiliateData?.games_played ?? 0}</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600 text-center">Stats update periodically. Demo environment only.</p>
          </div>
        </div>
      )}
      {/* Cash Out Modal */}
      {isCashOutOpen && (
        <div
          className="overlay show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCashOutOpen(false);
          }}
        >
          <div className="bg-[#101010] text-white w-[480px] rounded-xl p-6 relative shadow-2xl flex flex-col gap-5 border border-neutral-700/60">
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setIsCashOutOpen(false)}
              onMouseEnter={handleButtonHover}
              onMouseDown={handleButtonInteraction}
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-lg">
              <span className="inline-block">↗</span>
              <span>Cash Out</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Available Balance
                </span>
                <span className="text-right">
                  <span className={userUsdBalance === 0 ? "text-red-400" : "text-green-400"}>
                    ${userUsdBalance.toFixed(2)}
                  </span>
                  <br />
                  <span className="text-neutral-500 text-[11px]">
                    {userSolBalance.toFixed(6)} SOL
                  </span>
                </span>
              </div>
              {insufficient && (
                <div className="text-[11px] bg-red-900/30 border border-red-800 text-red-300 rounded-md px-3 py-2">
                  Insufficient balance for cashout. Minimum $0.20 + $0.01 required.
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-stretch gap-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={cashOutAmount ? cashOutAmount : ""}
                    onChange={(e) =>
                      setCashOutAmount(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-3 font-medium focus:outline-none focus:border-yellow-500"
                    placeholder="0.00"
                    disabled={insufficient}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                        cashOutCurrency === "USD"
                          ? "bg-neutral-800 border-neutral-600"
                          : "bg-neutral-900 border-neutral-700"
                      }`}
                      onClick={() => setCashOutCurrency("USD")}
                      disabled={insufficient}
                    >
                      USD
                    </button>
                    <button
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                        cashOutCurrency === "SOL"
                          ? "bg-neutral-800 border-neutral-600"
                          : "bg-neutral-900 border-neutral-700"
                      }`}
                      onClick={() => setCashOutCurrency("SOL")}
                      disabled={insufficient}
                    >
                      SOL
                    </button>
                    <button
                      className="px-3 py-2 rounded-lg text-xs font-semibold border bg-neutral-900 border-neutral-700 hover:border-yellow-500"
                      onClick={() => setCashOutAmount(userUsdBalance)}
                      disabled={insufficient || userUsdBalance === 0}
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                      style={{ width: `${cashOutPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1 text-right">
                    {cashOutPercent.toFixed(0)}% of available balance
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 block">
                  Destination Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Solana wallet address..."
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value.trim())}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                  disabled={insufficient}
                />
                {destAddress && addressInvalid && (
                  <p className="text-[10px] text-red-400">
                    Address looks too short to be valid.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 btn-secondary py-3 rounded-lg font-medium"
                onClick={() => setIsCashOutOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 game-btn !m-0 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                id="cashout"
                disabled={insufficient || amountInvalid || addressInvalid}
                onMouseDown={(e) => {
                  handleButtonInteraction(e);
                  // Placeholder submit action
                  if (insufficient || amountInvalid || addressInvalid) return;
                  setIsCashOutOpen(false);
                  setCashOutAmount(0);
                  setDestAddress("");
                }}
              >
                ↗ Cash Out
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 text-center">
              Network + processing fees may apply.
            </p>
          </div>
        </div>
      )}
      {/* Social Modal */}
      {isSocialOpen && (
        <div
          className="overlay show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSocialOpen(false);
          }}
        >
          <div className="bg-[#1c1c1c] text-white w-auto h-auto overflow-hidden rounded-2xl p-8 relative shadow-xl flex flex-col border border-neutral-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4 px-5 text-[#d69601]">
                {socialTab ?? "Social"}
              </h2>
              <button
                className="text-neutral-400 hover:text-white"
                onMouseEnter={handleButtonHover}
                onMouseDown={(e) => {
                  handleButtonInteraction(e);
                  setIsSocialOpen(false);
                }}
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex gap-2">
                {[
                  { k: "leaderboard", label: "Leaderboard" },
                  { k: "search", label: "Search" },
                  { k: "profile", label: "Profile" },
                  { k: "friends", label: "Friends" },
                ].map((t) => (
                  <button
                    key={t.k}
                    className={`${
                      socialTab === t.k
                        ? "game-unselecteddialogtab"
                        : "game-selecteddialogtab"
                    }`}
                    onMouseEnter={handleButtonHover}
                    onMouseDown={(e) => {
                      handleButtonInteraction(e);
                      setSocialTab(t.k as any);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5 space-y-6 text-sm">
              {socialTab === "leaderboard" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Players</h3>
                  <div className="space-y-2">
                    {(userData?.leaderboard || demoLeaderboard)
                      .slice(0, 50)
                      .map((row: any, idx: number) => (
                        <div
                          key={(row.email || row.name) + idx}
                          className="flex items-center justify-between bg-neutral-800/70 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-400 w-6 text-right">
                              {idx + 1}
                            </span>
                            <IconUser className="w-5 h-5" />
                            <span className="font-medium">{row.name}</span>
                          </div>
                          <span className="text-green-400 font-semibold">
                            {currency((row.total_usd ?? row.winnings) || 0)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {socialTab === "search" && (
                <div className="border-border-neutral-600 border rounded-lg p-4 bg-neutral-800/70">
                  <h3 className="text-lg font-semibold mb-4">Search Players</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <input
                      className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm"
                      placeholder="Search by username or email"
                    />
                    <button
                      className="game-btn !m-0 px-6 w-full"
                      id="submit-btn"
                      onMouseEnter={handleButtonHover}
                      onMouseDown={handleButtonInteraction}
                    >
                      Go
                    </button>
                  </div>
                  <p className="text-neutral-400 text-xs">
                    Search results will appear here.
                  </p>
                </div>
              )}
              {socialTab === "profile" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-800/70 rounded-lg p-4">
                      <p className="text-xs text-neutral-400">Username</p>
                      <p className="font-medium">
                        {userData?.profile?.username ||
                          userData?.profile?.display_name ||
                          "—"}
                      </p>
                    </div>
                    <div className="bg-neutral-800/70 rounded-lg p-4">
                      <p className="text-xs text-neutral-400">Email</p>
                      <p className="font-medium break-all">{userData?.email}</p>
                    </div>
                    <div className="bg-neutral-800/70 rounded-lg p-4 col-span-2">
                      <p className="text-xs text-neutral-400">
                        Total Winnings (USD)
                      </p>
                      <p className="font-semibold text-green-400">
                        {currency(
                          userData
                            ? userData.leaderboard.find(
                                (l) => l.email === userData.email
                              )?.total_usd || 0
                            : 0
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-xs">
                    More profile customization coming soon.
                  </p>
                </div>
              )}
              {socialTab === "friends" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Friends</h3>
                  <div className="flex gap-2 mb-4">
                    {["friends", "pending", "blocked"].map((ft) => (
                      <button
                        key={ft}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          friendsTab === ft
                            ? "bg-yellow-500 text-black"
                            : "bg-neutral-800 hover:bg-neutral-700"
                        }`}
                        onMouseEnter={handleButtonHover}
                        onMouseDown={(e) => {
                          handleButtonInteraction(e);
                          setFriendsTab(ft as any);
                        }}
                      >
                        {ft.charAt(0).toUpperCase() + ft.slice(1)}
                      </button>
                    ))}
                  </div>
                  {friendsTab === "friends" && (
                    <div className="space-y-2">
                      {(userData?.friends || []).map((f) => (
                        <div
                          key={f.friend_email}
                          className="flex items-center justify-between bg-neutral-800/70 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <IconUser className="w-5 h-5" />
                            <span className="font-medium">
                              {f.friend_email}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {new Date(f.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {(!userData || userData.friends.length === 0) && (
                        <p className="text-neutral-400 text-xs">
                          No friends yet.
                        </p>
                      )}
                    </div>
                  )}
                  {friendsTab === "pending" && (
                    <p className="text-neutral-400 text-xs">
                      No pending requests.
                    </p>
                  )}
                  {friendsTab === "blocked" && (
                    <p className="text-neutral-400 text-xs">
                      No blocked users.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
