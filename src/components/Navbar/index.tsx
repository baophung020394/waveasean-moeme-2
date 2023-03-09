import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Chat1 from "assets/images/icon/chat.png";
import Chat2 from "assets/images/icon/chat2.png";
import Person from "assets/images/icon/person.png";
import Settings from "assets/images/icon/settings.png";
import Home from "assets/images/icon/home.png";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import CustomModal from "components/CustomModal";
import SendToMultipleChannel from "components/ChannelTalk/CreateChannelTalk";

interface NavbarProps {
  view: string;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmitPosts = (data: any) => {
    console.log({ data });
  };

  return (
    <NavbarStyled className="navbar-left">
      <ul>
        <li>
          <NavLink to="/home" activeClassName="selected">
            <img src={Home} alt="" />
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="selected" to="/channel">
            <img src={Chat2} alt="" />
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="selected" to="/private">
            <img src={Chat1} alt="" />
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="selected" to="/profile">
            <img src={Person} alt="" />
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="selected" to="/settings">
            <img
              src="https://cdn-icons-png.flaticon.com/512/126/126472.png"
              alt=""
            />
          </NavLink>
        </li>
        {/* <li>
          <button className="btn-hover" onClick={() => setIsOpen(true)}>
            <span className="icon24 img-hover">
              <Icon name="edit outline" size="large" />
            </span>
            <span className="icon24 img-show">
              <Icon name="edit outline" size="large" disabled />
            </span>
          </button>
        </li> */}
      </ul>

      <Modal
        className="create-channel-talk-modal"
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        trigger={
          <button
            className="btn-hover post-modal"
            onClick={() => setIsOpen(true)}
          >
            <span className="icon24 img-hover">
              <Icon name="edit outline" size="large" />
            </span>
            <span className="icon24 img-show">
              <Icon name="edit outline" size="large" disabled />
            </span>
          </button>
        }
      >
        <Modal.Header>Channel Talk</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <SendToMultipleChannel />
          </Modal.Description>
        </Modal.Content>
      </Modal>

      {/* <CustomModal
        title="Channel Talk"
        componentName="send-to-multiple-channel-modal"
        open={isOpen}
        // onClick={() => setOpen(!open)}
        // submitForm={() => {}}
      >
        <SendToMultipleChannel />
      </CustomModal> */}
    </NavbarStyled>
  );
}

const NavbarStyled = styled.div`
  background-color: #fff;
  min-width: 80px;
  text-align: center;
  box-sizing: border-box;
  border-right: 1px solid #e6ecf3;

  ul {
    li {
      cursor: pointer;
      min-height: 80px;
      max-height: 80px;
      line-height: 80px;

      &:hover {
        background-color: #ccc;
      }

      &:last-child {
        margin-bottom: 0;
      }

      a {
        width: 100%;
        height: 100%;
        display: inline-block;

        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        &.selected {
          background-color: #eee;
        }
      }
    }
  }

  .post-modal {
    min-height: 80px;
    line-height: 80px;
    width: 100%;
    i {
      margin: 0 !important;
    }
  }
`;
export default Navbar;
