import React from "react";
import { styled } from "utils/styled-component";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CreateChannel from "components/CreateChannel";

interface CustomModalProps {
  open: boolean;
  onClick?: () => void;
  title?: string;
  btnOk?: string;
  btnCancel?: string;
  componentName?: string;
  submitForm?: (data: any) => void;
  children: any;
}

function CustomModal({
  title,
  open,
  btnOk,
  btnCancel,
  componentName,
  submitForm,
  onClick,
  children,
}: CustomModalProps) {
  return (
    <CustomModalStyled className="custom-modal">
      <Modal
        show={open}
        onHide={onClick}
        style={{ padding: 0 }}
        data-name={componentName}
        className={componentName}
      >
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </CustomModalStyled>
  );
}

const CustomModalStyled = styled.div``;

export default CustomModal;
