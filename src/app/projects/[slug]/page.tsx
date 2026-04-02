import { notFound } from 'next/navigation';
import { ProjectCaseStudyClient } from '../../../components/portfolio/ProjectCaseStudyClient';
import { portfolio } from '../../../data/portfolio';

export function generateStaticParams() {
  return Object.keys(portfolio.projectsBySlug).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = portfolio.projectsBySlug[params.slug as keyof typeof portfolio.projectsBySlug];

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudyClient slug={params.slug} />;
}
