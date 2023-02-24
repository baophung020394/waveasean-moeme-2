import { updateProfileUser } from "actions/auth";
import { ImageUpload } from "components/ImageUpload";
import { withBaseLayout } from "layouts/Base";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Grid,
  Icon,
  Input,
  Item,
  Segment,
  TextArea,
} from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface ProfileProps {
  user: any;
}

function Profile({ user }: ProfileProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [valueBio, setValueBio] = useState<string>("");
  const [valueDes, setValueDes] = useState<string>("");
  const isChecking = useSelector(({ auth }) => auth.update.isChecking);
  const openUpload = () => setIsOpen(true);
  const closeUpload = () => setIsOpen(false);
  const dispatch: any = useDispatch();

  const bioRef: any = useRef();
  const desRef: any = useRef();

  const handleClickBio = () => {
    bioRef.current.style.display = "block";
    setValueBio(user?.bio);
  };

  const handleClickOutSideBio = () => {
    bioRef.current.style.display = "none";
    updateBio();
  };

  const handleClickDes = () => {
    desRef.current.style.display = "block";
    setValueDes(user?.description);
  };

  const handleClickOutSideDes = () => {
    desRef.current.style.display = "none";
    updateDescription();
  };

  const updateBio = () => {
    console.log("bio");
    if (valueBio === "") return;
    dispatch({ type: "AUTH_UPDATE_PROFILE_INIT" });
    const newUser = { ...user };
    newUser.bio = valueBio;
    dispatch(updateProfileUser(newUser));
    setValueBio("");
  };

  const updateDescription = () => {
    console.log("description");
    if (valueDes === "") return;
    dispatch({ type: "AUTH_UPDATE_PROFILE_INIT" });
    const newUser = { ...user };
    newUser.description = valueDes;
    dispatch(updateProfileUser(newUser));
    setValueDes("");
  };

  return (
    <ProfileStyled className="profile-container">
      <Grid>
        <Grid.Column width={6}>
          <Item.Group>
            <Item>
              {isChecking ? (
                <Icon.Group size="huge">
                  <Icon loading size="big" name="circle notch" />
                </Icon.Group>
              ) : (
                <Item.Image size="tiny" src={user?.photoURL} avatar />
              )}

              <Item.Content>
                <Item.Header as="a">{user?.username}</Item.Header>
                <Item.Meta>Description</Item.Meta>
                <Item.Description>
                  <Segment>
                    <Button basic color="pink" onClick={openUpload}>
                      Update avatar
                    </Button>
                    <ImageUpload
                      user={user}
                      open={isOpen}
                      onClose={closeUpload}
                    />
                  </Segment>
                </Item.Description>
                <Item.Extra>Additional Details</Item.Extra>
                <Item.Description>
                  <Segment className="segment-input bio">
                    <Input
                      disabled={isChecking}
                      onClick={handleClickBio}
                      value={valueBio}
                      placeholder={`${
                        user?.bio !== "" ? user?.bio : "Input bio..."
                      }`}
                      className="input"
                      onChange={(e) => setValueBio(e.target.value)}
                    />
                    <div
                      className="layer"
                      ref={bioRef}
                      onClick={() => handleClickOutSideBio()}
                    ></div>
                    {isChecking ? (
                      <Icon.Group size="big" className="icon-loading-input">
                        <Icon loading size="small" name="circle notch" />
                      </Icon.Group>
                    ) : null}
                  </Segment>
                </Item.Description>
                <Item.Description>
                  <Segment className="segment-input description">
                    <Form>
                      <TextArea
                        disabled={isChecking}
                        onClick={handleClickDes}
                        value={valueDes}
                        onChange={(e) => setValueDes(e.target.value)}
                        placeholder={`${
                          user?.description !== ""
                            ? user?.description
                            : "Input description..."
                        }`}
                        className="textarea"
                        style={{ minHeight: 100 }}
                      />
                    </Form>
                    <div
                      className="layer2"
                      ref={desRef}
                      onClick={() => handleClickOutSideDes()}
                    ></div>
                    {isChecking ? (
                      <Icon.Group size="big" className="icon-loading-input">
                        <Icon loading size="small" name="circle notch" />
                      </Icon.Group>
                    ) : null}
                  </Segment>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
      </Grid>
    </ProfileStyled>
  );
}
const ProfileStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;

  .segment-input {
    .input {
      width: 100%;
      z-index: 2;
    }
    .icon-loading-input {
      position: absolute;
      top: 56%;
      transform: translateY(-50%);
      right: 21px;
      z-index: 3;
    }

    .textarea {
      width: 100%;
    }

    &.bio {
      .layer {
        display: none;
        background: transparent;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }

    &.description {
      z-index: 2;
      .layer2 {
        display: none;
        background: transparent;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }
  }
`;

export default withBaseLayout(Profile);
