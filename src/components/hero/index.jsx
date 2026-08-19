import { useSite } from '@/lib/site'
import HeroGlass from './HeroGlass'
import HeroHeritage from './HeroHeritage'
import HeroNoir from './HeroNoir'

// L'intestazione è l'elemento che definisce l'identità del sito:
// è l'unica parte con tre implementazioni davvero separate.
const HEROES = { glass: HeroGlass, heritage: HeroHeritage, noir: HeroNoir }

export default function Hero() {
  const { themeId } = useSite()
  const Comp = HEROES[themeId] || HeroGlass
  return <Comp />
}
