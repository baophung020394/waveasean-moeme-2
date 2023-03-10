import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "db/firestore";
import { styled } from "utils/styled-component";
import { Button, Header, Image } from "semantic-ui-react";

function RequestLogin() {
  const [channel, setChannel] = useState<any>({});
  const copyRef = firebase.database().ref("copyUrls");
  useEffect(() => {
    copyRef.on("child_added", (snap: any) => {
      copyRef.child("copyUrl").update({
        ...snap.val(),
        isLogin: 1,
      });

      setChannel(snap.val());
    });
  }, []);

  return (
    <RequestLoginStyled className="login-view">
      <div className="login--box">
        <Image
          className="channel-image"
          avatar
          size="medium"
          src={
            channel?.room_profile_image
              ? channel?.room_profile_image
              : "https://i.pinimg.com/originals/7a/4f/c4/7a4fc4c1f4f8c22f0e73a524057c106f.jpg"
          }
        />
        <Header as="h3">{channel?.room_name}</Header>
        <Button className="btn-request-login" color="twitter">
          <Link to="/login">Login to join channel</Link>
        </Button>
      </div>
    </RequestLoginStyled>
  );
}
const RequestLoginStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn-request-login {
    border-radius: 20px;
    padding: 10px 30px;
    a {
      color: #fff;
    }
  }

  .channel-image {
    width: 300px;
    height: 300px !important;
    object-fit: cover;
  }

  .login--box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login--box__form {
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    padding: 40px 40px;
    min-width: 480px;
    max-width: 480px;

    h1 {
      font-size: 26px;
      text-align: center;
      margin-bottom: 48px;
    }

    .form--inputs {
      width: 100%;
      border: 1px solid #e2e2e2;
      border-radius: 8px;

      input {
        width: 100%;
        border: none;
        min-height: 48px;
        padding: 0 10px;
      }

      &__input.userid {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid #e2e2e2;

        input {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      }

      &__input.password {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        input {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }

    .btn-options {
      text-align: right;
      margin-top: 60px;
      display: flex;
      justify-content: flex-end;

      .btn-login {
        color: #fff;
        padding: 10px 0;
        display: inline-block;
        min-width: 96px;
        max-height: 40px;
        border: none;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .forgot-options {
    text-align: center;
    padding: 20px 0;

    a {
      color: #707070;
      font-size: 14px;

      border-right: 1px solid #e2e2e2;
      margin-right: 16px;
      padding-right: 16px;

      &:last-child {
        margin-right: 0;
        border-right: none;
      }
    }
  }
  .footer-copyright {
    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    span {
      color: #707070;
      font-size: 14px;
    }
  }
`;
export default RequestLogin;
