import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  return (
    <Html lang="ru">
      <Head />
      <Preview>Подтвердите email, чтобы войти в SwaggerHub</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logo}>SwaggerHub</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Подтвердите ваш email</Text>

            <Text style={text}>
              Вы создали аккаунт на SwaggerHub. Нажмите кнопку ниже, чтобы
              подтвердить адрес и начать работу.
            </Text>

            <Link href={confirmLink} style={button}>
              Подтвердить email
            </Link>

            <Text style={note}>
              Ссылка действительна 1 час. Если вы не регистрировались — просто
              проигнорируйте это письмо.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>SwaggerHub · API Documentation</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#FAFAF8',
  margin: '0',
  padding: '48px 24px',
};

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
};

const logoSection: React.CSSProperties = {
  marginBottom: '48px',
};

const logo: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '18px',
  fontWeight: '400',
  color: '#1A1A1A',
  letterSpacing: '0.02em',
  margin: '0',
};

const content: React.CSSProperties = {
  marginBottom: '56px',
};

const heading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  fontWeight: '400',
  color: '#1A1A1A',
  lineHeight: '1.25',
  margin: '0 0 20px',
  letterSpacing: '-0.02em',
};

const text: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '15px',
  lineHeight: '1.65',
  color: '#555550',
  margin: '0 0 32px',
};

const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#1A1A1A',
  color: '#FAFAF8',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  padding: '12px 28px',
  borderRadius: '3px',
  letterSpacing: '0.01em',
  marginBottom: '36px',
};

const note: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#999994',
  margin: '0',
};

const footer: React.CSSProperties = {
  borderTop: '1px solid #E8E8E4',
  paddingTop: '24px',
};

const footerText: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '12px',
  color: '#C4C4BC',
  margin: '0',
  letterSpacing: '0.02em',
};
