import React, { useEffect } from "react";
import styled from "styled-components";
import { Channel } from "models/channel";
import { currencyFormat } from "hooks/useFormatNumber";
import STOIcon from "assets/images/icon/STO.png";
import ORGIcon from "assets/images/icon/ORG.png";
import PERIcon from "assets/images/icon/PER.png";
import SPLIcon from "assets/images/icon/SPL.png";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  createChannel,
  createChannel2,
  fetchUnreads,
  joinChannel,
  setCurrentChannel,
} from "actions/channel";

interface CardChannelProps {
  channel?: Channel;
  onClick?: () => void;
  isGoChannel?: string;
  unreads?: any;
  count?: any;
}

function CardChannel({
  channel,
  onClick,
  isGoChannel,
  unreads,
  count,
}: CardChannelProps) {
  const dispatch: any = useDispatch();
  const history = useHistory();
  const user: any = useSelector(({ auth }) => auth.user);
  const currentChannel = useSelector(({ channel }) => channel.currentChannel);

  const renderChannelType = (channelType: string) => {
    switch (channelType) {
      case "STO":
        return (
          <p>
            <span className="tag">
              <img src={STOIcon} className="iconTag" />
            </span>
            종목
          </p>
        );
      case "ORG":
        return (
          <p>
            <span className="tag">
              <img src={ORGIcon} className="iconTag" />
            </span>
            기관
          </p>
        );
      case "PER":
        return (
          <p>
            <span className="tag">
              <img src={PERIcon} className="iconTag" />
            </span>
            개인
          </p>
        );
      case "SPL":
        return (
          <p>
            <span className="tag">
              <img src={SPLIcon} className="iconTag" />
            </span>
            전문가
          </p>
        );
      default:
        return null;
    }
  };

  const onChooseChannel = async (channel: any) => {
    dispatch(setCurrentChannel(channel));

    switch (isGoChannel) {
      case "GO_CHANNEL": {
        return history.push(`/channel-detail/${channel?.id}`);
      }
      case "CREATE_CHANNEL":
        dispatch({ type: "CHANNELS_CREATE_INIT" });
        return askForConfirmtionOldChannel(channel);
      case "JOIN_CHANNEL":
        dispatch({ type: "CHANNELS_JOIN_INIT" });
        return askForConfirmtionNewChannel(channel);

      default: {
        return history.push(`/channel-detail/${channel?.id}`);
      }
    }

    // dispatch({
    //   type: "CHOOSE_CHANNEL",
    //   channelDetail: channel,
    // });
  };

  const askForConfirmtionOldChannel = (channel: any) => {
    const isConfirming = confirm(
      `Do you want to create & join channel: ${channel.room_name}`
    );

    if (isConfirming) {
      dispatch(createChannel2(channel));
    } else {
      dispatch({ type: "CHANNELS_CREATE_FAIL" });
    }
  };

  const askForConfirmtionNewChannel = (channel: any) => {
    const isConfirming = confirm(
      `Do you want to join channel: ${channel.room_name}`
    );

    if (isConfirming) {
      dispatch(joinChannel(channel, user.uid));
    } else {
      dispatch({ type: "CHANNELS_JOIN_FAIL" });
    }
  };

  return (
    <CardChannelStyled>
      <div
        className="card"
        onClick={() => onChooseChannel(channel)}
        key={`${channel?.room_name}-${channel?.id}`}
      >
        <div className="card--top">
          <div className="card--top__infor">
            <object
              className="icon40 avatar"
              data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=7&serverfile=thumb_${channel?.room_profile_image}`}
              type="image/png"
            >
              {channel?.device === "web" &&
              channel?.room_profile_image !== "" ? (
                <img
                  className="image-chat"
                  src={JSON.parse(channel?.room_profile_image)}
                  alt="Thumb"
                />
              ) : (
                <img
                  src="http://www2.aveapp.com/wp-content/uploads/2021/05/w2560.jpg"
                  alt="avatar"
                  className="icon40 avatar"
                />
              )}
            </object>
            <div className="infor">
              <h3>{channel?.room_name}</h3>
              {renderChannelType(channel?.chnl_type)}
            </div>
          </div>
          {count > 0 && (
            <div className="card--top__notify">
              <p>New - {count}</p>
            </div>
          )}
          {/* {unreads?.length > 0 ? (
            <div className="card--top__notify">
              <p>New {unreads?.length}</p>
            </div>
          ) : null} */}
        </div>
        <div className="card--bottom">
          <div className="card--bottom__person">
            <object
              className="icon24 avatar"
              data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${channel?.ownerId}&roomid=${channel?.roomId}`}
              type="image/png"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                alt="avatar"
                className="icon24 avatar"
              />
            </object>

            <span className="card--bottom__person__name">
              {channel?.owner_name}
            </span>
          </div>
          <div className="card--bottom__buyer">
            <p className="card--bottom__buyer--name">Buyer</p>
            <span className="card--bottom__buyer--quantity">
              {!channel?.userCount
                ? currencyFormat(Number(channel?.joinedUsers?.length))
                : currencyFormat(Number(channel?.userCount))}
            </span>
          </div>
        </div>
      </div>
    </CardChannelStyled>
  );
}
const CardChannelStyled = styled.div`
  .card {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    border: none;
    border-radius: 10px;
    margin-bottom: 16px;
    cursor: pointer;

    &--top {
      display: flex;
      justify-content: space-between;
      padding: 20px 15px;
      border-bottom: 1px solid #e6ecf3;

      &__notify {
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
          margin: 0;
          font-size: 12px;
          background-color: #6161e3;
          color: #fff;
          border-radius: 20px;
          padding: 1px 4px;
        }
      }
      &__infor {
        display: flex;

        img {
          // width: 40px;
          // height: 40px;
          // border-radius: 100%;
          // object-fit: cover;
          // margin-right: 6px;
        }
        .infor {
          h3 {
            font-size: 16px;
            margin: 0;
            font-weight: bold;
          }
          p {
            font-size: 14px;
            margin: 0;
            display: flex;
            align-items: center;

            font-size: 12px;
          }
        }
      }
    }
    &--bottom {
      display: flex;
      justify-content: space-between;
      algin-items: center;
      padding: 8px 15px;

      &__person {
        display: flex;
        align-items: center;
        
        img {
          width: 24px;
          height: 24px;
          border-radius: 100%;
          object-fit: cover;
          margin-right: 6px;
        }
        span {
          font-size: 13px;
          font-weight: bold;
        }
      }

      &__buyer {
        display: flex;
        align-items: center;

        &--name {
          font-size: 13px;
          margin: 0 10px 0 0;
          color: rgb(112, 112, 112);
        }

        &--quantity {
          font-size: 13px;
          color: rgb(112, 112, 112);
        }
      }
    }
  }
`;

export default CardChannel;
