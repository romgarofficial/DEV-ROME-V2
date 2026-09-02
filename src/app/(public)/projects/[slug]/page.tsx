import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MediaFrame } from "@/components/site/media-frame";
import { MarkdownBody } from "@/components/site/markdown-body";
import { MediaReveal } from "@/lib/motion";
import { getProjectBySlug } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 pt-24 pb-28 sm:px-6 lg:pr-40 lg:pb-16">
      <p className="text-[11px] tracking-[0.28em] text-muted uppercase">Project</p>
      <Link
        href="/#projects"
        data-cursor="invert"
        className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>
      <h1 className="font-display mt-8 text-4xl leading-[1.05] md:text-6xl">{project.title}</h1>
      {project.summary ? <p className="mt-6 text-lg leading-8 text-muted">{project.summary}</p> : null}
      <MediaReveal className="mt-10">
        <MediaFrame
          src={project.coverUrl}
          alt={project.title}
          label="Project cover"
          className="aspect-[16/8] w-full"
          sizes="100vw"
        />
      </MediaReveal>
      <div className="mt-6 flex flex-wrap gap-5 text-sm">
        {project.liveUrl ? (
          <a href={project.liveUrl} data-cursor="invert" className="text-accent hover:underline" target="_blank" rel="noreferrer">
            Live site
          </a>
        ) : null}
        {project.repoUrl ? (
          <a href={project.repoUrl} data-cursor="invert" className="text-accent hover:underline" target="_blank" rel="noreferrer">
            Repository
          </a>
        ) : null}
      </div>
      {project.stack?.length ? (
        <p className="mt-6 text-[11px] tracking-[0.16em] text-muted uppercase">{project.stack.join("  ·  ")}</p>
      ) : null}
      {project.description ? (
        <div className="mt-10">
          <MarkdownBody>{project.description}</MarkdownBody>
        </div>
      ) : null}
    </article>
  );
}
