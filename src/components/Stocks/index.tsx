import React from "react";
import { styled } from "utils/styled-component";
import IconStockBlue from "assets/images/chat/stock-blue.png";
import { currencyFormat } from "hooks/useFormatNumber";
interface Stocks {
  stocks: any;
}

function Stocks({ stocks }: Stocks) {
  return (
    <StocksStyled>
      <button className="btn-hover">
        <img className="icon24 img-show" src={IconStockBlue} alt="" />
        <img className="icon24 img-hover" src={IconStockBlue} alt="" />
      </button>

      <div className="stocks">
        <div className="stocks--top">
          <h4>{stocks?.name}</h4>
          <button className="btn-order">주문</button>
        </div>
        <div className="stocks--mid">
          <div className="cols price-buy">
            <span className="title">매수가</span>
            <span className="price">
              {" "}
              {currencyFormat(Number(stocks?.priceBuy))}
            </span>
          </div>
          <div className="cols price-target">
            <span className="title">목표가</span>
            <span className="price">
              {currencyFormat(Number(stocks?.priceSell))}{" "}
            </span>
          </div>
          <div className="cols price-cutoff">
            <span className="title">손절가</span>
            <span className="price">
              {currencyFormat(Number(stocks?.priceCutoff))}
            </span>
          </div>
        </div>
        <div className="stocks--bot">
          <div className="stocks--bot__user">
            <object
              className="icon24 avatar"
              data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${stocks?.user.params.userId}&roomid=${stocks?.user.params.roomId}`}
              type="image/png"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                alt="avatar"
                className="icon24 avatar"
              />
            </object>
            <span className="stocks--bot__user__position">방장</span>
            <span className="stocks--bot__user__name">{stocks?.user.params.userName}</span>
          </div>
          <div className="stocks--bot__time">
            <span>방장 </span>
          </div>
        </div>
      </div>
    </StocksStyled>
  );
}

const StocksStyled = styled.div`
  position: relative;

  .btn-hover {
    position: absolute;
    top: -13px;
    right: -11px;
    z-index: 1;
  }

  .stocks {
    &--top {
      padding: 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      &:before {
        position: absolute;
        bottom: 0;
        left: 50%;
        content: "";
        background-color: #ccc;
        width: 95%;
        height: 1px;
        transform: translateX(-50%);
      }

      h4 {
        font-size: 18px;
      }
      
      .btn-order {
        background-color: red;
        border-radius: 8px;
        padding: 3px 16px;
        border: none;
        color: white;
        font-size: 14px;
      }
    }

    &--mid {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;

      .cols {
        display: flex;
        flex-direction: column;
        border-right: 1px solid #ccc;
        padding-right: 16px;
        flex: 1;
        text-align: center;

        .title {
          color: #333;
          font-size: 12px;
        }

        .price {
          color: #333;
          font-size: 12px;
          font-weight: bold;
        }

        &:last-child {
          border-right: none;
          padding-right: 0;
        }
      }
    }

    &--bot {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__user {
        display: flex;
        align-items: center;

        span {
          color: #333;
          font-size: 12px;
          font-weight: bold;
        }

        &__name {
          margin-left: 10px;
          position: relative;

          &:before {
            position: absolute;
            top: 50%;
            left: -7px;
            content: "";
            background-color: #333;
            width: 4px;
            height: 4px;
            border-radius: 100%;
            transform: translateY(-50%);
          }
        }
      }

      &__time {
        color: #ccc;
        font-size: 10px;
      }
    }
  }
`;

export default Stocks;
