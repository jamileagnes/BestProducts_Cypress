import React from "react";
import { Container, ContainerModal, Text, Image } from "./style";
import { getCheckout } from "app/ducks/productsEcommerce";
import { connect } from "react-redux";

function ModalCheckout(props) {
  return (
    <Container display={props.finishCheckout ? "flex" : "none"}>
      <ContainerModal>
        <Text>Compra efetuada com sucesso!</Text>
        <Image src="/img/sucessBuy.gif" alt="sucessGif" />
      </ContainerModal>
    </Container>
  );
}

export default connect(getCheckout, () => ({}))(ModalCheckout);
