import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ProjectInviteEmailProps {
  email: string;
  invitedByFullName: string;
  invitedByEmail: string;
  projectName: string;
  inviteLink: string;
}

export default function ProjectInviteEmail({
  email,
  invitedByFullName,
  invitedByEmail,
  projectName,
  inviteLink,
}: ProjectInviteEmailProps) {
  const previewText = `Join ${projectName} on Feedbackthing`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-8">
              <Img
                src={'https://www.feedbackthing.pro/android-chrome-512x512.png'}
                width="40"
                height="40"
                alt="Feedbackthing"
                className="mx-auto my-0 rounded-md"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Join <strong>{projectName}</strong> on{' '}
              <strong>Feedbackthing</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{invitedByFullName}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{projectName}</strong> team on{' '}
              <strong>Feedbackthing</strong>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-md bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{' '}
              <span className="text-black">{email}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account&apos;s safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
