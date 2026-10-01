# BMW de segunda mano (Touring y X3): mercado, fichas, fiabilidad, costes e importación desde Alemania

Investigación hecha el **1 de octubre de 2026**. Salvo que se diga otra cosa, **todas las fuentes se consultaron ese día** ("consultado 2026-10-01").

Convenciones (las mismas que en `coches.md` y `fiscalidad-y-finanzas.md`):

- **[P]** fuente primaria (BOE, ficha oficial, ADAC, TÜV). **[S]** fuente secundaria (portal, medio, foro). **estimación** = deducción mía, siempre explicada.
- "No encontrado" significa que lo busqué y no apareció. No he puesto cifras inventadas en su lugar.
- Los precios de anuncio son **precios de oferta de profesionales, no de transacción**. Los portales (coches.net, el-parking, milanuncios, BMW Premium Selection) se leyeron con extracción automática de la página. Los anuncios concretos que cito aparecían en esas páginas el día de la consulta. Los filtros por modelo de coches.net no son fiables (devolvían coches que no eran el pedido). Autouncle, mobile.de, autoscout24.es y las fichas de modelo bloquearon la lectura directa (403) en varios casos.
- La muestra de anuncios es **pequeña** (unas decenas de coches en total, pocos por modelo). Sirve para el orden de magnitud, no para cotizar un coche.

Aviso sobre nombres de motor: el F31 **330i** lleva el **B48** (2.0 de 252 CV, desde 2015) y el **340i** el **B58** (3.0 de 326 CV). **N20 y N55 no aplican** a estos modelos: son los motores del 328i y 335i, que no están en la lista. Los usé solo como contraste de fiabilidad.

---

## 0. Qué cambia respecto a `src/data/bmw.ts` (resumen)

| Dato | Valor actual | Hallazgo |
|---|---|---|
| **CV fiscales (todos)** | 15,9 (B48) y 20,8 (B58) | **Error.** La Orden HAC/1501/2025 (BOE) da **13,31** para el 2.0 de 4 cilindros y **19,97** para el 3.0 de 6. Con 13,31 el IVTM de Bilbao cae de tramo (12-13,99 en vez de 14-15,99). Con 19,97 se queda en el tramo 16-19,99, no en el de ≥20. |
| **CO2 530i/540i G31** | 160 / 185 | Fichas: 133-143 y 167-177 g/km (NEDC). Propongo 140 y 172. |
| **CO2 X3 30i** | 175 | ADAC da **213 g/km** (WLTP). Propongo 213. |
| **Consumo 540i G31** | 9,3 | Spritmonitor: **10,1-11,0**. Propongo 10,4. |
| **Consumo 330i F31 / 340i F31 / 530i / X3 M40i** | 7,5 / 9,0 / 8,0 / 10 | Propongo 8,0 / 9,2 / 8,3 / 10,4 (Spritmonitor). |
| **Precio 330i F31** | 19.500 | Oferta real ~20.900 con 115.000 km. Propongo 21.000. |
| **Precio y km 340i F31** | 25.000, 100.000 km | Casi no hay oferta en España. En Alemania 22.000-26.000 con 108.000-138.000 km. Propongo 26.500 con 115.000 km. |
| **Precio y km 530i G31** | 29.500, 95.000 km | Anuncios: 25.950 con 140.000 km, 26.970 con 103.500 km. Propongo 26.500 con 120.000 km. |
| **Precio 540i G31** | 36.000 | Anuncios entre 28.900 y 39.500 según km. Propongo 33.500 con 85.000 km. |
| **Precio X3 30i** | 31.000, 85.000 km | Anuncios: 29.900 con 106.000 km, 30.990 con 92.000 km. Propongo 30.000 con 105.000 km. |
| **Precio X3 M40i** | 41.000, 80.000 km | Anuncios: 34.700-39.000 con 105.000-120.000 km. Propongo 38.000 con 105.000 km. |
| **Precio y km 330i G21** | 31.500, 70.000 km | Anuncios: 30.900-33.990 con 51.000-145.000 km. Propongo 32.500 con 80.000 km. |
| **Precio y km M340i G21** | 42.000, 65.000 km | Media 41.100 (2020) y 44.100 (2021) con 90.000-124.000 km de mediana. Propongo 42.000 con 90.000 km. |
| **Seguro todo riesgo** | 750-1.000 | Datos de aseguradoras (Madrid, 2023): 513-784 para un Serie 3. Propongo 650-900 (estimación). |
| **Mantenimiento y averías** | sin base | Mantengo el orden de magnitud. Subo las averías del 5er (TÜV peor que la media). |

La depreciación anual (9-10 %) se mantiene. No hay estudio público a 6-8 años. Ver §6.

---

## 1. Anuncios y precios por modelo (España; Alemania donde hay poca oferta)

Edad a 1-10-2026. "Año" es el año de matriculación del anuncio.

### 1.1 BMW 330i Touring F31 (B48, 252 CV, 2016-2018)

