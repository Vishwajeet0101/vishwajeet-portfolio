import { MotionConfig } from 'framer-motion'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { useActiveSection } from './hooks/useActiveSection'
import { useTheme } from './hooks/useTheme'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  const { theme, toggle } = useTheme()
  const activeSection = useActiveSection()

  return (
    // CSS media queries can't reach Framer's JS-driven animations, so the
    // reduced-motion preference has to be honoured here too.
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggle} activeSection={activeSection} />
      <main className="font-body min-h-svh">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
