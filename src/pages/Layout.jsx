

import React from "react";

export default function Layout({ children, currentPageName }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Lora', serif;
        }

        body, html {
          font-family: 'Lora', serif;
          background: #fdf9e7;
          min-height: 100vh;
        }

        /* Blinking cursor animation */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .blinking-cursor::after {
          content: '|';
          animation: blink 1s infinite;
          color: #8b7355;
          margin-left: 2px;
        }

        /* Base button with small rounded corners except top-left */
        .btn-base {
          font-family: 'Lora', serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          user-select: none;
          border-radius: 0 4px 4px 4px;
          border: 1px solid;
        }

        /* BACK Button - Minimal, unobtrusive */
        .btn-back {
          background: transparent;
          color: #8b7355;
          border-color: transparent;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          box-shadow: none;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
        }

        .btn-back:hover {
          background: #fdf9e7;
          color: #6d5a42;
          transform: translateX(-2px);
        }

        .btn-back:active {
          background: #f0ebe0;
        }

        .btn-back::before {
          content: "←";
          margin-right: 0.5rem;
          font-size: 1.1rem;
        }

        /* SKIP Button - Present but de-emphasized */
        .btn-skip {
          background: transparent;
          color: #a69580;
          border-color: #d4c8b8;
          border-style: dashed;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          box-shadow: none;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
        }

        .btn-skip:hover {
          background: #fdf9e7;
          color: #8b7355;
          border-style: solid;
          transform: translateY(-1px);
        }

        .btn-skip:active {
          transform: translateY(0);
        }

        /* SET SEMESTER GOAL - Most important, clean and elevated */
        .btn-semester-goal {
          background: #FF5503;
          color: #fefcf7;
          border-color: #FF5503;
          padding: 0.8rem 1.6rem;
          font-family: 'Lora', serif;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(255, 85, 3, 0.7);
          border-radius: 0 4px 4px 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-semester-goal:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255, 85, 3, 0.8);
        }

        .btn-semester-goal:active {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(255, 85, 3, 0.7);
        }

        .btn-semester-goal:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* CREATE ITEM - Physical press with intent badge */
        .btn-create {
          background: #fefcf7;
          color: #8b7355;
          border-color: #8b7355;
          padding: 0.8rem 1.6rem;
          box-shadow: 4px 4px 0 #FF5503;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .btn-create::after {
          content: 'purposeful';
          position: absolute;
          top: -8px;
          right: -8px;
          background: #FF5503;
          color: white;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: 500;
          transform: rotate(12deg);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .btn-create:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #FF5503;
        }

        .btn-create:hover::after {
          opacity: 1;
        }

        .btn-create:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0 #FF5503;
        }

        /* Continue/General Action Button */
        .btn-continue {
          background: #fefcf7;
          color: #8b7355;
          border-color: #8b7355;
          padding: 0.8rem 1.6rem;
          box-shadow: 4px 4px 0 #FF5503;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-continue:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #FF5503;
        }

        .btn-continue:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0 #FF5503;
        }

        /* Secondary variation */
        .btn-secondary {
          background: #fefcf7;
          color: #8b7355;
          border-color: #8b7355;
          padding: 0.8rem 1.6rem;
          box-shadow: 4px 4px 0 #8b7355;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #8b7355;
        }

        .btn-secondary:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0 #8b7355;
        }

        /* Inverse version - orange background, cream shadow */
        .btn-inverse {
          background: #FF5503;
          color: #fefcf7;
          border-color: #FF5503;
          padding: 0.8rem 1.6rem;
          box-shadow: 4px 4px 0 #fefcf7;
          border-radius: 0 4px 4px 4px;
          font-family: 'Lora', serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-inverse:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #fefcf7;
        }

        .btn-inverse:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0 #fefcf7;
        }
      `}</style>

      <div className="min-h-screen" style={{ background: '#fdf9e7' }}>
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}