- Casi no hay F31 330i Touring en los portales españoles consultados. En el-parking aparece un **330i 2.0 de 2018 con 115.442 km a 20.890 €** (carrocería no indicada, sin confirmar que sea Touring). https://www.el-parking.es/coches-usados/bmw-serie-3-touring-330i-xdrive.html
- Alemania (autoscout24.de, "BMW 330 de 2017"): **44 anuncios, mediana 19.900 €, rango habitual 15.699-23.900 €, 128.000 km de media**, 252-258 PS. Incluye berlinas. https://www.autoscout24.de/lst/bmw/330/re_2017
- Los anuncios de 2019-2020 con 258 CV que salen al buscar "330i Touring" son **G21 (otro coche)**. No los uso para el F31.
- Rango propuesto en España (**estimación**): 19.000-23.000 € con 100.000-130.000 km.

### 1.2 BMW 340i Touring F31 (B58, 326 CV, 2015-2018)

- España: **no encontré ningún 340i Touring F31 anunciado** en las páginas leídas. En el-parking solo salen anuncios de Francia: 340i xDrive de 2018 con 92.000 km a 29.990 €, de 2018 con 102.289 km a 29.580 €, de 2017 con 144.000 km a 26.990 €. https://www.el-parking.es/coches-usados/bmw-serie-3-touring-340i-xdrive.html
- Alemania, autoscout24.de, 340i Touring de 2018:
  - xDrive Sport Line, 10/2018, 124.882 km, 22.995 €
  - xDrive Sport Line, 04/2018, 108.000 km, 24.900 € (particular)
  - xDrive M Sport, 05/2018, 223.000 km, 21.890 €
  - https://www.autoscout24.de/lst/bmw/340/re_2018
- Alemania, mobile.de, vía buscador (2018): Touring Sport Line con 138.150 km a 25.460 €; Touring xDrive con 117.700 km a 25.975 €. El mismo resumen da "precio bueno" 23.962-26.987 € (septiembre 2026) y mediana de oferta en autoscout24 de 29.500 € (toda la gama 340, con GT y berlinas). https://suchen.mobile.de/auto/bmw-340-2018.html (leído solo en el resumen del buscador; la página dio 403).
- Rango propuesto (**estimación**): 24.000-29.000 € con 100.000-140.000 km. El precio del anuncio alemán es **bruto** (ver §5 sobre IVA).

### 1.3 BMW 530i Touring G31 pre-LCI (B48, 252 CV, 2017-07/2020)

- España: 530ia 2.0 de 2019, 139.833 km, **25.950 €** (Madrid); 530ia de 2020, 103.517 km, **26.970 €** y 23.470 € (dos entradas del mismo coche, Aragón). https://www.el-parking.es/coches-usados/bmw-serie-5-touring-530i.html
- Alemania (autoscout24.de 2018): Touring de 21.790 a 27.990 €, con 73.000-171.000 km. Mediana de oferta de todos los 530 de 2018: 23.922 €. https://www.autoscout24.de/lst/bmw/530/re_2018
- Resumen de índices alemanes citado por buscador: 2019 media 25.789-26.109 € con 120.000-136.000 km; 2018 media 23.610-24.756 € con 139.000-150.000 km. [S]
- Rango propuesto (**estimación**): 23.000-30.000 € con 100.000-140.000 km.

### 1.4 BMW 540i Touring G31 pre-LCI (B58, 340 CV, 2017-07/2020)

- España (milanuncios/el-parking, anuncios de profesionales):
  - 2019, 25.000 km, 540iA xDrive, **47.900 €** (Tenerife)
  - 2018, 69.300 km, **35.850 €**
  - 2018, 59.000 km, **36.990 €**
  - 2018, 93.000 km, M Sport xDrive, **39.490 €**
  - 2019, 78.524 km, **32.850 €**
  - 2019, 101.861 km, xDrive, **28.920 €**
  - 2017, 148.212 km, **33.325-35.990 €** (Madrid y Galicia)
  - https://www.milanuncios.com/coches-de-segunda-mano/540i-touring.htm y https://www.el-parking.es/coches-usados/bmw-serie-5-touring-540i-xdrive.html
- Alemania/Francia (el-parking): 2018, 101.191 km, 29.700 € (Alemania); 2018, 51.000 km, 40.980 € (Francia).
- Rango propuesto (**estimación**): 29.000-40.000 € con 60.000-100.000 km. La dispersión es enorme, así que conviene filtrar por km.

### 1.5 BMW X3 xDrive30i G01 (B48, 252 CV, 2018-2021)

- España: 2019, 105.952 km, **29.900 €** (Madrid); 2020, 91.727 km, **30.990 €** (Madrid). https://www.el-parking.es/coches-usados/bmw-x3-30i.html
- BMW Premium Selection (2 años de garantía): 2019, 109.799 km, **32.900 €** (Tenerife); 2022 (ya LCI), 107.500 km, 31.500 € (Toledo). https://www.bmwpremiumselection.es/x3/xdrive30i/
- Referencia de coches.net: media 25.982 € con 151.281 km (todas las edades). Un 2020 con 204.300 km a 27.900 € y 1 año de garantía. [S]
- Rango propuesto (**estimación**): 27.000-33.000 € con 90.000-110.000 km.

### 1.6 BMW X3 M40i G01 (B58, 354-360 CV, 2018-2021)

