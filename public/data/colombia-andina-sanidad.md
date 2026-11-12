# Evidencia Sanitaria y Vigilancia Epidemiológica Porcina (Colombia y Región Andina)
**Versión de Datos:** `0.0.1` | **Fecha:** Noviembre 2026 | **Proyecto:** Porco Observatory

---

## 1. Contexto y Tesis de Porco: Los Datos en la Era de la IA

> **Sin datos verificados, estructurados y contextualizados, la IA no puede resolver problemas de salud pública ni bioseguridad agropecuaria.**

En América Latina, la información sanitaria existe pero se encuentra atrapada en cuatro silos aislados:
1. **Boletines y dashboards estáticos en PDF / PowerBI embebido:** (ej. AnalítICA del ICA, SENASICA en México, SENASA en Argentina, SAG en Chile).
2. **Plataformas internacionales tabulares sin API pública abierta:** (OMSA WAHIS, FAO EMPRES-i+).
3. **Portales de datos abiertos desconectados de la vigilancia en tiempo real:** (datos.gov.co de MinSalud con RIPS congelado en 2021).
4. **Artículos científicos revisados por pares:** Son la única fuente real para filogenia molecular, prevalencia comunitaria en cerdos de traspatio y cisticercosis humana/porcina, pero no se comunican con los sistemas del Estado.

Porco unifica estos registros bajo un modelo de evidencia auditable, donde cada dato conserva su unidad de medida, población muestreada, metodología y limitaciones.

---

## 2. Radiografía de Fuentes Oficiales en Colombia: El Caso AnalítICA

### Fuente: ICA (Instituto Colombiano Agropecuario) — Tablero AnalítICA (PowerBI) 2026
* **Especie:** Porcinos.
* **Cobertura temporal:** Año 2026 (consolidado activo).
* **N° de Episodios reportados:** 241 episodios.
* **N° de Animales por especie afectada:** ~11.000 cerdos.
* **Diagnósticos Finales Oficiales:**
  * `NEGATIVO PPC` (Peste Porcina Clásica): 205 episodios (85.1%).
  * `EN PROCESO CS` (Cuadro Síndrome): 26 episodios (10.8%).
  * `EN PROCESO CS - RES` (Respiratorio): 5 episodios.
  * `EN PROCESO CS - N` (Nervioso): 2 episodios.
  * `EN PROCESO CS - D` (Digestivo): 1 episodio.
  * `EN PROCESO REP` (Reproductivo): 1 episodio.
  * `NEGATIVO BRUCELOSIS`: 1 episodio.
* **Canales de Notificación:**
  * Propietario: 112 episodios.
  * Sensor (veterinarios y técnicos de campo): 73 episodios.
  * Terceros: 50 episodios.
  * Vigilancia Activa institucional: 5 episodios.
  * Vigilancia: 1 episodio.
* **Distribución de Cuadros Clínicos:**
  * Cuadro respiratorio/sistémico: 147 (61.0%).
  * Síndrome digestivo: 27 (11.2%).
  * Otros cuadros clínicos: 24 (10.0%), 20 (8.3%), 15 (6.2%), 1 (0.4%).

### El Hallazgo Crítico del ICA:
1. El ICA concentra sus recursos de laboratorio en descartar **PPC** (enfermedad de control oficial con reconocimiento OMSA) y monitorear el riesgo exótico de **PPA**.
2. **Cero vigilancia predial para Cisticercosis:** La cisticercosis porcina por *Taenia solium* no forma parte de los diagnósticos de campo del ICA ni genera reportes en AnalítICA. Solo se pesquisa post-mortem en frigoríficos formales por el INVIMA.
3. **El Punto Ciego:** El 78.4% de los predios porcinos en Colombia son de traspatio informal; los cerdos nacen, se crían y se faenan sin pasar por ningún registro del ICA ni del INVIMA.

---

## 3. Matriz Epidemiológica Comparada: Región Andina y Cono Sur

### A. Enfermedades Exclusivas de Cerdos (No Zoonóticas)

