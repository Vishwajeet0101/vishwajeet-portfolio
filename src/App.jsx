import { MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { useActiveSection } from './hooks/useActiveSection'
import { usePath } from './lib/router'
import { startSmoothScroll } from './lib/smoothScroll'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
// import { Services } from './sections/Services'
import { Skills } from './sections/Skills'

// Visitors on the home page never download the blog's markdown renderer or
// the admin editor.
const BlogIndex = lazy(() => import('./pages/Blog').then((m) => ({ default: m.BlogIndex })))
const BlogPost = lazy(() => import('./pages/Blog').then((m) => ({ default: m.BlogPost })))
const Admin = lazy(() => import('./admin/Admin').then((m) => ({ default: m.Admin })))

function Home() {
  const activeSection = useActiveSection()

  return (
    <>
      <ScrollProgress />
      <Navbar activeSection={activeSection} />
      <main className="font-body min-h-svh">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        {/* Services ("What you can hire me for") is held back for now. To
            restore it: uncomment the import above and this line, re-enable
            the nav entry in constants.js, and put the section indexes back
            to Services 05 / Process 06 / Contact 07. */}
        {/* <Services /> */}
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function Page({ children }) {
  return (
    <>
      <Navbar activeSection={null} />
      <main className="font-body min-h-svh">
        <Suspense fallback={<div className="min-h-svh" />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const path = usePath().replace(/\/+$/, '') || '/'
  const isAdmin = path === '/admin' || path.startsWith('/admin/')

  // The admin is a form with its own scrolling textareas; native scrolling
  // suits it better than eased scrolling.
  useEffect(() => (isAdmin ? undefined : startSmoothScroll()), [isAdmin])

  let page
  if (isAdmin) {
    page = (
      <Suspense fallback={<div className="min-h-svh" />}>
        <Admin />
      </Suspense>
    )
  } else if (path === '/blog') {
    page = (
      <Page>
        <BlogIndex />
      </Page>
    )
  } else if (path.startsWith('/blog/')) {
    const slug = decodeURIComponent(path.slice('/blog/'.length))
    page = (
      <Page>
        <BlogPost key={slug} slug={slug} />
      </Page>
    )
  } else {
    page = <Home />
  }

  return (
    // CSS media queries can't reach Framer's JS-driven animations, so the
    // reduced-motion preference has to be honoured here too.
    <MotionConfig reducedMotion="user">{page}</MotionConfig>
  )
}