- España (el-parking): 2018, 119.810 km, **34.658 €**; 2018, 105.811 km, **38.990 €**; 2019, 115.000 km, **38.000 €**; 2020, 19.500 km, 54.600 €. https://www.el-parking.es/coches-usados/bmw-x3-m40i.html
- Rango de la página: 27.400-63.990 € (incluye M40i LCI híbridos de 2022-2023). Búsqueda genérica: un 2019 con 89.418 km a 35.650 €.
- Alemania: mediana de oferta de todos los M40i **38.950 €** (rango 34.780-44.995). Un 2020 con 61.661 km a 36.260 €. https://www.autoscout24.de/lst/bmw/x3/mt_m40i [S, vía buscador]
- Rango propuesto (**estimación**): 34.000-41.000 € con 90.000-120.000 km.

### 1.7 BMW 330i Touring G21 pre-LCI (B48, 258 CV, 2019-03/2022)

- Anuncios en España (coches.net, milanuncios, el-parking):
  - 2019, 74.900 km, **33.990 €** (Flexicar)
  - 2020, 51.417 km, **33.899 €** (Autohero)
  - 2020, 57.000 km, xDrive, **32.932 €**
  - 2020, 145.000 km, xDrive, **30.900 €**
  - 2021, 78.800 km, **33.900 €**
  - https://www.coches.net/bmw/serie_3/330i/segunda-mano/ y https://www.milanuncios.com/bmw-de-segunda-mano/330i-touring.htm
- Rango propuesto (**estimación**): 30.000-34.000 € con 50.000-145.000 km.
- Atención: el 330i Touring que anuncia BMW Premium Selection es un **2024 xDrive de 245 CV a 48.900 €**, es decir LCI II, no el coche buscado.

### 1.8 BMW M340i Touring G21 pre-LCI (B58 microhíbrido, 374 CV, 2019-03/2022)

- Autouncle (vía buscador, no pude abrir la página): **2020: 34.495-50.200 €, media 41.097 €, mediana 90.600 km. 2021: 39.900-52.740 €, media 44.100 €, mediana 124.000 km.** Ejemplos: Touring xDrive 2020 con 97.749 km a **39.900 €**; 2021 con 63.256 km a 50.990 €. https://www.autouncle.es/es/coches-segunda-mano/BMW/M340/y-2021
- Alemania (autoscout24.de "340 de 2020"): mediana **39.900 €**, rango 36.900-40.900 €, **88.600 km** de media. Para 2021: 34.500-44.990 €. https://www.autoscout24.de/lst/bmw/340/re_2020
- Rango propuesto (**estimación**): 38.000-48.000 € con 60.000-125.000 km.

---

## 2. Ficha técnica: potencia, CV fiscales, CO2, consumo oficial

### 2.1 CV fiscales (potencia fiscal) [P]

La Orden HAC/1501/2025 (BOE-A-2025-26357, 23-12-2025) lista el CVF de cada versión en su Anexo I. Descargué el texto completo y extraje las filas BMW:

| Motor | Cilindrada | Cilindros | CVF oficial en la Orden |
|---|---|---|---|
| B48 2.0 (330i, 530i, X3 30i) | 1.998 | 4 | **13,31** |
| B58 3.0 (340i, 540i, X3 M40i, M340i) | 2.998 | 6 | **19,97** |

Comprobación mía: con bore 82 mm y carrera 94,6 mm (auto-data.net) y la fórmula del RD 2822/1998 sale 13,3 (4 cil.) y 19,97 (6 cil.). Coincide. https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26357 y https://www.auto-data.net/en/bmw-5-series-touring-g31-540i-340hp-xdrive-steptronic-27757

Una fila suelta ("X3 xDrive 30i Aut. 8V 2018-2019", 6 cilindros, 15,66) parece una errata de la tabla. No la uso.

**Efecto en el IVTM de Bilbao 2026** (tabla de `fiscalidad-y-finanzas.md` §3.3): 13,31 CVF paga **153,25 €/año** y 19,97 CVF paga **282,70 €/año**. Con los valores actuales del fichero (15,9 → 216,95 €; 20,8 → tramo superior), el IVTM estaba mal calculado.

### 2.2 Potencia, CO2 y consumo de homologación

| Modelo | Potencia | CO2 | Consumo oficial | Fuente |
|---|---|---|---|---|
| 330i Touring F31 | 252 CV | no obtenido directamente. Propongo 150 (**estimación**, NEDC) | no obtenido | La ficha del 330i F31 no la pude abrir |
| 340i Touring F31 (M Sport xDrive, 07/15-06/18) | 326 CV | **176 g/km** (NEFZ, Euro 6b) | 7,6 l/100 km | ADAC https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/3er-reihe/f30-f31-f34-f80-facelift/247189/ [P] |
| 530i Touring G31 | 252 CV | **133-143 g/km** | 5,8-6,3 l/100 km | auto-data.net https://www.auto-data.net/en/bmw-5-series-touring-g31-530i-252hp-steptronic-28002 [S] |
| 540i Touring xDrive G31 (07/17-06/18) | 340 CV | **172 g/km** (NEFZ). auto-data da 167-177 | 7,5 l/100 km | ADAC https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/5er-reihe/g30-g31-f90/268331/ [P] |
| X3 xDrive30i (12/17-06/19) | 252 CV | **213 g/km** (WLTP) | 9,4 l/100 km (WLTP) | ADAC https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/x3/g01-f97/280097/ [P] |
| X3 M40i (10/17-06/18) | 360 CV | **188 g/km** | 8,2 l/100 km | ADAC https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/x3/g01-f97/280099/ [P] |
| 330i Touring G21 (258 CV) | 258 CV | **136-146 g/km**, Euro 6d-TEMP | 6,0-6,4 l/100 km | auto-data.net https://www.auto-data.net/en/bmw-3-series-touring-g21-330i-258hp-steptronic-37260 [S] |
| M340i Touring xDrive G21 (11/20-06/22) | 374 CV | **178 g/km** (WLTP) | 7,8 l/100 km (WLTP) | ADAC https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/3er-reihe/g20-g21-g80/315891/ [P] |

