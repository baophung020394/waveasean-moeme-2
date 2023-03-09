import React from "react";
import { Card, Feed, Grid, Image } from "semantic-ui-react";
import { formatTimeAgo } from "utils/time";
import { styled } from "utils/styled-component";

interface PostsProps {
  post: any;
}
function Posts({ post }: PostsProps) {
  return (
    <PostsStyled>
      <div className="posts">
        <div className="posts-top">
          <span className="posts-top__timestamp">
            {formatTimeAgo(post?.timestamp)}
          </span>
          <div className="posts-top__content">
            <p
              dangerouslySetInnerHTML={{
                __html: post?.content.replace(/<img .*?>/g, ""),
              }}
            />

            <Image src={post?.files} size="medium" />
          </div>
        </div>
        <div className="posts-bottom">
          <Card className="post-bottom-card">
            <Card.Content className="post-bottom-card__content">
              <Feed>
                <Feed.Event>
                  <Image
                    src={
                      post?.channel?.room_profile_image
                        ? post?.channel?.room_profile_image
                        : "http://www2.aveapp.com/wp-content/uploads/2021/05/w2560.jpg"
                    }
                    size="medium"
                    avatar
                  />
                  {/* <Feed.Label image={
                      post?.channel?.room_profile_image
                        ? post?.channel?.room_profile_image
                        : "http://www2.aveapp.com/wp-content/uploads/2021/05/w2560.jpg"
                    } /> */}
                  <Feed.Content>
                    <Feed.Summary>{post?.channel.room_name}</Feed.Summary>
                    <Feed.Date content={post?.user.username} />
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PostsStyled>
  );
}

const PostsStyled = styled.div`
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
  border: none;
  border-radius: 10px;
  margin-bottom: 16px;
  cursor: pointer;

  .posts {
    &::before {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 86%;
      height: 30px;
      background: #fff;
      z-index: -1;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
    }
  }

  .posts-bottom {
    border-top: 1px solid #eee;

    .post-bottom-card {
      width: 100%;
      border: none;
      box-shadow: none;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;

      &__content {
        padding: 10px 20px;
      }
    }
  }
  .posts-top {
    padding: 18px 20px;
    min-height: 160px;

    &__timestamp {
      font-size: 12px;
      color: #a9a9a9;
    }

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-height: 100px;
      overflow: hidden;

      p {
        font-size: 14px;
        color: #000;
      }

      img {
        max-width: 82px;
        max-height: 82px;
        object-fit: cover;
        border-radius: 10px;
      }
    }
  }
`;

export default Posts;