| Subregión / País | PPC (Peste Porcina Clásica) | PPA (Peste Porcina Africana) | PRRS, PEDv y PCV2/3 |
| :--- | :--- | :--- | :--- |
| **Colombia** | Zonificación OMSA: 3 zonas libres; resto en vigilancia/vacunación | **Libre** (vigilancia preventiva de importaciones) | PRRS y PCV2/3 presentes; PEDv endémica |
| **Bolivia** | Santa Cruz libre oficial OMSA (mayo 2026); resto endémico | **Libre** | PCV2/3 presente; PRRS reporte focal |
| **Ecuador** | Solo Islas Galápagos libre oficial; continental endémico | **Libre** | PRRS, PEDv y PCV2/3 presentes en granjas |
| **Perú** | Sin estatus oficial de libre; programa nacional en curso | **Libre** | PRRS y PCV2/3 endémicos en cuencas porcinas |
| **Venezuela** | Endémica / Sin estatus oficial OMSA | **Libre** | Datos limitados en boletines oficiales |
| **México** | **Libre oficial OMSA** | **Libre** (vigilancia preventiva) | Endémicas comerciales (PRRS, PEDv, PCV2/3) |
| **Centroamérica** | Costa Rica libre OMSA; Belice, El Salvador, Honduras, Nicaragua y Panamá libres OIRSA; Guatemala en erradicación | **Libre en toda la subregión** | PRRS y PCV2/3 presentes en varios países |
| **Caribe (La Española)**| Endémica en Haití y Rep. Dominicana | **AFECTADOS: Brotes activos en Rep. Dominicana y Haití desde 2021** | PRRS, PEDv (Rep. Dominicana) y PCV2/3 |
| **Cono Sur (Arg, Bra, Chi, Par, Uru)** | Libres OMSA: Argentina, Chile, Paraguay, Uruguay. Brasil: Sur/Sudeste libre; Norte no libre | **Libre en toda la subregión** | Chile libre de PRRS y PEDv. Arg/Uru libres de PRRS clínico. Brasil: PRRS en zonas intensivas |

### B. Enfermedades Zoonóticas (Cerdos y Humanos - Enfoque One Health)

* **Cisticercosis / Teniasis (*Taenia solium*):**
  * *Estado:* Endémica en porcicultura rural y de traspatio en la Región Andina (Perú, Bolivia, Ecuador, zonas rurales de Colombia: Tuchín 9.7%, Coyaima 14%), México y Centroamérica. Prácticamente inexistente en granjas tecnificadas.
  * *Causa raíz:* Cerdos de traspatio libres + defecación al aire libre + ausencia de letrinas + faenado clandestino.
* **Influenza Porcina (H1N1, H1N2, H3N2) y Erisipela (*Erysipelothrix rhusiopathiae*):**
  * *Estado:* Endémicas en prácticamente todos los países porcicultores de América Latina.
* **Triquinelosis (*Trichinella spiralis*):**
  * *Estado:* Focalizada en el Cono Sur (Argentina y Chile). Ciclos silvestres y sinantrópicos; control obligatorio en frigoríficos y chacinados artesanales.
* **Brucelosis Porcina (*Brucella suis*):**
  * *Estado:* Reportes irregulares en sistemas tradicionales de Colombia, Argentina, México y Brasil.
* **Hepatitis E (HEV Genotipo 3):**
  * *Estado:* Zoonosis alimentaria emergente documentada en Colombia, Brasil, México, Argentina, Chile y Uruguay por consumo de carne o vísceras insuficientemente cocidas.

---

## 4. Oportunidades de Negocio B2B para Porco (Monetización)

1. **Porco Radar B2B (Early Warning Territorial):**
   * *Cliente:* Gremios (Porkcolombia, ASOPORCEL), grandes integradoras porcinas y fondos ganaderos.
   * *Propuesta:* Mapeo predictivo municipal que cruza % de predios de traspatio (ICA), eventos respiratorios sin diagnóstico específico (AnalítICA) y rutas de contrabando fronterizo. Alerta temprana antes de que un virus llegue a galpones tecnificados.
2. **Audit-as-a-Service (Certificación de Trazabilidad One Health):**
   * *Cliente:* Frigoríficos exportadores (Decreto 1500 INVIMA).
   * *Propuesta:* Dossier digital auditable bajo formato IEEE / OMSA que certifica que las zonas de acopio de la planta provienen de municipios libres de focos comunitarios de cisticercosis y triquinelosis.
3. **Data Feed API / MCP Enterprise:**
   * *Cliente:* Farmacéuticas y laboratorios de sanidad animal (Boehringer Ingelheim, MSD, Zoetis).
   * *Propuesta:* Feed estructurado en JSON/API que mapea prevalencia real por municipio para dimensionar demanda de biológicos, antiparasitarios y vacunas.