Cautelas:

- Los CO2 mezclan **NEDC** (coches homologados antes de septiembre de 2018) y **WLTP** (los posteriores). No son comparables entre filas. Para un coche concreto, el CO2 válido para el impuesto es el de su ficha técnica o certificado COC.
- El X3 30i y el M40i de la tabla son de **versión de lanzamiento**. En un X3 de 2019 matriculado en España, la ficha puede dar un CO2 distinto (más bajo si es NEDC-correlado). Es un dato a verificar con la ficha del coche que se vea.
- Todos usan **Super Plus (98)** según ADAC. El comparador solo tiene gasolina 95. Echar 95 es posible en los B48/B58 con algo menos de potencia, pero BMW recomienda 98 (**dato por verificar en el manual**).
- Neumáticos de serie (ADAC): 340i Touring RF225/45R18 delante y RF255/40R18 detrás; 540i Touring RF245/45R18 y RF275/40R18; X3 30i 245/45R19; X3 M40i RF245/45R20 y RF275/40R20; M340i Touring 225/45R18 y 255/40R18. "RF" significa runflat.

---

## 3. Consumo real

Mediana aproximada de entradas individuales de Spritmonitor (consultado 2026-10-01). Son declaraciones de propietarios, sin control, con mezcla de xDrive y tracción trasera:

| Modelo | Rango de entradas | Valor propuesto | Notas |
|---|---|---|---|
| 330i Touring F31 | 7,19 (sDrive, 107.758 km), 7,69 (xDrive, 141.013 km), 8,76-9,11 | **8,0** | xDrive gasta ~1 l más. https://www.spritmonitor.de/de/detailansicht/989621.html |
| 340i Touring F31 | 8,05 a 10,74 (la mayoría 8,6-9,8) | **9,2** | https://www.spritmonitor.de/de/detailansicht/717139.html |
| 530i Touring G31 | 7,67-8,15 (la mayoría), 9,68-9,70, un 11,78 | **8,3** | https://www.spritmonitor.de/de/detailansicht/1178166.html |
| 540i xDrive Touring G31 | 10,06-10,96 | **10,4** | https://www.spritmonitor.de/de/detailansicht/1037703.html |
| X3 xDrive30i G01 | 8,40 (93.987 km, CO2 196), 8,53 | **9,0** | Pocas entradas. ADAC WLTP 9,4. https://www.spritmonitor.de/de/detailansicht/1382662.html |
| X3 M40i G01 | 9,92-11,53 (la mayoría 10,1-10,5) | **10,4** | https://www.spritmonitor.de/de/detailansicht/933741.html |
| 330i Touring G21 | 5,85 (xDrive no), 7,45, 8,14 (xDrive M Sport, 148.799 km) | **7,3** | Muy dispersas. https://www.spritmonitor.de/de/detailansicht/1084864.html |
| M340i xDrive Touring G21 | 8,01-9,21, un 10,54 | **8,9** | https://www.spritmonitor.de/de/detailansicht/1091673.html |

No encontré un test ADAC EcoTest con el consumo medido de estos modelos concretos. El resultado de la búsqueda solo daba las fichas WLTP de arriba. Los valores del fichero actual (7,5 a 10) son del mismo orden pero subestiman sobre todo el 540i.

---

## 4. Fiabilidad y averías por motor

### 4.1 Motores

- **N20/N55 (contraste, no están en la lista)**: fugas de aceite por junta de la tapa de balancines y del intercambiador de aceite, tubería de carga de plástico que se agrieta. Fuente: foro BMWFAQ y Wikipedia. https://www.bmwfaq.org/threads/fuga-aceite-tapa-balancines-intercambiador-aceite.1036848/ [S]. El N20 (2012-2015) añade fallos de la bomba de alta presión y cadena de distribución sobre los 120.000 km; reparación 800-1.400 €. https://www.fahrzeugschein.de/blog/artikel/bmw-3er-gebrauchtwagen-check [S]
- **B48 (2.0)**: "mejora significativa de fiabilidad frente al N20", sin problemas críticos de bomba. La recomienda como mejor opción de cuatro cilindros de gasolina. Misma fuente. [S]
- **B58 (3.0)**: "robusto pero con mantenimiento caro". Problemas documentados que aparecen con edad y km (resumen de fuentes anglosajonas, todas [S]): aviso de BMW SIB 11 03 21 (17-5-2021) sobre el inserto del filtro de aceite que se desintegra; fugas de refrigerante por depósito de expansión de plástico o bomba de agua; válvula PCV; junta de tapa de balancines. Hay un recall de motor de arranque (24V-576, 2024) que afecta a 340i xDrive y M340i de 2020. https://www.slashgear.com/1670879/bwm-b58-engine-how-reliable-owner-reviews/ y https://accelerateautorepair.com/bmw-b58-reliability/
- **G20/G21 microhíbrido 48 V (M340i)**: correa del alternador-arrancador y módulo de batería de 800-1.200 €. https://www.fahrzeugschein.de/blog/artikel/bmw-3er-gebrauchtwagen-check [S]
- **iDrive 7** (G20 hasta 2022): reinicios de pantalla en frío y cortes de ConnectedDrive. [S] misma fuente.

