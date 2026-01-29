import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  place-items: center;
  min-height: 120px;

  .spinner {
    width: 46px;
    height: 46px;
    display: grid;
    animation: spinner-plncf9 3s infinite;
  }

  .spinner::before,
  .spinner::after {
    content: "";
    grid-area: 1/1;
    border: 9px solid;
    border-radius: 50%;
    border-color: #2b6ee8 #2b6ee8 transparent transparent;
    mix-blend-mode: darken;
    animation: spinner-plncf9 1s infinite linear;
  }

  .spinner::after {
    border-color: transparent transparent #c7d6f8 #c7d6f8;
    animation-direction: reverse;
  }

  @keyframes spinner-plncf9 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

export default Loader;
