import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="bbcp">
      <header className="bcph">
        <div class="top">
          <strong>
            ▲ Before submitting forms on this site, make sure you are using this
            address{" "}
            <span>https://doveme.netlify.com/</span> only.
          </strong>
        </div>
        <div class="menu">
          <div class="logo">
            <a href="/about">
              dove<span>.me</span>
            </a>
          </div>
          <nav>
            <a href="/">Try it now</a>
          </nav>
          <div class="call">
            <button>Contact</button>
          </div>
        </div>
      </header>

      <div class="hero">
        <h3 className="bcp">Introducing</h3>
        <h1 className="bcp">
          The BEST chatting app <br />
          ever for couples.
        </h1>
      </div>

      <main className="bcpm">
        <div class="grad2"></div>
        <section class="infosite">
          <div class="poss">
            <div class="poss1">
              <h2 className="bcp">Tailored Real-Time Communication</h2>
              <p>
                In a world that moves at a rapid pace, maintaining a strong
                connection with your partner is more crucial than ever. <br />{" "}
                <br /> Our mission is to enhance relationships by providing a
                real-time chat platform designed exclusively for couples,
                fostering intimacy and communication in the digital age.
              </p>
            </div>
            <div class="poss2">
              <h2 className="bcp">Elevating Connection and Communication</h2>
              <p>
                dove.me isn't just another chat app; it's a dedicated space
                crafted for the unique dynamics of romantic relationships.{" "}
                <br /> <br /> dove.me goes beyond conventional messaging apps.
                It becomes a digital sanctuary for couples to express love,
                share moments, and strengthen their bond in real-time.
              </p>
            </div>
            <div class="poss3">
              <h2 className="bcp">Seamless Integration to Life</h2>
              <p>
                Integrating dove.me into your life is effortless. Our
                user-centric design ensures a seamless and intuitive experience
                for both partners. <br /> <br /> Whether it's coordinating
                schedules, sending love notes, or having spontaneous
                conversations, dove.me adapts to your relationship dynamics.
              </p>
            </div>
          </div>
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230616/pngtree-abstract-pink-pastel-background-with-3d-rendered-wireless-computer-keyboard-button-image_3606812.jpg"
            alt=""
          />
          <div class="grad"></div>
        </section>
      </main>
    </div>
  );
};

export default About;