### 4.2 TÜV Report 2026 (publicado el 20-11-2025) [S vía prensa]

- **3er F30/F31 y G20/G21**: a 4-5 años el G20/G21 tiene un 79,2 % de coches sin defectos frente a un 84,7 % de media. A 9 años, el F30 tiene un 67,9 % sin defectos frente a un 71,7 % de media. Puntos débiles: suspensión (el G20/G21 tiene "defectos excesivos en ejes"), amortiguadores y muelles, dirección en coches jóvenes y emisiones en los F30 más viejos. https://www.autobild.de/artikel/bmw-3er-4er-im-tuev-check-2026--28158815.html y https://www.fahrzeugschein.de/blog/artikel/bmw-3er-gebrauchtwagen-check
- **5er G30/G31**: tasa de defectos **graves** del 8,4 % en los más nuevos (media 6,5 %), **21,5 % a 4-5 años (media 10 %)** y **22,3 % a 6-7 años (media 13,6 %)**. Puntos débiles: ejes y muelles, fugas de aceite. El informe no detalla por motor. https://www.firmenauto.de/fahrzeuge/pkw/bmw-5er-g30-g31-gebrauchtwagencheck-tuev-report-maengel-schwachstellen-kaufberatung/ (4-4-2026)
- **X3 G01**: el aviso destacado es el recall del refrigerador AGR en el diésel B47 (no aplica a gasolina). Dato [S], no profundicé.

### 4.3 ADAC Pannenstatistik (averías atendidas por la Straßenwacht por 1.000 vehículos, datos 2022) [S]

- Serie 3 (F30/G20): matriculados en 2020 0,8; 2019 2,0; 2018 3,1; 2017 3,9; 2016 4,6; 2015 5,9.
- X3 (G01): 2020 1,1; 2019 0,8; 2018 2,6; 2017 2,4; 2016 2,5.
- La batería de arranque es la causa del 43-44 % de todas las averías. https://www.t-online.de/mobilitaet/autos/id_89969606/auto-adac-pannenstatistik-2022-das-sind-die-tops-und-flops.html y https://assets.adac.de/image/upload/v1706796628/ADAC-eV/KOR/Text/PDF/adac-pannenstatistik-2023-2402_wbpbjs.pdf
- Lectura: son **averías con parada en carretera**, no costes de reparación. Cuantifican poco el gasto real. Los valores de `averiasAnual` son **estimaciones mías** (ver §7).

---

## 5. Importación desde Alemania

### 5.1 Qué impuestos se pagan

- **IVA**: un particular que compra un usado (más de 6 meses y más de 6.000 km) a un profesional de la UE **no paga IVA en España**. El IVA, si lo hay, ya está en el precio alemán. https://www.importyourcar.es/impuestos-importar-coche-alemania-2026/ [S]
- **REBU alemán (§25a UStG, "Differenzbesteuerung")**: el concesionario paga IVA solo sobre su margen y no puede desglosarlo. Las entregas intracomunitarias en este régimen **no pueden estar exentas** (§25a (7) Nr. 3 UStG). En la práctica el precio del anuncio es lo que se paga. No hay "ahorro del IVA" para un coche de más de 6 meses y 6.000 km. https://pandotax.de/rechtliches/differenzbesteuerung-kfz/ [S]. La regla de "coche nuevo" (menos de 6 meses o 6.000 km) no aplica a ninguno de estos modelos.
- **ITP**: si se compra a un **particular** alemán, sería ITP en Bizkaia (4 %, `fiscalidad-y-finanzas.md` §2). Compra a profesional: sin ITP. [S] autopista.es lo menciona sin cifras: https://www.autopista.es/noticias-motor/comprar-coche-en-alemania-traerlo-espana-tramites-costes-ahorro-real-en-2026-ecn_327469_102.html
- **IEDMT ("impuesto de matriculación", modelo 576)**: se paga al **matricular por primera vez en España**, aunque el coche sea usado. Tipos por CO2: 0 % (≤120 g/km), 4,75 % (121-159), 9,75 % (160-199), 14,75 % (≥200). Mismos tipos que el resto de España en Bizkaia (lo gestiona la Diputación). https://sede.agenciatributaria.gob.es/Sede/vehiculos-embarcaciones/primera-matriculacion-medios-transporte/son-tipos-impuesto-aplicar-caso/tipos-impositivos.html [P]

### 5.2 Base imponible del IEDMT en un usado importado

Es el **valor de mercado** según las tablas de Hacienda, **no el precio que se pagó**. [P] Orden HAC/1501/2025, art. 5:

