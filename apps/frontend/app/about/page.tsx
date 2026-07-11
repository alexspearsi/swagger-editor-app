import type { Metadata } from 'next';
import NextLink from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About — SwaggerUI',
};

const FRONTEND_STACK = [
  'Next.js 16 (App Router)',
  'React 19',
  'TypeScript',
  'Tailwind CSS 4',
  'HeroUI',
  'Monaco Editor',
  'React Hook Form',
  'Zod',
];

const BACKEND_STACK = ['NestJS', 'Prisma', 'PostgreSQL (Neon)', 'Passport JWT', 'Resend'];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="text-gray-600 leading-relaxed">
          This application was built as a graded assignment for{' '}
          <a
            href="https://rs.school"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            RS School
          </a>{' '}
          — a free online JavaScript and Frontend development course. The goal was to create a
          full-featured Swagger/OpenAPI editor and REST client with authentication, request history,
          and schema persistence.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Team</h2>
        <div className="rounded-xl border bg-white p-6 flex items-center gap-5">
          <Image
            src="https://avatars.githubusercontent.com/alexspearsi"
            alt="Alex Spears"
            width={72}
            height={72}
            className="rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <p className="font-medium">Alexander Strelchenko</p>
            <p className="text-sm text-gray-500">Fullstack Developer</p>
          </div>
          <a
            href="https://github.com/alexspearsi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 underline transition-colors"
          >
            @alexspearsi
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">Frontend</p>
            <ul className="flex flex-wrap gap-2">
              {FRONTEND_STACK.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">Backend</p>
            <ul className="flex flex-wrap gap-2">
              {BACKEND_STACK.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Course</h2>
        <p className="text-gray-600 leading-relaxed">
          <a
            href="https://rs.school"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            RS School
          </a>{' '}
          is a free community-driven learning initiative with mentorship, code reviews, and
          real-world assignments. This project is part of the React course.
        </p>
      </section>

      <div>
        <NextLink
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 underline transition-colors"
        >
          ← Back to editor
        </NextLink>
      </div>
    </div>
  );
}
