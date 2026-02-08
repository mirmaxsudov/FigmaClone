import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRightIcon,
  CheckCircle2,
  ChevronDown,
  CircleIcon,
  Component,
  Cpu,
  GithubIcon,
  Globe,
  Layers,
  Layers2,
  Layout,
  MessageSquare,
  MousePointer2,
  Palette,
  Plus,
  ShieldCheck,
  Square,
  Star,
  Twitter,
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
      setStep((s) => (s + 1) % 8);
    }, 2500);
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

      <div className='relative h-full w-full p-8'>
        <div
          className={cn(
            'absolute border-2 border-purple-400 bg-white shadow-sm transition-all duration-1000 ease-in-out',
            step >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
          style={{
            height: '65%',
            left: '20%',
            top: '18%',
            width: '60%'
          }}
        >
          <div className='absolute -top-6 left-0 text-[10px] font-bold tracking-wider text-purple-400 uppercase'>
            Mobile App
          </div>
          <div
            className={cn(
              'absolute bg-slate-100 transition-all duration-700 ease-in-out',
              step >= 2 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            )}
            style={{
              height: '12%',
              left: '5%',
              top: '5%',
              width: '90%'
            }}
          >
            <div className='absolute top-1/2 left-4 h-1 w-12 -translate-y-1/2 rounded bg-slate-300' />
            <div className='absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-300' />
          </div>

          {/* Main Content Card */}
          <div
            className={cn(
              'absolute shadow-sm transition-all duration-1000 ease-in-out',
              step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
              step >= 4 ? 'bg-purple-600' : 'bg-blue-500'
            )}
            style={{
              height: '45%',
              left: '5%',
              top: '20%',
              width: '90%'
            }}
          >
            {/* Text lines inside card */}
            <div className='absolute top-4 right-4 left-4 h-1.5 rounded bg-white/20' />
            <div className='absolute top-7 left-4 h-1.5 w-1/2 rounded bg-white/20' />

            {/* Component Icon Simulation */}
            <div
              className={cn(
                'absolute right-4 bottom-4 transition-opacity duration-500',
                step >= 5 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Component className='h-4 w-4 text-white/50' />
            </div>
          </div>

          {/* Floating Action Button / Instance */}
          <div
            className={cn(
              'absolute rounded-full shadow-lg transition-all duration-700 ease-in-out',
              step >= 6 ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
              step >= 7 ? 'bg-indigo-600' : 'bg-indigo-500'
            )}
            style={{
              bottom: '8%',
              height: '44px',
              right: '8%',
              width: '44px'
            }}
          >
            <Plus className='absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white' />

            {/* Prototyping Arrow Simulation */}
            {step === 7 && (
              <svg
                className='absolute -top-24 -left-24 h-32 w-32 overflow-visible'
                viewBox='0 0 100 100'
              >
                <path
                  className='animate-dash'
                  d='M100 100 C 50 100, 50 20, 0 20'
                  fill='none'
                  stroke='#3b82f6'
                  strokeDasharray='4 2'
                  strokeWidth='2'
                />
                <circle cx='0' cy='20' fill='#3b82f6' r='3' />
              </svg>
            )}
          </div>
        </div>

        {/* Component Library Simulation */}
        <div
          className={cn(
            'absolute top-1/2 right-8 h-32 w-24 -translate-y-1/2 rounded-lg border bg-white p-2 shadow-md transition-all duration-700',
            step >= 6 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          )}
        >
          <div className='mb-2 text-[8px] font-bold text-slate-400 uppercase'>Assets</div>
          <div className='space-y-2'>
            <div className='flex items-center gap-1 rounded bg-purple-50 p-1'>
              <Component className='h-2 w-2 text-purple-600' />
              <div className='h-1 w-10 rounded bg-purple-200' />
            </div>
          </div>
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
                      : step === 5
                        ? '50%'
                        : step === 6
                          ? '80%'
                          : '75%',
          top:
            step === 0
              ? '80%'
              : step === 1
                ? '18%'
                : step === 2
                  ? '23%'
                  : step === 3
                    ? '35%'
                    : step === 4
                      ? '40%'
                      : step === 5
                        ? '55%'
                        : step === 6
                          ? '85%'
                          : '80%'
        }}
        className='pointer-events-none absolute z-50 transition-all duration-1000 ease-in-out'
      >
        <MousePointer2 className='h-6 w-6 fill-white text-black drop-shadow-md' />
        <div className='mt-2 ml-4 rounded bg-purple-600 px-2 py-1 text-[10px] whitespace-nowrap text-white shadow-lg'>
          {step === 0 && 'Select Tool'}
          {step === 1 && 'Create Frame'}
          {step === 2 && 'Insert Header'}
          {step === 3 && 'Draw Card'}
          {step === 4 && 'Adjust Fill'}
          {step === 5 && 'Create Component'}
          {step === 6 && 'Drag Instance'}
          {step === 7 && 'Add Interaction'}
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -6;
          }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
      `}</style>
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
                <GithubIcon className='mr-2 h-4 w-4' />
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
                  <ArrowRightIcon className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button asChild className='h-12 px-8 text-lg' size='lg' variant='outline'>
                <a href='#features'>Explore Features</a>
              </Button>
            </div>

            {/* Trusted By Section */}
            <div className='mt-24'>
              <p className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                Trusted by modern design teams
              </p>
              <div className='mt-8 flex flex-wrap justify-center gap-8 opacity-40 grayscale md:gap-16'>
                <div className='flex items-center gap-2 text-xl font-black'>
                  <Cpu className='h-6 w-6' /> TECHFLOW
                </div>
                <div className='flex items-center gap-2 text-xl font-black'>
                  <ShieldCheck className='h-6 w-6' /> SECURELY
                </div>
                <div className='flex items-center gap-2 text-xl font-black'>
                  <Globe className='h-6 w-6' /> GLOBEX
                </div>
                <div className='flex items-center gap-2 text-xl font-black'>
                  <Zap className='h-6 w-6' /> VELOCITY
                </div>
              </div>
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
                <CircleIcon className='h-4 w-4 text-slate-400' />
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
                    <CircleIcon className='h-3 w-3 text-indigo-400' />
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
        <section className='border-y bg-slate-50/50 py-24' id='tech-stack'>
          <div className='container mx-auto px-4'>
            <div className='mb-12 flex flex-col items-center gap-4 text-center'>
              <h2 className='text-3xl font-bold'>Built with Modern Tech Stack</h2>
              <p className='text-muted-foreground max-w-[700px]'>
                Mockdock leverages the latest technologies for maximum performance and developer
                experience.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6'>
              <TechItem name='React 19' />
              <TechItem name='Vite' />
              <TechItem name='TanStack' />
              <TechItem name='Tailwind 4' />
              <TechItem name='Radix UI' />
              <TechItem name='Lingui' />
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className='py-24'>
          <div className='container mx-auto px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Streamlined Design Workflow
              </h2>
              <p className='text-muted-foreground mt-4'>
                From concept to high-fidelity prototype in minutes.
              </p>
            </div>

            <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
              <div className='space-y-8'>
                <div className='flex gap-6'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 font-bold text-white shadow-lg shadow-purple-200'>
                    1
                  </div>
                  <div>
                    <h3 className='mb-2 text-xl font-bold'>Design on the Canvas</h3>
                    <p className='text-muted-foreground'>
                      Start with a blank canvas or import frames. Use our intuitive tools to draw
                      shapes, add text, and style elements with precision.
                    </p>
                  </div>
                </div>
                <div className='flex gap-6'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-200'>
                    2
                  </div>
                  <div>
                    <h3 className='mb-2 text-xl font-bold'>Componentize Everything</h3>
                    <p className='text-muted-foreground'>
                      Turn any element into a master component. Update the source and see changes
                      reflect across all instances instantly.
                    </p>
                  </div>
                </div>
                <div className='flex gap-6'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200'>
                    3
                  </div>
                  <div>
                    <h3 className='mb-2 text-xl font-bold'>Interactive Prototyping</h3>
                    <p className='text-muted-foreground'>
                      Link frames together to create interactive flows. Demonstrate how your app
                      works before writing a single line of code.
                    </p>
                  </div>
                </div>
              </div>
              <div className='relative overflow-hidden rounded-3xl border bg-slate-100 p-4 shadow-xl'>
                <div className='aspect-video rounded-2xl bg-white shadow-sm'>
                  <div className='flex h-full items-center justify-center'>
                    <div className='text-center'>
                      <Layers2 className='mx-auto h-12 w-12 text-slate-300' />
                      <p className='mt-4 text-sm font-medium text-slate-400'>
                        Workspace Visualization
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className='bg-muted/30 py-24'>
          <div className='container mx-auto px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Loved by designers</h2>
              <p className='text-muted-foreground mt-4'>
                Join our growing community of creative professionals.
              </p>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <TestimonialCard
                author='Sarah Jenkins'
                content="Mockdock has completely changed how I rapid-prototype. It's so fast and lightweight compared to other tools."
                role='Senior Product Designer'
              />
              <TestimonialCard
                author='Michael Chen'
                content='The SVG export is pristine. It makes handoff and asset management a breeze for our development team.'
                role='Frontend Engineer'
              />
              <TestimonialCard
                author='Elena Rodriguez'
                content='Perfect for quick wireframing and user testing flows. The master components system is surprisingly robust.'
                role='UX Researcher'
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className='py-24' id='pricing'>
          <div className='container mx-auto px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Simple, transparent pricing
              </h2>
              <p className='text-muted-foreground mt-4'>Choose the plan that fits your team.</p>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'>
              <PricingCard
                features={[
                  'Unlimited projects',
                  'Basic export',
                  '3 master components',
                  'Community support'
                ]}
                cta='Get Started'
                price='$0'
                title='Free'
                variant='outline'
                description='Perfect for individuals starting out.'
              />
              <PricingCard
                highlight
                features={[
                  'Unlimited components',
                  'SVG & JSON export',
                  'Advanced prototyping',
                  'Priority support',
                  'Shared libraries'
                ]}
                cta='Upgrade to Pro'
                price='$12'
                title='Pro'
                variant='default'
                description='For professional designers and teams.'
              />
              <PricingCard
                features={[
                  'SSO & Advanced Security',
                  'Custom integrations',
                  'Dedicated account manager',
                  'Training & Onboarding'
                ]}
                cta='Contact Sales'
                price='Custom'
                title='Enterprise'
                variant='outline'
                description='Bespoke solutions for large organizations.'
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className='bg-slate-50/50 py-24'>
          <div className='container mx-auto max-w-3xl px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight'>Frequently Asked Questions</h2>
            </div>
            <div className='space-y-4'>
              <FaqItem
                answer='Yes! The basic version of Mockdock is completely free for individual use. We offer a Pro plan for teams and advanced features.'
                question='Is Mockdock really free?'
              />
              <FaqItem
                answer='Currently, we support basic JSON imports. We are working on a more robust Figma (.fig) importer for future releases.'
                question='Can I import my Figma files?'
              />
              <FaqItem
                answer='Mockdock is a web-first application, but it uses local storage to ensure your work is saved even if you lose connection briefly.'
                question='Does it work offline?'
              />
              <FaqItem
                answer='Pro users can share project links with team members. Changes are synchronized in real-time.'
                question='How do I collaborate with my team?'
              />
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
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5'>
            <div className='col-span-2 lg:col-span-2'>
              <div className='flex items-center gap-2'>
                <MousePointer2 className='h-6 w-6 text-purple-600' />
                <span className='text-xl font-bold'>Mockdock</span>
              </div>
              <p className='text-muted-foreground mt-4 max-w-xs text-sm'>
                The next generation design tool built for performance and simplicity. Empowering
                creative teams around the globe.
              </p>
              <div className='mt-6 flex items-center gap-4'>
                <Button asChild size='icon' variant='ghost'>
                  <a href='https://github.com' rel='noreferrer' target='_blank'>
                    <GithubIcon className='h-5 w-5' />
                  </a>
                </Button>
                <Button asChild size='icon' variant='ghost'>
                  <a href='https://twitter.com' rel='noreferrer' target='_blank'>
                    <Twitter className='h-5 w-5 text-slate-400' />
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h4 className='mb-4 text-sm font-bold uppercase'>Product</h4>
              <ul className='space-y-2 text-sm text-slate-500'>
                <li>
                  <a href='#features' className='hover:text-purple-600'>
                    Features
                  </a>
                </li>
                <li>
                  <a href='#pricing' className='hover:text-purple-600'>
                    Pricing
                  </a>
                </li>
                <li>
                  <Link className='hover:text-purple-600' to='/figma'>
                    Launch App
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-sm font-bold uppercase'>Resources</h4>
              <ul className='space-y-2 text-sm text-slate-500'>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-sm font-bold uppercase'>Legal</h4>
              <ul className='space-y-2 text-sm text-slate-500'>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Terms
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-purple-600'>
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 border-t pt-8 text-center'>
            <p className='text-muted-foreground text-sm'>
              © {new Date().getFullYear()} Mockdock. Built with ❤️ for the design community.
            </p>
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
    <div className='group bg-background relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl'>
      <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-50 transition-transform group-hover:scale-150' />
      <div className='relative'>
        <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 transition-colors group-hover:bg-purple-600 group-hover:text-white'>
          {icon}
        </div>
        <h3 className='mb-2 text-xl font-bold'>{title}</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  author,
  role,
  content
}: {
  author: string;
  content: string;
  role: string;
}) => {
  return (
    <div className='bg-background flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md'>
      <div className='mb-6 flex gap-1'>
        {[...Array.from({ length: 5 })].map((_, i) => (
          <Star key={i} className='h-4 w-4 fill-yellow-400 text-yellow-400' />
        ))}
      </div>
      <p className='mb-8 flex-1 text-slate-600 italic'>"{content}"</p>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600'>
          {author[0]}
        </div>
        <div>
          <div className='text-sm font-bold'>{author}</div>
          <div className='text-xs text-slate-500'>{role}</div>
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  cta,
  variant = 'default',
  highlight = false
}: {
  cta: string;
  description: string;
  features: string[];
  highlight?: boolean;
  price: string;
  title: string;
  variant?: 'default' | 'outline';
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border p-8 transition-all hover:shadow-lg',
        highlight ? 'scale-105 border-purple-500 bg-white shadow-xl' : 'bg-slate-50/50'
      )}
    >
      {highlight && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-500 px-4 py-1 text-xs font-bold text-white uppercase'>
          Most Popular
        </div>
      )}
      <div className='mb-8'>
        <h3 className='text-lg font-bold'>{title}</h3>
        <div className='mt-4 flex items-baseline gap-1'>
          <span className='text-4xl font-bold'>{price}</span>
          {price !== 'Custom' && <span className='text-slate-500'>/month</span>}
        </div>
        <p className='mt-4 text-sm text-slate-500'>{description}</p>
      </div>
      <ul className='mb-8 flex-1 space-y-3'>
        {features.map((feature, i) => (
          <li key={i} className='flex items-center gap-3 text-sm'>
            <CheckCircle2 className='h-4 w-4 text-purple-600' />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={cn('h-12 w-full font-bold', highlight && 'bg-purple-600 hover:bg-purple-700')}
        variant={variant}
      >
        <Link to='/figma'>{cta}</Link>
      </Button>
    </div>
  );
};

const FaqItem = ({ question, answer }: { answer: string; question: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='overflow-hidden rounded-xl border bg-white transition-all'>
      <button
        className='flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='font-bold'>{question}</span>
        <ChevronDown
          className={cn('h-5 w-5 text-slate-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className='border-t p-6 text-slate-600'>{answer}</div>
      </div>
    </div>
  );
};

const TechItem = ({ name }: { name: string }) => {
  return (
    <div className='flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md'>
      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50'>
        {name === 'React 19' && <Cpu className='h-6 w-6 text-blue-500' />}
        {name === 'Vite' && <Zap className='h-6 w-6 text-yellow-500' />}
        {name === 'TanStack' && <Layers className='h-6 w-6 text-red-500' />}
        {name === 'Tailwind 4' && <Palette className='h-6 w-6 text-teal-500' />}
        {name === 'Radix UI' && <MessageSquare className='h-6 w-6 text-indigo-500' />}
        {name === 'Lingui' && <Globe className='h-6 w-6 text-orange-500' />}
      </div>
      <span className='text-sm font-bold'>{name}</span>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: LandingPage
});