1. Se toma el precio medio de la tabla (Anexo I) para esa versión.
2. Se multiplica por el % del Anexo IV según años de uso desde la primera matriculación.
3. Si venía matriculado en el extranjero, se **minora el importe residual de los impuestos indirectos** (IVA + IEDMT que habría correspondido en el momento de la primera matriculación). La Orden lo expresa con una fórmula (BI en función de VM, tipo IVA, tipo IEDMT y otros). **No pude leer la fórmula**: el texto del BOE la trae como imagen. Mi aproximación (**estimación**): BI ≈ VM / (1 + 0,21 + tipo IEDMT). El resultado real será algo distinto.

Anexo IV, turismos [P]: ≤1 año 100 %; 1-2: 84; 2-3: 67; 3-4: 56; 4-5: 47; 5-6: 39; 6-7: 34; 7-8: 28; 8-9: 24; 9-10: 19; 10-11: 17; 11-12: 13; >12: 10.

**Bizkaia tiene tabla propia**: Orden Foral 51/2026, de 3 de febrero, en vigor con efectos desde el 1-1-2026, que incorpora la misma fórmula de "eliminar la imposición indirecta ya soportada". Texto: https://www.bizkaia.eus/lehendakaritza/Bao_bob/2026/02/23/I-158_cas.pdf . **No pude abrirla**: uso la tabla estatal como aproximación, hay que contrastar los precios de Anexo I con los de Bizkaia.

Precios de Anexo I de la Orden estatal (valor "de nuevo" de la tabla), usados en los ejemplos [P]:

| Versión | Periodo | CVF | Valor Anexo I |
|---|---|---|---|
| 330i Touring (2015-) | 2015-2018 | 13,31 | 36.500 € |
| 330i Touring Aut. | 2015-2018 | 13,31 | ≈37.100 € |
| 340i Touring xDrive Aut. | 2015-2018 | 19,97 | 45.900 € |
| 530i Touring Aut. (2017-) | 2017-2018 | 13,31 | 48.900 € |
| 540i Touring xDrive Aut. | 2017-2018 | 19,97 | 60.600 € |
| 530i xDrive (G31) | 2019-2020 | 13,31 | 52.100 € |
| 540i xDrive (G31) | 2019-2020 | 19,97 | 62.200 € |
| X3 xDrive30i | 2019-2020 | 13,31 | 46.500 € |
| X3 M40i | 2019-2020 | 19,97 | 61.100 € |
| 330i 2.0 Touring Auto. (G21) | 2020-2022 | 13,31 | 43.200 € |
| M340i 3.0 Touring xDrive Auto. (G21) | 2020-2021 | 19,97 | 60.500 € |

### 5.3 Ejemplos de IEDMT (**estimación**, tabla estatal, fórmula aproximada)

| Coche | Edad (Anexo IV) | VM = tabla × % | CO2 → tipo | IEDMT sin minorar | IEDMT con minorar (aprox.) |
|---|---|---|---|---|---|
| 340i Touring F31, 2018 | 7-8 años, 28 % | 45.900 × 0,28 = **12.852 €** | 176 → 9,75 % | **1.253 €** | ≈ 958 € |
| 330i Touring F31, 2018 | 7-8 años, 28 % | 37.100 × 0,28 = **10.388 €** | ~150 → 4,75 % | **493 €** | ≈ 410 € |
| 540i Touring G31, 2019 | 7-8 años, 28 % | 62.200 × 0,28 = **17.416 €** | 172 → 9,75 % | **1.698 €** | ≈ 1.300 € |
| M340i Touring G21, 2021 | 5-6 años, 39 % | 60.500 × 0,39 = **23.595 €** | 178 → 9,75 % | **2.300 €** | ≈ 1.760 € |

Para un coche concreto hay que ver el CO2 de su ficha. Un X3 30i con ficha de 213 g/km pasaría al tipo del 14,75 %.

### 5.4 Resto de costes de importar (estimaciones de gestorías, [S])

| Concepto | Rango | Fuente |
|---|---|---|
| Transporte (camión o conductor) | 600-1.200 € | https://www.autopista.es/noticias-motor/comprar-coche-en-alemania-traerlo-espana-tramites-costes-ahorro-real-en-2026-ecn_327469_102.html |
| ITV de importación | 100-250 € | idem, y https://www.conductorpro.es/tramites/importacion-vehiculo-ue/ |
| COC (certificado de conformidad) o ficha reducida | 50-200 € | idem |
| Tasa DGT de matriculación (tasa 1.1) | **99,77 €** | DGT [P], citado en `fiscalidad-y-finanzas.md` §2.4 |
| Gestoría | 150-400 € | autopista.es |
| Placas | no encontrado (estimación propia ~30 €) | |
| IVTM | municipal, Bilbao ver §2.1 | |

Suma sin IEDMT: **1.200-2.000 €** según las mismas gestorías ("gastos preliminares"). Importyourcar.es habla de **1.550-4.000 €** extra en un 320d de 30.000 €.

Plazo total de trámites: **6-10 semanas** si todo va bien. [S] conductorpro.es. Circular antes de matricular exige placas temporales de exportación y seguro, con multa de **601-3.005 €** en caso contrario. Mismo origen.

### 5.5 Garantía

