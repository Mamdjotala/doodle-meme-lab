import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({ memeUrl, memeText }) => {
  const shareMessage = `Regarde mon mème ! ${memeText} ${memeUrl}`;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      {/* WhatsApp */}
      <WhatsappShareButton url={memeUrl} title={shareMessage}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      {/* X (Twitter) */}
      <TwitterShareButton url={memeUrl} title={shareMessage}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      {/* Facebook */}
      <FacebookShareButton url={memeUrl} quote={shareMessage}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      {/* Instagram (non supporté par react-share) */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/instagram-icon.png"
          alt="Instagram"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      </a>
    </div>
  );
};

export default ShareButtons;
