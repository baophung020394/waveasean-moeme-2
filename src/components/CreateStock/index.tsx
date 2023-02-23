import React from "react";
import { styled } from "utils/styled-component";
import IconCloseGrey from "assets/images/chat/close-grey.png";
import { useForm } from "react-hook-form";
import Button from "components/common/Header/Button";

interface CreateStockProps {
  submitForm: (data: any) => void;
  closeFunc: (state: boolean) => void;
}
function CreateStock({ closeFunc, submitForm }: CreateStockProps) {
  const { register, handleSubmit } = useForm();
  const user = JSON.parse(localStorage.getItem("_profile"));

  const onSubmit = (data: any) => {
    data.user = user;
    console.log(data)
    submitForm(data);
  };

  return (
    <CreateStockStyled className="create--stock">
      <div className="create--stock__heading">
        <h3>시그널</h3>
        <button className="btn-hover" onClick={() => closeFunc(false)}>
          <img className="icon24 img-show" src={IconCloseGrey} alt="" />
          <img className="icon24 img-hover" src={IconCloseGrey} alt="" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="stocks--box__form">
        <div className="form--inputs">
          <div className="form--inputs__input">
            <span>종목명</span>
            <input {...register("name")} type="text" />
          </div>
          <div className="form--inputs__input">
            <span>매수가</span>
            <input {...register("priceBuy")} type="number" />
          </div>
          <div className="form--inputs__input">
            <span>매도가</span>
            <input {...register("priceSell")} type="number" />
          </div>
          <div className="form--inputs__input">
            <span>손절가</span>
            <input {...register("priceCutoff")} type="number" />
          </div>
        </div>

        <div className="btn-options">
          <Button
            type="submit"
            name="전송"
            className="btn-submit"
            inputColor="primary"
          >
            전송
          </Button>
          <Button
            type="button"
            name="취소"
            className="btn-cancel"
            inputColor="secondary"
            onClick={() => closeFunc(false)}
          >
            취소
          </Button>
        </div>
      </form>
    </CreateStockStyled>
  );
}

const CreateStockStyled = styled.div`
  position: absolute;
  bottom: 30px;
  right: 0;
  z-index: 1;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #e2e2e2;
  background-color: #fff;
  min-width: 360px;

  .stocks--box__form {
    .form--inputs {
      &__input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        input {
          border-radius: 8px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
          border: solid 1px #e2e2e2;
          background-color: #fff;
          min-width: 240px;
          min-height: 40px;
          max-height: 40px;
          padding: 16px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }

  .create--stock__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;

    h3 {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .btn-options {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn-cancel {
      color: #fff;
    }
  }
`;

export default CreateStock;