- BMW Premium Selection España: **2 años** de garantía, 100 puntos de inspección. https://www.bmwpremiumselection.es/x3/xdrive30i/ [P marca]
- Un coche alemán comprado a profesional tiene la garantía legal de usado aplicable al contrato (**estimación**: 1 año pactado en Alemania como mínimo; no lo verifiqué en BGB). Reclamar a un taller alemán desde Bizkaia es lento. Una garantía de red BMW en España normalmente **no** cubre un coche vendido fuera. **No encontré fuente primaria**: pregúntese por escrito al vendedor antes de comprar.

### 5.6 ¿Compensa?

Cálculo (**estimación**) con los rangos de §1. Se compara el precio alemán con el español más el coste extra de importar (IEDMT + 1.200-2.000 € de trámites):

| Modelo | Precio DE | Precio ES | Diferencia | Coste extra de importar | Compensa |
|---|---|---|---|---|---|
| 340i Touring F31 | ~22.000-26.000 | casi no hay oferta | n/a | ~2.200-3.300 | **Solo si no hay en España**. Ahorro de 2.000-3.000 € en el mejor caso, se come casi todo |
| 330i Touring F31 | ~19.900 (mediana, 2017) | ~20.900 | ~1.000 | ~1.600-2.500 | **No** |
| 530i Touring G31 | ~23.600-26.100 | ~26.000-27.000 | ~2.000 | ~2.500-3.500 | **No** |
| 540i Touring G31 | ~29.700 (2018, 101.000 km) | ~28.900-39.500 | variable | ~2.500-3.700 | **Dudoso**, solo con un buen ejemplar |
| M340i Touring G21 | ~39.900 (2020) | ~41.100 (media 2020) | ~1.200 | ~3.000-4.000 | **No** |
| X3 M40i | ~35.000-39.000 | ~34.700-39.000 | ~0 | ~2.500-3.700 | **No** |

Conclusión: con precios alemanes, entre 0 y 3.000 € más baratos que los españoles, y 2.200-4.000 € de coste extra, **importar casi nunca compensa**. Las gestorías coinciden: "para modelos corrientes los gastos eliminan la ventaja" y solo sale a cuenta en premium muy equipados, versiones raras o coches que se deprecian más en Alemania. https://www.autopista.es/noticias-motor/comprar-coche-en-alemania-traerlo-espana-tramites-costes-ahorro-real-en-2026-ecn_327469_102.html [S]. La excepción real es el **340i Touring F31**, que casi no existe en España. Un detalle: los km medios alemanes suelen ser mayores, así que la comparación a igualdad de km sale peor aún para Alemania.

---

## 6. Depreciación

- Referencia general de `coches.md` §0.1: GANVAM-DAT, gasolina a 3 años conserva ~60 % y la curva propuesta da 54 % a 4 y 48 % a 5 años (6 puntos/año, ~10-11 % relativo anual).
- A **6-8 años** no encontré estudio público. Con los pares de anuncios, un año de edad extra y 15.000-30.000 km más cuestan unos 1.500-2.500 € en coches de 25.000-40.000 € (5-8 %). Pero cada edad tiene km distintos, así que el dato no separa edad y km. Propongo **9-10 % anual** (**estimación**).
- El motor del comparador (`factorValor` en `src/engine/costes.ts`) calcula el valor como cociente entre el factor a la edad final y a la inicial. Con coches de más de 12 meses solo importa `depreciacionAnual`; `depreciacionPrimerAnio` (0,2 del fichero) no influye. Puede quedarse.
- Referencia fiscal, no de mercado: el Anexo IV baja un 14-18 % anual entre los 5 y los 8 años (47 → 39 → 34 → 28).

---

## 7. Mantenimiento, averías, seguro, neumáticos

**Mantenimiento anual (estimación propia)**: no encontré tarifas oficiales actuales de BMW España. Lo que hay:

- BMW Service Inclusive 5 años/100.000 km: **650 € (Serie 3), 750 € (Serie 5)** en una promoción de **2014**. No sirve como precio de 2026. https://www.press.bmwgroup.com/spain/article/detail/T0174386ES/bmw-mejora-las-ofertas-de-mantenimiento-de-sus-veh%C3%ADculos?language=es [P marca]
- Servicio menor 200-500 €, mayor 600-1.200 € [S]. https://sensorautomotriz.com/preguntas-frecuentes/cual-es-el-coste-de-mantenimiento-del-bmw-serie-3 . Forocoches da ~800 € por revisión en el Serie 3.
- Estimación para 15.000 km/año en taller oficial o independiente de calidad: **850-950 € (4 cilindros), 1.000-1.100 € (6 cilindros)**, incluyendo aceite, filtros, frenos y líquidos prorrateados. Mantengo prácticamente los del fichero.

**Averías anuales (estimación propia)**: provisión para fugas (tapa de balancines, intercambiador), bomba de agua/termostato, soportes, suspensión y batería, más reparaciones mayores ocasionales. Ver §4. Coches de 6-8 años y 85.000-120.000 km: **800-1.200 €/año**. El 5er G31 sube a 1.100-1.200 por la tasa de defectos graves del TÜV, el microhíbrido M340i queda en 900 por menos edad.

**Seguro todo riesgo (estimación propia, conductor de 40 años)**:

