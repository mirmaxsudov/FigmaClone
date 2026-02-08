import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Circle,
  Component,
  Github,
  Globe,
  Layers,
  Layout,
  MousePointer2,
  Palette,
  Plus,
  Square,
  Type,
  Zap
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const InteractiveDemo = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 6);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative h-full w-full overflow-hidden bg-slate-50/50'>
      {/* Grid background */}
      <div
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
        className='absolute inset-0 opacity-[0.03]'
      />

      {/* Canvas Elements */}
      <div className='relative h-full w-full p-8'>
        {/* Main Frame */}
        <div
          className={cn(
            'absolute border-2 border-purple-400 bg-white shadow-sm transition-all duration-1000 ease-in-out',
            step >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
          style={{
            height: '60%',
            left: '20%',
            top: '20%',
            width: '60%'
          }}
        >
          <div className='absolute -top-6 left-0 text-[10px] font-bold tracking-wider text-purple-400 uppercase'>
            Frame 1
          </div>

          {/* Header element */}
          <div
            className={cn(
              'absolute bg-slate-100 transition-all duration-700 ease-in-out',
              step >= 2 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            )}
            style={{
              height: '15%',
              left: '5%',
              top: '5%',
              width: '90%'
            }}
          />

          {/* Main Card */}
          <div
            className={cn(
              'absolute shadow-sm transition-all duration-1000 ease-in-out',
              step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
              step >= 4 ? 'bg-purple-600' : 'bg-blue-500'
            )}
            style={{
              height: '40%',
              left: '5%',
              top: '25%',
              width: '90%'
            }}
          >
            {/* Text lines inside card */}
            <div className='absolute top-4 right-4 left-4 h-1.5 rounded bg-white/20' />
            <div className='absolute top-7 left-4 h-1.5 w-1/2 rounded bg-white/20' />
          </div>

          {/* Floating Action Button */}
          <div
            className={cn(
              'absolute rounded-full bg-indigo-500 shadow-lg transition-all duration-700 ease-in-out',
              step >= 5 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
            style={{
              bottom: '10%',
              height: '40px',
              right: '10%',
              width: '40px'
            }}
          />
        </div>
      </div>

      {/* Animated Cursor */}
      <div
        style={{
          left:
            step === 0
              ? '10%'
              : step === 1
                ? '20%'
                : step === 2
                  ? '30%'
                  : step === 3
                    ? '40%'
                    : step === 4
                      ? '45%'
                      : '80%',
          top:
            step === 0
              ? '80%'
              : step === 1
                ? '20%'
                : step === 2
                  ? '25%'
                  : step === 3
                    ? '35%'
                    : step === 4
                      ? '40%'
                      : '85%'
        }}
        className='pointer-events-none absolute z-50 transition-all duration-1000 ease-in-out'
      >
        <MousePointer2 className='h-6 w-6 fill-white text-black drop-shadow-md' />
        <div className='mt-2 ml-4 rounded bg-purple-600 px-2 py-1 text-[10px] whitespace-nowrap text-white shadow-lg'>
          {step === 0 && 'Ready'}
          {step === 1 && 'Creating Frame...'}
          {step === 2 && 'Adding Content...'}
          {step === 3 && 'Styling...'}
          {step === 4 && 'Changing Colors'}
          {step === 5 && 'Finishing!'}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      {/* Header */}
      <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white'>
              <MousePointer2 className='h-5 w-5' />
            </div>
            <span className='text-xl font-bold tracking-tight'>Mockdock</span>
          </div>
          <nav className='hidden items-center gap-6 md:flex'>
            <a
              href='#features'
              className='text-sm font-medium transition-colors hover:text-purple-600'
            >
              Features
            </a>
            <a
              href='#tech-stack'
              className='text-sm font-medium transition-colors hover:text-purple-600'
            >
              Tech Stack
            </a>
            <Link
              className='text-sm font-medium transition-colors hover:text-purple-600'
              to='/figma'
            >
              App
            </Link>
          </nav>
          <div className='flex items-center gap-4'>
            <Button asChild className='hidden sm:flex' size='sm' variant='ghost'>
              <a href='https://github.com' rel='noreferrer' target='_blank'>
                <Github className='mr-2 h-4 w-4' />
                GitHub
              </a>
            </Button>
            <Button asChild className='bg-purple-600 hover:bg-purple-700' size='sm'>
              <Link to='/figma'>Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40'>
          {/* Background Decorations */}
          <div className='absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32'>
            <svg
              className='absolute top-0 left-0 h-full w-full opacity-20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1108 632'
            >
              <path d='M0.5 128.5L1107.5 128.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M0.5 256.5L1107.5 256.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M0.5 384.5L1107.5 384.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M0.5 512.5L1107.5 512.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M128.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M256.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M384.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M512.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M640.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M768.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M896.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
              <path d='M1024.5 0.5V631.5' stroke='currentColor' strokeOpacity='0.1' />
            </svg>
          </div>

          <div className='container mx-auto px-4 text-center'>
            <h1 className='mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl'>
              Design at the{' '}
              <span className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                speed of thought.
              </span>
            </h1>
            <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg sm:text-xl'>
              Mockdock is a lightweight, high-performance Figma clone built for the modern web.
              Create, prototype, and collaborate in a familiar interface.
            </p>
            <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
              <Button
                asChild
                className='h-12 bg-purple-600 px-8 text-lg hover:bg-purple-700'
                size='lg'
              >
                <Link to='/figma'>
                  Get Started for Free
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button asChild className='h-12 px-8 text-lg' size='lg' variant='outline'>
                <a href='#features'>Explore Features</a>
              </Button>
            </div>
          </div>
        </section>

        <section className='container mx-auto -mt-12 px-4 lg:-mt-20'>
          <div className='group bg-card relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-2 shadow-2xl'>
            <div className='absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 opacity-0 transition-opacity group-hover:opacity-100'></div>
            <div className='bg-background relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border shadow-inner'>
              <InteractiveDemo />

              {/* Top Toolbar Simulation */}
              <div className='bg-background/80 absolute top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-3 py-1.5 shadow-sm backdrop-blur'>
                <MousePointer2 className='h-4 w-4 text-purple-600' />
                <Square className='h-4 w-4 text-slate-400' />
                <Circle className='h-4 w-4 text-slate-400' />
                <Type className='h-4 w-4 text-slate-400' />
                <div className='bg-border mx-1 h-4 w-px' />
                <Plus className='h-4 w-4 text-slate-400' />
              </div>

              {/* Sidebars Simulation */}
              <div className='bg-background/50 absolute top-16 bottom-4 left-4 hidden w-48 rounded-lg border px-3 py-4 backdrop-blur md:block'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Layout className='h-3 w-3 text-purple-400' />
                    <div className='h-2 w-20 rounded bg-slate-200' />
                  </div>
                  <div className='ml-4 flex items-center gap-2'>
                    <Square className='h-3 w-3 text-blue-400' />
                    <div className='h-2 w-16 rounded bg-slate-200' />
                  </div>
                  <div className='ml-4 flex items-center gap-2'>
                    <Circle className='h-3 w-3 text-indigo-400' />
                    <div className='h-2 w-12 rounded bg-slate-200' />
                  </div>
                </div>
              </div>

              <div className='bg-background/50 absolute top-16 right-4 bottom-4 hidden w-64 rounded-lg border px-4 py-4 backdrop-blur lg:block'>
                <div className='space-y-4'>
                  <div className='mb-6 h-3 w-20 rounded bg-slate-200' />
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <div className='h-2 w-8 rounded bg-slate-100' />
                      <div className='h-2 w-12 rounded bg-slate-200' />
                    </div>
                    <div className='flex justify-between'>
                      <div className='h-2 w-8 rounded bg-slate-100' />
                      <div className='h-2 w-12 rounded bg-slate-200' />
                    </div>
                  </div>
                  <div className='bg-border my-4 h-px' />
                  <div className='space-y-2'>
                    <div className='h-2 w-12 rounded bg-slate-100' />
                    <div className='flex gap-2'>
                      <div className='h-6 w-6 rounded border bg-purple-600' />
                      <div className='bg-background h-6 flex-1 rounded border' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='bg-muted/30 py-24' id='features'>
          <div className='container mx-auto px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Everything you need to design.
              </h2>
              <p className='text-muted-foreground mt-4'>
                Powerful features packed in a lightweight package.
              </p>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              <FeatureCard
                title='Interactive Canvas'
                description='Smooth zoom, pan, and selection experience. Built for high performance.'
                icon={<MousePointer2 className='h-6 w-6 text-purple-600' />}
              />
              <FeatureCard
                title='Smart Layouts'
                description='Use frames and constraints to build responsive designs effortlessly.'
                icon={<Layout className='h-6 w-6 text-purple-600' />}
              />
              <FeatureCard
                title='Master Components'
                description='Create reusable components and manage instances with ease.'
                icon={<Component className='h-6 w-6 text-purple-600' />}
              />
              <FeatureCard
                title='Multi-language'
                description='Full i18n support with Lingui. Design for a global audience.'
                icon={<Globe className='h-6 w-6 text-purple-600' />}
              />
              <FeatureCard
                title='Layer Management'
                description='Organize your design with a powerful layers panel and nesting support.'
                icon={<Layers className='h-6 w-6 text-purple-600' />}
              />
              <FeatureCard
                title='Advanced Styling'
                description='Fine-tune every property: fills, strokes, opacity, and typography.'
                icon={<Palette className='h-6 w-6 text-purple-600' />}
              />
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className='py-24' id='tech-stack'>
          <div className='container mx-auto px-4'>
            <div className='mb-12 flex flex-col items-center gap-4 text-center'>
              <h2 className='text-3xl font-bold'>Built with Modern Tech Stack</h2>
              <p className='text-muted-foreground max-w-[700px]'>
                Mockdock leverages the latest technologies for maximum performance and developer
                experience.
              </p>
            </div>
            <div className='flex flex-wrap justify-center gap-8 opacity-70 transition-all duration-500 hover:grayscale-0 md:gap-16 lg:grayscale'>
              <TechItem name='React 19' />
              <TechItem name='Vite' />
              <TechItem name='TanStack Router' />
              <TechItem name='TanStack Query' />
              <TechItem name='Tailwind CSS 4' />
              <TechItem name='Radix UI' />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-24'>
          <div className='container mx-auto px-4'>
            <div className='relative overflow-hidden rounded-3xl bg-purple-600 p-8 text-center text-white md:p-16'>
              {/* Decorative circles */}
              <div className='absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl'></div>
              <div className='absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-900/20 blur-3xl'></div>

              <h2 className='mb-6 text-3xl font-bold md:text-5xl'>Ready to start designing?</h2>
              <p className='mx-auto mb-10 max-w-2xl text-lg text-purple-100'>
                Join thousands of designers and developers using Mockdock to bring their ideas to
                life.
              </p>
              <Button
                asChild
                className='h-14 bg-white px-10 text-xl font-semibold text-purple-600 hover:bg-purple-50'
                size='lg'
              >
                <Link to='/figma'>Launch Mockdock Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t py-12'>
        <div className='container mx-auto flex flex-col items-center justify-between gap-8 px-4 md:flex-row'>
          <div className='flex items-center gap-2'>
            <MousePointer2 className='h-6 w-6 text-purple-600' />
            <span className='text-xl font-bold'>Mockdock</span>
          </div>
          <p className='text-muted-foreground text-sm'>
            © {new Date().getFullYear()} Mockdock. Built with ❤️ for the design community.
          </p>
          <div className='flex items-center gap-4'>
            <Button asChild size='icon' variant='ghost'>
              <a href='https://github.com' rel='noreferrer' target='_blank'>
                <Github className='h-5 w-5' />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <div className='group bg-background relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg'>
      <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 transition-colors group-hover:bg-purple-100'>
        {icon}
      </div>
      <h3 className='mb-2 text-xl font-bold'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
};

const TechItem = ({ name }: { name: string }) => {
  return (
    <div className='flex items-center gap-2 text-xl font-semibold'>
      <Zap className='h-6 w-6 text-purple-600' />
      {name}
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: LandingPage
});
