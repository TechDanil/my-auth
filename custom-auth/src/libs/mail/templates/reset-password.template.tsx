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
  readonly domain: string;
  readonly token: string;
};

export const ResetPasswordTemplate = ({
  domain,
  token,
}: Props): JSX.Element => {
  const confirmationUrl = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Password reset</Heading>
          <Text>
            Hello! You have requested a password reset. Please click on the link
            below to reset your password.
          </Text>
          <Link href={confirmationUrl}>Reset your password</Link>
          <Text>This link will expire in 1 hour.</Text>
          <Text>
            If you did not request a password reset, please ignore this message.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
};
