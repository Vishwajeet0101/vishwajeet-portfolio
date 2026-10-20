import { MotionConfig } from 'framer-motion'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { useActiveSection } from './hooks/useActiveSection'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
// import { Services } from './sections/Services'
import { Skills } from './sections/Skills'

export default function App() {
  const activeSection = useActiveSection()

  return (
    // CSS media queries can't reach Framer's JS-driven animations, so the
    // reduced-motion preference has to be honoured here too.
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  )
}
