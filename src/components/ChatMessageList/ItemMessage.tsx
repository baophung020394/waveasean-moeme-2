import ProgressBars from "components/common/ProgressBars";
import Stocks from "components/Stocks";
import moment from "moment";
import React, { useCallback } from "react";
import { ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { formatTimeAgo, formatTimeDate } from "utils/time";

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

  // const renderTimeline = ({ timestamp }: any) => {
  //   // console.log('Date', Date.now());
  //   // console.log('parseInt(timestamp)', parseInt(timestamp))
  //   // if (Date.now() === parseInt(timestamp)) {
  //   //   console.log("bang");
  //   // } else {
  //   //   console.log("ko bang");
  //   // }
  //   const hour = 60 * 60 * 1000; //(60seconds * 60minutes * 1000ms, to get the milliseconds)
  //   const hourAgo = Date.now() - hour;
  //   // console.log("after 1 hour", hourAgo);
  //   // console.log("after 1 hour", parseInt(timestamp));

  //   // let time = moment(hour),
  //   //   beforeTime = moment(timestamp),
  //   //   afterTime = moment(Date.now());

  //   // if (time.isBetween(beforeTime, afterTime)) {
  //   //   console.log("is between");
  //   // } else {
  //   //   console.log("is not between");
  //   // }
  //   // return "";

  //   // console.log({ hour });
  //   // console.log({ hourAgo });
  //   // console.log(timestamp)
  //   // let today: any = new Date();
  //   // const dd = String(today.getDate()).padStart(2, "0");
  //   // const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  //   // const yyyy = today.getFullYear();
  //   // today = mm + "/" + dd + "/" + yyyy;
  //   // const todayMoment: any = moment(parseInt(timestamp, 10)).format(
  //   //   "MM/DD/YYYY"
  //   // );
  //   // console.log("today", today);
  //   // console.log("todayMoment", todayMoment);
  //   const todayMoment = moment(parseInt(timestamp, 10));
  //   // console.log("todayMomen", todayMoment);

  //   // console.log(todayMoment.isAfter(moment().subtract(1, "hours")));
  //   // if (timestamp < hourAgo) {
  //   //   return todayMoment.calendar();
  //   // }

  //   if (todayMoment.calendar() && parseInt(timestamp, 10) > hourAgo && user.uid !== message.user.uid) {
  //     console.log("today");
  //     return ""
  //   } else if (todayMoment.subtract(1, "days").calendar()) {
  //     console.log("yesterday");
  //     return todayMoment.subtract(1, "days").calendar();
  //   }
  // };

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
      message?.fileType &&
      ["video/mp4", "video/mp3"].includes(message?.fileType)
    ) {
      return "chat-videos";
    } else if (
      message?.fileType &&
      ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
    ) {
      return "chat-images";
    } else if (
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ].includes(message?.fileType)
    ) {
      return "other-file";
    } else {
      return "";
    }
  };

  const renderContentFiles = () => {
    if (
      message?.fileType &&
      ["video/mp4", "video/mp3"].includes(message?.fileType)
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
      message?.fileType &&
      ![
        "video/mp4",
        "video/mp3",
        "image/jpeg",
        "image/png",
        "image/jpg",
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
    } else if (message?.stocks) {
      return (
        <div className="chat-text-wrapper">
          <Stocks stocks={message?.stocks} />
        </div>
      );
    } else {
      return <div className="chat-text-wrapper">{message.content}</div>;
    }
  };

  return (
    <li
      className={`${isAuthorOf(message)} ${renderClassName(message)}`}
      key={`${message?.id}-${index}`}
    >
      <div className="chat-avatar">
        <Image src={message?.user?.photoURL} avatar />

        <div className="chat-name">
          {message?.author?.username}
          <div className="chat-hour">{formatTimeAgo(message.timestamp)}</div>
        </div>
      </div>

      {renderContentFiles()}
      
    </li>
  );
}

ItemMessage.propTypes = {};

export default ItemMessage;
