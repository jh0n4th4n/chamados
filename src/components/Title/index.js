// components/Title.jsx
import { TitleContainer, TitleText } from './styled';

export default function Title({ children, name }) {
  return (
    <TitleContainer>
      {children}
      <TitleText>{name}</TitleText>
    </TitleContainer>
  );
}
