import { Body, Heading, Html, Tailwind, Text } from "@react-email/components";
import { JSX } from "react";

type Props = {
  readonly token: string;
};

export const TwoFactorAuthTemplate = ({ token }: Props): JSX.Element => (
  <Tailwind>
    <Html>
      <Body className="text-black">
        <Heading>Two Factor Authentication</Heading>
        <Text>Hello! Please use the following code to authenticate:</Text>
        <Text>{token}</Text>
        <Text>
          if you did not request this authentication, please ignore this
          message.
        </Text>
      </Body>
    </Html>
  </Tailwind>
);
