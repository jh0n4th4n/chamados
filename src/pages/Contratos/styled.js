// styles/StyledContrato.js
import styled from 'styled-components';

export const PageContent = styled.div`
  padding: 20px;
  background-color: #f7f9fc;
  min-height: 100vh;
 
`;

export const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.4em;
  color: #001875;
  margin-top: 30px;
  margin-bottom: 10px;
  border-left: 4px solid #001875;
  padding-left: 10px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled.label`
  font-weight: 500;
  margin-top: 15px;
  color: #333;
`;

export const StyledInput = styled.input`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 1em;
  transition: border 0.3s;

  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.3);
    outline: none;
  }
`;

export const StyledTextarea = styled.textarea`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 1em;
  min-height: 100px;
  resize: vertical;
  transition: border 0.3s;

  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.3);
    outline: none;
  }
`;

export const StyledSelect = styled.select`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 1em;
  transition: border 0.3s;

  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.3);
    outline: none;
  }
`;

export const FileInput = styled.input`
  padding: 10px 0;
`;

export const SubmitButton = styled.button`
  background-color: #001875;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  padding: 12px 20px;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0125f3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;
