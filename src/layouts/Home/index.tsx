import Navbar from "components/Navbar";
import React, { useEffect, useState } from "react";
import { styled } from "utils/styled-component";
import { withBaseLayout } from "layouts/Base";
import Posts from "components/Posts";
import firebase from "db/firestore";
import { Grid } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "actions/channel";
import Page404 from "components/404";

interface HomeProps {}

function Home() {
  const postsRef = firebase.database().ref("posts");
  const [posts, setPosts] = useState<any>([]);
  const dispatch: any = useDispatch();
  const history = useHistory();

  useEffect(() => {
    postsRef.on("child_added", (snap) =>
      setPosts((currentState: any) => {
        let updateState = [...currentState];
        updateState.push(snap.val());
        return updateState;
      })
    );
  }, []);

  console.log(posts);
  return (
    <HomeStyled className="home-container">
      <Grid>
        <Grid.Row>
          {posts?.length > 0 &&
            posts.map((post: any, i:number) => (
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={4}
                key={i}
                onClick={() => {
                  console.log(post?.channel.id);
                  history.push(`/channel-detail/${post?.channel.id}`);
                  dispatch(setCurrentChannel(post?.channel, false));
                }}
              >
                <Posts post={post}/>
              </Grid.Column>
            ))}
        </Grid.Row>
      </Grid>
      {posts?.length <= 0 && <Page404 content="Not found post!" />}
    </HomeStyled>
  );
}

const HomeStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 40px;
  overflow-y: auto;
`;

export default withBaseLayout(Home);
