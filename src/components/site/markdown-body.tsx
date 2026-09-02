import Markdown from "react-markdown";

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="max-w-3xl space-y-4 text-foreground/85">
      <Markdown
        components={{
          h2: ({ children }) => <h2 className="font-display mt-10 text-2xl tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display mt-8 text-xl tracking-tight">{children}</h3>,
          p: ({ children }) => <p className="leading-7">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          a: ({ href, children }) => (
            <a href={href} className="text-accent underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
