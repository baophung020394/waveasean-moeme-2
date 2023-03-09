import ChannelTalkDetail from "components/ChannelTalk/ChannelTalkDetail";
import ProgressBars from "components/common/ProgressBars";
import Stocks from "components/Stocks";
import React, { useCallback, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { styled } from "utils/styled-component";
import { formatTimeAgo } from "utils/time";

interface ItemMessageProps {
  messages: any;
  message: any;
  type?: any;
  index?: number;
  selectedFile?: any;
  progressBar?: any;
  imageLoaded?: () => void;
}

function ItemMessage({
  messages,
  message,
  type,
  selectedFile,
  index,
  progressBar,
  imageLoaded,
}: ItemMessageProps) {
  const user = useSelector(({ auth }) => auth.user);

  const isAuthorOf = useCallback(
    (message: any) => {
      return message?.author?.id === user?.uid ? "chat-right" : "chat-left";
    },
    [messages]
  );

  const renderClassName = (message: any) => {
    if (message?.stocks) {
      return "chat-stocks";
    } else if (
      message?.type === 1 &&
      message?.fileType &&
      ["video/mp4", "video/mp3", "audio/mpeg"].includes(message?.fileType)
    ) {
      return "chat-videos";
    } else if (
      message?.type === 1 &&
      message?.fileType &&
      ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
    ) {
      return "chat-images";
    } else if (
      message?.type === 1 &&
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "audio/mpeg",
      ].includes(message?.fileType)
    ) {
      return "other-file";
    } else if (message?.type === 2) {
      return "chat-channel";
    } else {
      return "";
    }
  };

  const renderContentFiles = () => {
    if (
      message?.type === 1 &&
      message?.fileType &&
      ["video/mp4", "video/mp3", "audio/mpeg"].includes(message?.fileType)
    ) {
      return (
        <div className="chat-text-wrapper">
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <>
                <ProgressBars progressBar={progressBar} />;
              </>
            )}
          <video
            onLoad={imageLoaded}
            controls
            src={
              message?.status === "Uploading"
                ? URL.createObjectURL(message?.files)
                : message.files
            }
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (
      message?.type === 1 &&
      message?.fileType &&
      ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
    ) {
      return (
        <div className="chat-text-wrapper">
          <img
            className="image-chat"
            src={
              message?.status === "Uploading"
                ? URL.createObjectURL(message?.files)
                : message.files
            }
            alt="Thumb"
            onLoad={imageLoaded}
          />
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <ProgressBars progressBar={progressBar} />
            )}
        </div>
      );
    } else if (
      message?.type === 1 &&
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "audio/mpeg",
      ].includes(message?.fileType)
    ) {
      return (
        <div className={`chat-text-wrapper `}>
          <button
            className="chat-text"
            type="submit"
            onClick={() => `${window.open(`${message.files}`)}`}
            disabled={message.status === "Uploading"}
            onLoad={imageLoaded}
          >
            {message?.metadata.name}
          </button>
          {selectedFile?.timestamp === message?.timestamp &&
            message.status === "Uploading" && (
              <ProgressBar
                animated
                now={progressBar?.percent}
                label={`${progressBar?.percent}%`}
              />
            )}
        </div>
      );
    } else if (message?.stocks && message?.type === 3) {
      return (
        <div className="chat-text-wrapper">
          <Stocks stocks={message?.stocks} />
        </div>
      );
    } else if (message?.type === 2) {
      return (
        <div className="chat-text-wrapper">
          <ChannelTalkDetail message={message} />
        </div>
      );
    } else {
      return <div className="chat-text-wrapper">{message.content}</div>;
    }
  };

  return (
    <ItemMessageStyled>
      <li
        className={`${isAuthorOf(message)} ${renderClassName(message)}`}
        key={`${message?.id}-${index}`}
      >
        {message?.type !== 2 && (
          <div className="chat-avatar">
            <Image src={message?.user?.photoURL} avatar />

            <div className="chat-name">
              {message?.author?.username}
              <div className="chat-hour">
                {formatTimeAgo(message.timestamp)}
              </div>
            </div>
          </div>
        )}

        {renderContentFiles()}
      </li>
    </ItemMessageStyled>
  );
}

const ItemMessageStyled = styled.div`
  .chat-channel {
    .chat-text-wrapper {
      position: relative;
      max-width: 320px;
      width: 100%;
      padding: 0;
      background-color: #fff !important;
    }
  }
`;

export default ItemMessage;
