export interface CitaIEEE {
  id: number;
  clave: string;
  autores: string;
  titulo: string;
  publicacion: string;
  anio: string;
  detalle?: string;
  url: string;
  nota?: string;
}

export const CITAS_IEEE: CitaIEEE[] = [
  {
    id: 1,
    clave: 'castillo-2025',
    autores: 'A. Castillo, J. E. Pérez, y cols.',
    titulo: 'Risk assessment of African swine fever introduction into Latin America and the Caribbean',
    publicacion: 'Frontiers in Veterinary Science',
    anio: '2025',
    detalle: 'vol. 12, art. 1587131',
    url: 'https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2025.1587131/full',
    nota: 'Clasifica 24 de 40 territorios evaluados en ALyC con riesgo de introducción desconocido por datos insuficientes, y riesgo probable en Colombia por importaciones informales.',
  },
  {
    id: 2,
    clave: 'woah-asf',
    autores: 'World Organisation for Animal Health (WOAH)',
    titulo: 'African Swine Fever (ASF) Portal and Technical Factsheet',
    publicacion: 'WOAH Animal Diseases',
    anio: '2024',
    url: 'https://www.woah.org/en/disease/african-swine-fever/',
    nota: 'En formas agudas la mortalidad puede alcanzar el 100%; formas subagudas y crónicas presentan menor tasa de mortalidad.',
  },
  {
    id: 3,
    clave: 'tuchin-2024',
    autores: 'D. C. Montero, R. Paternina, y cols.',
    titulo: 'Porcine cysticercosis in backyard pigs from Tuchín, Córdoba, Colombia',
    publicacion: 'Parasites & Vectors / PMC',
    anio: '2024',
    detalle: 'PMC11054264',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054264/',
    nota: 'Estudio local de 472 cerdos de traspatio muestreados en 2021 en Tuchín, Córdoba (Colombia), con seroprevalencia de 9.7%.',
  },
  {
    id: 4,
    clave: 'cooverride-coyaima',
    autores: 'G. Arboleda, M. Sánchez, y cols.',
    titulo: 'Seroprevalence of Taenia solium cysticercosis in swine and human populations of Coyaima, Tolima',
    publicacion: 'PubMed / Acta Tropica',
    anio: '2025',
    detalle: 'PMID: 40872264',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40872264/',
    nota: 'Estudio focal en Coyaima, Tolima: 14% de seroprevalencia en cerdos muestreados y 8.5% en humanos.',
  },
  {
    id: 5,
    clave: 'neurocisticercosis-col',
    autores: 'A. Flórez, A. Pastrán, y cols.',
    titulo: 'Spatial distribution and epidemiological characteristics of human cysticercosis in Colombia',
    publicacion: 'PLOS Neglected Tropical Diseases / PMC',
    anio: '2021',
    detalle: 'PMC8626945',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8626945/',
    nota: 'La neurocisticercosis por Taenia solium es una causa prevenible principal de crisis epilépticas en áreas endémicas.',
  },
  {
    id: 6,
    clave: 'who-data-gaps',
    autores: 'World Health Organization (WHO)',
    titulo: 'Improving data on Taenia solium infections',
    publicacion: 'WHO Neglected Tropical Diseases Activities',
    anio: '2023',
    url: 'https://www.who.int/activities/improving-data-on-taenia-solium-infections/improving-data-on-taenia-solium-infections',
    nota: 'Aborda la brecha global y regional de información epidemiológica y vigilancia One Health para T. solium.',
  },
  {
    id: 7,
    clave: 'who-endemicity',
    autores: 'World Health Organization (WHO)',
    titulo: 'Status of endemicity of Taenia solium',
    publicacion: 'Global Health Observatory (GHO)',
    anio: '2024',
    url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/status-of-endemicity-of-taenia-solium',
    nota: 'Mapa e indicadores de endemicidad mundial de teniasis/cisticercosis humana y porcina.',
  },
  {
    id: 8,
    clave: 'eurostat-pigs',
    autores: 'Statistical Office of the European Union (Eurostat)',
    titulo: 'Pig population - annual data (APRO_MT_LSPIG)',
    publicacion: 'European Commission Data Browser',
    anio: '2025',
    detalle: 'Censo 2025: 131.45 millones de cabezas (UE-27)',
    url: 'https://ec.europa.eu/eurostat/databrowser/view/APRO_MT_LSPIG__custom_23017560/default/table',
    nota: 'Inventario oficial de la Unión Europea (UE-27): 131,450,440 cabezas para 2025.',
  },
  {
    id: 9,
    clave: 'usda-nass-pigs',
    autores: 'National Agricultural Statistics Service (USDA NASS)',
    titulo: 'Hogs and Pigs Report',
    publicacion: 'United States Department of Agriculture',
    anio: '2026',
    detalle: 'Estimación al 1 de septiembre de 2026',
    url: 'https://data.nass.usda.gov/Newsroom/2026/09-24-2026.php',
    nota: 'Inventario de EE. UU. al 1 de septiembre de 2026: 74.3 millones de cerdos y cerdas.',
  },
  {
    id: 10,
    clave: 'colombia-censo',
    autores: 'Instituto Colombiano Agropecuario (ICA) / Porcinews',
    titulo: 'Censo Pecuario Nacional Porcino e informe del sector',
    publicacion: 'ICA & Porcinews',
    anio: '2024',
    detalle: 'Censo oficial 2024 (189,198 predios)',
    url: 'https://porcinews.com/colombia-el-censo-porcino-registra-mas-de-106-millones-de-animales-en-el-pais/',
    nota: 'Colombia registró 10,668,276 cabezas en 2024 según compilación del censo pecuario; el 78.4% corresponde a producción de traspatio.',
  },
];
