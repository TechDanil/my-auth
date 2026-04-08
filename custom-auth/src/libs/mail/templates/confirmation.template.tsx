import {
  Body,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components";
import { JSX } from "react";

type Props = {
  domain: string;
  token: string;
};

export const ConfirmationTemplate = ({ domain, token }: Props): JSX.Element => {
  const confirmationUrl = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Email Confirmation</Heading>
          <Text>Hello! Please confirm your email by clicking on the link.</Text>
          <Link href={confirmationUrl}>Confirm your email</Link>
          <Text>This link will expire in 1 hour.</Text>
          <Text>If you did not request this email, please ignore it.</Text>
          <Text>Thank you for using our service!</Text>
        </Body>
      </Html>
    </Tailwind>
  );
};
