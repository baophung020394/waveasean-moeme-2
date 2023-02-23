import React from "react";
import { styled } from "utils/styled-component";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";

interface ErrorProps {
  error?: any;
}
function Error({ error }: ErrorProps) {
  const dispatch: any = useDispatch();

  return (
    <ErrorStyled>
      <Modal.Header closeButton>
        <Modal.Title>Create channel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{error?.message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => dispatch({ type: "CHANNELS_CREATE_FAIL" })}
        >
          Ok
        </Button>
      </Modal.Footer>
    </ErrorStyled>
  );
}
const ErrorStyled = styled.div``;

export default Error;
