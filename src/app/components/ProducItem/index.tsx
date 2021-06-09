import Heart from "app/svg/heart";
import React from "react";
import { Button, Container, ImgProduct, Price, Text, Type } from "./style";

function ProductItem(props) {
  return (
    <Container>
      <ImgProduct src={props.image} />
      <div>
        <Text>{props.name}</Text>
        <Type>Quantidade: {props.stock}</Type>
        <Price>R$ {props.price.toFixed(2)}</Price>
      </div>
      <Button
        onClick={() =>
          props.addToCart({
            image: props.image,
            name: props.name,
            type: props.type,
            price: props.price,
          })
        }
      >
        <Heart width={20} heigth={20} />
        COMPRAR
      </Button>
    </Container>
  );
}

export default ProductItem;
