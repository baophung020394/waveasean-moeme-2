import { updateProfileUser } from "actions/auth";
import { ImageUpload } from "components/ImageUpload";
import firebase from "db/firestore";
import { withBaseLayout } from "layouts/Base";
import React, { useEffect, useRef, useState } from "react";
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
  const [isChange, setIsChange] = useState<boolean>(false);
  const [valueBio, setValueBio] = useState<string>(
    user?.bio !== "" ? user?.bio : ""
  );
  const [valueDes, setValueDes] = useState<string>(
    user?.description !== "" ? user?.description : ""
  );
  const isChecking = useSelector(({ auth }) => auth.update.isChecking);
  const openUpload = () => setIsOpen(true);
  const closeUpload = () => setIsOpen(false);
  const dispatch: any = useDispatch();

  const bioRef: any = useRef();
  const desRef: any = useRef();

  const handleClickBio = () => {
    bioRef.current.style.display = "block";
  };

  const handleClickOutSideBio = () => {
    bioRef.current.style.display = "none";
    updateBio();
  };

  const handleClickDes = () => {
    desRef.current.style.display = "block";
  };

  const handleClickOutSideDes = () => {
    desRef.current.style.display = "none";
    updateDescription();
  };

  const updateBio = () => {
    if (!isChange) return;
    dispatch({ type: "AUTH_UPDATE_PROFILE_INIT" });
    const newUser = { ...user };
    newUser.bio = valueBio;
    dispatch(updateProfileUser(newUser));
    setIsChange(false);
  };

  const updateDescription = () => {
    if (!isChange) return;
    dispatch({ type: "AUTH_UPDATE_PROFILE_INIT" });
    const newUser = { ...user };
    newUser.description = valueDes;
    dispatch(updateProfileUser(newUser));
    setIsChange(false);
  };

  // useEffect(() => {
  //   firebase
  //     .database()
  //     .ref("channels")
  //     .on("value", (snap) => {
  //       snap.forEach((sn) => {
  //         console.log("sn", sn.val().id);
  //         if (sn.val().id !== undefined) {
  //           firebase
  //             .database()
  //             .ref("messages")
  //             .child(sn.val().id)
  //             .on("value", (snap) => {
  //               console.log("mess", snap);
  //               snap.forEach((sn) => {
  //                 console.log("chimehuy", sn.val());
  //               });
  //             });
  //         }
  //       });
  //     });
  // }, []);
  return (
    <ProfileStyled className="profile-container">
      <Grid>
        <Grid.Column width={9}>
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
                      placeholder="Input bio..."
                      className="input"
                      onChange={(e) => {
                        setValueBio(e.target.value);
                        setIsChange(true);
                      }}
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
                        onChange={(e) => {
                          setValueDes(e.target.value);
                          setIsChange(true);
                        }}
                        placeholder="Input description..."
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