- Rastreator, **julio de 2023**: Serie 3 nuevo, varón de 37 años en Madrid, garaje colectivo sin vigilancia: **513-784 €** todo riesgo, 148-201 € terceros. https://www.rastreator.com/seguros-de-coche/asegurar-coche/seguro-bmw/serie3 [S]
- Un agregador da media de 600 € para un Serie 3 Touring. [S] (via búsqueda; no pude abrir la fuente).
- **No hay datos de Bizkaia** ni de versiones concretas. Tomo la parte baja del rango para 4 cilindros y subo con la potencia: 650 € (330i), 750-850 € (340i/M340i), 900 € (M40i). Los 750-1.000 € actuales parecen altos para coches de 6-8 años.

**Neumáticos (juego de 4)**:

- Michelin Pilot Sport 4 **225/45 R18 runflat: 172-204 € por unidad** (686-815 € el juego), 225/45 R19: 220 €, **245/45 R19: 239 €** por unidad (≈955 € el juego). https://www.grip500.es/neumatico/225-45-18/michelin-pilot-sport-4-gp1108698 , https://www.neumaticos-online.es/rshop/neumaticos/Michelin/Pilot-Sport-4-ZP/225-45-R18-95Y-XL----runflat/R-390857 [S]
- Con eje trasero más ancho, 20 pulgadas y runflat los precios suben. Mi estimación: 750 € (F31 y 330i G21), 850-900 € (340i/M340i y 530i), 1.000 € (540i), 950 € (X3 30i) y 1.300 € (X3 M40i). Vida 35.000 km, 30.000 km en el M40i.

---

## 8. Tabla final para `src/data/bmw.ts`

Edad en meses a 1-10-2026. Unidades como en el fichero. **estimación** = mía; el resto se basa en las fuentes del apartado indicado.

| id | pvp € | edadInicialMeses | kmIniciales | co2 g/km | cvFiscales | consumo l/100 | mantenimientoAnual € | averiasAnual € | seguroTodoRiesgoAnual € | neumaticosJuego € | depreciacionAnual |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `bmw-330i-f31` | 21.000 | 96 | 115.000 | 150 | **13,31** | 8,0 | 900 | 1.000 | 650 | 750 | 0,09 |
| `bmw-340i-f31` | 26.500 | 96 | 115.000 | 176 | **19,97** | 9,2 | 1.050 | 1.200 | 750 | 850 | 0,10 |
| `bmw-530i-g31` | 26.500 | 84 | 120.000 | 140 | **13,31** | 8,3 | 950 | 1.100 | 700 | 900 | 0,10 |
| `bmw-540i-g31` | 33.500 | 84 | 85.000 | 172 | **19,97** | 10,4 | 1.100 | 1.200 | 800 | 1.000 | 0,10 |
| `bmw-x3-30i-g01` | 30.000 | 84 | 105.000 | 213 | **13,31** | 9,0 | 950 | 1.000 | 700 | 950 | 0,10 |
| `bmw-x3-m40i-g01` | 38.000 | 84 | 105.000 | 188 | **19,97** | 10,4 | 1.100 | 1.150 | 900 | 1.300 | 0,10 |
| `bmw-330i-g21` | 32.500 | 72 | 80.000 | 146 | **13,31** | 7,3 | 850 | 800 | 650 | 750 | 0,09 |
| `bmw-340i-g21` (M340i) | 42.000 | 66 | 90.000 | 178 | **19,97** | 8,9 | 1.000 | 900 | 850 | 850 | 0,10 |

Fuente de cada columna:

- **pvp, edad, km**: mediana a ojo de los anuncios y medias de §1. **Estimación** (muestra pequeña). El 340i F31 es la menos fiable (sin oferta en España).
- **co2**: §2.2. El 330i F31 (150) es **estimación**. El X3 30i (213, WLTP) y el M40i (188) mezclan normas, ver cautelas de §2.2.
- **cvFiscales**: BOE Orden HAC/1501/2025, Anexo I [P].
- **consumo**: Spritmonitor, §3.
- **mantenimiento, averías, seguro, neumáticos, depreciación**: **estimación propia** apoyada en §4, §6 y §7.

Otros campos del fichero que conviene revisar:

- `USADO_BMW.seguroTercerosAnual: 400`: la fuente dio 148-218 € (Rastreator, 2023, Madrid). Propongo 250 € (**estimación**).
- `garantiaMeses: 24` solo aplica a BMW Premium Selection. En compraventas independientes suelen ser 12 meses.
- La `version` de cada coche menciona año y km. Si se cambia `edadInicialMeses`/`kmIniciales`, hay que actualizarla.
- El M340i (`bmw-340i-g21`) lleva el motor B58 con microhíbrido de 48 V. Su consumo y CO2 son los de ADAC (7,8 l, 178 g, WLTP).

---

## 9. Lo que no encontré

- CO2 y consumo oficiales del 330i Touring F31 (la ficha de ADAC no se abrió).
- Tarifas vigentes de mantenimiento de BMW España y del Service Inclusive en 2026.
- Seguros específicos de Bizkaia.
- La fórmula exacta de minoración del art. 5 de la Orden (imagen en el BOE) y las tablas forales de Bizkaia (Orden Foral 51/2026, PDF no leído).
- Estudio público de depreciación a 6-8 años.
- Ningún anuncio de un 340i Touring F31 en España.
- Garantía legal aplicable a un coche comprado a un profesional alemán (no verificada en BGB ni en la normativa española).
