"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./WhatsAppWidget.module.css";

const WhatsAppWidget = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative z-[999999]">
      <div className={`${styles.whatsappBox} ${isActive ? styles.active : ""}`}>
        {/* <div className={styles.whatsappHead}>
          <span onClick={() => setIsActive(false)}>X</span>
          <div className={styles.whatsappProfile}>
            <Image
              src="/whatsapp/general.jpeg"
              alt="Profile"
              width={50}
              height={50}
            />
          </div>
          <div className={styles.whatsappDetails}>
            <h6>John doe</h6>
            <p>How can i help you?</p>
          </div>
        </div> */}
        <div className={styles.whatsappChat}>
          <div className={styles.chatbox}>
            <Image
              src="/whatsapp/arrow.png"
              alt="Arrow"
              className={styles.arrow}
              width={20}
              height={20}
            />
            <h6>John Doe</h6>
            <p>
              Hi There 👋
              <br />
              How can I help you?
            </p>
            <p className={styles.time}>16:37</p>
          </div>
        </div>
        <div className={styles.chatBtnBox}>
          <div className={styles.chatBtn}>
            <a
              href="https://wa.me/+919266415151?text=Hello%20I%20Want%20To%20Know%20About%20Your%20Services"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/whatsapp/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
              />
              &nbsp;
              <p>Click To Chat</p>
            </a>
          </div>
        </div>
      </div>
      <div
        className={`${styles.whatsappStickyBtn} rounded-full bg-[#00a884] p-4`}
        onClick={() => setIsActive(!isActive)}
      >
        <Image
          src="/whatsapp/whatsapp.svg"
          alt="WhatsApp Icon"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
};

export default WhatsAppWidget;
