import CustomModal from "components/CustomModal";
import React, { useEffect, useState } from "react";
import { Button, Carousel, Modal } from "react-bootstrap";
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  LivejournalIcon,
  MailruIcon,
  ViberIcon,
  WorkplaceIcon,
  EmailIcon,
  FacebookShareButton,
  LinkedinShareButton,
  ViberShareButton,
  TwitterShareButton,
  HatenaShareButton,
  HatenaIcon,
  InstapaperIcon,
  InstapaperShareButton,
  LineShareButton,
  LineIcon,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  TumblrShareButton,
} from "react-share";

import { styled } from "utils/styled-component";

interface ChannelChannelDetailProps {
  open: boolean;
  channel: any;
  uniqueuUsers: number;
}

function ChannelDetail({
  open,
  channel,
  uniqueuUsers,
}: ChannelChannelDetailProps) {
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [isCopied, setIsCopied] = useState("");

  const handleCloseShare = () => setIsOpenShare(false);
  const handleOpenShare = () => setIsOpenShare(true);

  const handleCopyClipborad = () => {
    navigator.clipboard.writeText(window.location.href);
    localStorage.setItem("urlCopy", window.location.href);
    localStorage.setItem("selectedChannel", JSON.stringify(channel));
    setIsCopied("Copied to Clipboard");
  };

  useEffect(() => {
    if (isCopied?.length > 0) {
      const clearTimeout = setTimeout(() => {
        setIsCopied("");
      }, 3000);
    }
  }, [isCopied]);

  return (
    <ChannelStyled
      style={{ right: open ? 0 : -300 }}
      className="channel-detail"
    >
      <div className="channel-detail__box">
        <div className="channel-detail__box__header">
          <h3>{channel?.room_name}</h3>
          <p>{uniqueuUsers} joined </p>
        </div>
        <div className="channel-detail__box__options">
          <button className="btn-hover" onClick={() => handleCopyClipborad()}>
            {isCopied?.length > 0 && <span className="copied">{isCopied}</span>}
            <img
              className="icon24 img-show"
              src="https://cdn-icons-png.flaticon.com/512/14/14896.png"
              alt=""
            />
            <img
              className="icon24 img-hover"
              src="https://cdn-icons-png.flaticon.com/512/14/14896.png"
              alt=""
            />
          </button>
          <button className="btn-hover" onClick={handleOpenShare}>
            <img
              className="icon24 img-show"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3xsOQKDY5BLENtWuBUhouEnphUrNOfoW2_w&usqp=CAU"
              alt=""
            />
            <img
              className="icon24 img-hover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3xsOQKDY5BLENtWuBUhouEnphUrNOfoW2_w&usqp=CAU"
              alt=""
            />
          </button>
          <CustomModal
            title="Share with socials"
            open={isOpenShare}
            onClick={handleCloseShare}
            componentName="channel-detail-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Share with socials</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Carousel>
                <Carousel.Item>
                  <FacebookShareButton url={window.location.href}>
                    <FacebookIcon round size={32} />
                  </FacebookShareButton>
                  <TwitterShareButton url={window.location.href}>
                    <TwitterIcon round size={32} />
                  </TwitterShareButton>
                  <HatenaShareButton url={window.location.href}>
                    <HatenaIcon round size={32} />
                  </HatenaShareButton>
                  <InstapaperShareButton url={window.location.href}>
                    <InstapaperIcon round size={32} />
                  </InstapaperShareButton>
                  <LinkedinShareButton url={window.location.href}>
                    <LinkedinIcon round size={32} />
                  </LinkedinShareButton>
                  <LineShareButton url={window.location.href}>
                    <LineIcon round size={32} />
                  </LineShareButton>
                  <LivejournalShareButton url={window.location.href}>
                    <LivejournalIcon round size={32} />
                  </LivejournalShareButton>
                  <MailruShareButton url={window.location.href}>
                    <MailruIcon round size={32} />
                  </MailruShareButton>
                  <OKShareButton url={window.location.href}>
                    <OKIcon round size={32} />
                  </OKShareButton>
                  <ViberShareButton url={window.location.href}>
                    <ViberIcon round size={32} />
                  </ViberShareButton>
                  <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon round size={32} />
                  </WhatsappShareButton>
                </Carousel.Item>
                <Carousel.Item>
                  <TelegramShareButton url={window.location.href}>
                    <TelegramIcon round size={32} />
                  </TelegramShareButton>
                  <TumblrShareButton url={window.location.href}>
                    <TumblrIcon round size={32} />
                  </TumblrShareButton>
                </Carousel.Item>
              </Carousel>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseShare}>
                Close
              </Button>
              {/* <Button variant="primary">Share</Button> */}
            </Modal.Footer>
          </CustomModal>
        </div>
      </div>
    </ChannelStyled>
  );
}

const ChannelStyled = styled.div`
  position: fixed;
  top: 0;
  right: -300px;
  z-index: 2;
  width: 300px;
  height: 100%;
  background: #fff;
  transition: 0.4s;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);

  .channel-detail {
    &__box {
      h3 {
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
      }

      &__header {
        padding: 20px;
      }

      &__options {
        padding: 15px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;

        .btn-hover {
          position: relative;
          border: 1px solid #eee;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-right: 8px;

          &:last-child {
            margin-right: 0;
          }

          img {
            width: 14px;
            height: 14px;
          }

          .copied {
            position: absolute;
            top: -32px;
            left: 50%;
            min-width: 144px;
            font-size: 12px;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
`;

export default ChannelDetail;
