# Fiscalidad y finanzas del coche para particulares (España, 2026)

Investigación para la herramienta de comparación de costes de coche (particular). Fecha de consulta de **todas** las fuentes: **2026-10-01**, salvo que se indique otra.

Convenciones:
- **[P]** = fuente primaria (BOE, boletines oficiales, haciendas, ayuntamientos, BCE/BdE, INE, Tesoro, MITECO/REE, Comisión Europea).
- **[S]** = fuente secundaria (prensa, comparadores, asociaciones). Úsese como orientación y verifíquese antes de fijar valores "duros".
- **estimación** = valor calculado o inferido por nosotros, no publicado tal cual por la fuente.
- Los datos marcados "no verificado" no se han podido contrastar con fuente primaria en esta investigación.

Contexto 2026 relevante: crisis energética por el conflicto en Oriente Medio (cierre de Ormuz). Ha disparado carburantes e inflación y ha motivado rebajas fiscales temporales (RDL 7/2026 y RDL 25/2026). Los precios energéticos de este documento son volátiles: conviene parametrizarlos.

---

## 1. Impuesto Especial sobre Determinados Medios de Transporte (IEDMT, "impuesto de matriculación")

### 1.1 Tramos y tipos 2026 (turismos, art. 70.1 Ley 38/1992)

| Epígrafe | Emisiones CO2 oficiales (WLTP) | Península y Baleares | Canarias | Ceuta y Melilla |
|---|---|---|---|---|
| 1º | ≤ 120 g/km | 0 % | 0 % | 0 % |
| 2º | > 120 y < 160 g/km | 4,75 % | 3,75 % | 0 % |
| 3º | ≥ 160 y < 200 g/km | 9,75 % | 8,75 % | 0 % |
| 4º | ≥ 200 g/km (o emisiones no acreditadas) | 14,75 % | 13,75 % | 0 % |
| 5º | Otros vehículos/embarcaciones/aeronaves | 12 % | 11 % | 0 % |

- Fuente [P]: AEAT, "Tipos impositivos" IEDMT — https://sede.agenciatributaria.gob.es/Sede/vehiculos-embarcaciones/primera-matriculacion-medios-transporte/son-tipos-impuesto-aplicar-caso/tipos-impositivos.html
- Fuente [P]: Ministerio de Hacienda, *Tributación Autonómica. Medidas 2026*, cap. I (actualizado a 29-04-2026), p. 33-34 y anexo VII. Recoge los umbrales de CO2 de cada epígrafe: https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-i-tributacion-autonomica-2026.pdf
- Ley 38/1992 consolidada [P]: https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741

### 1.2 Base imponible (art. 69 Ley 38/1992) [P]
- **Vehículo nuevo**: el importe que se haya determinado como base imponible del IVA (o de un impuesto equivalente). Es decir, el precio sin IVA, incluidos extras y accesorios y descontadas las rebajas. A falta de IVA, la contraprestación total.
- **Vehículo usado** (primera matriculación en España de un importado): valor de mercado en el devengo. Se puede comprobar con las tablas de la Orden HAC/1501/2025 (ver §2.3). Si estuvo matriculado en otro país de la UE, se descuenta el IVA/IEDMT residual (art. 5 de esa orden).
- Familias numerosas: reducción del 50 % de la base para vehículos de 5 a 9 plazas, previo reconocimiento.
- Fuentes [P]: BOE Ley 38/1992 (enlace anterior) y Orden HAC/1501/2025, art. 5 — https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26357

### 1.3 Incrementos autonómicos vigentes en 2026 (máximo legal +15 % sobre el tipo estatal, art. 51 Ley 22/2009) [P]
Solo 7 CCAA han regulado tipos. Para turismos:

| CCAA | Epígrafe 3º (160-199 g) | Epígrafe 4º (≥200 g) |
|---|---|---|
| Cataluña | 9,75 % (estatal) | **16 %** |
| Andalucía | 9,75 % | 14,75 % (igual al estatal) |
| Asturias | 9,75 % | **16 %** |
| Cantabria | 9,75 % (regulado, igual al estatal) | **15 %** |
| Murcia | 9,75 % | **15,9 %** |
| Illes Balears | 9,75 % | **16 %** |
| Comunitat Valenciana | 9,75 % | **16 %** |
| Resto de CCAA régimen común | estatal | estatal |

- En el epígrafe 2º (121-159 g) **ninguna** CCAA modifica el 4,75 %.
- Fuente [P]: Hacienda, *Tributación Autonómica. Medidas 2026*, cap. I, p. 33 y anexo VII (p. 82) — enlace en §1.1. La página de la AEAT (§1.1) lista también estos incrementos.

### 1.4 País Vasco y Navarra
- El IEDMT es un impuesto concertado/convenido: lo gestionan y recaudan las Diputaciones Forales (Bizkaia, Gipuzkoa, Álava) y la Hacienda Foral de Navarra. Se aplican los **mismos epígrafes y tipos estatales** (0 / 4,75 / 9,75 / 14,75 %).
- Bizkaia [P]: "Impuestos Especiales – Educación tributaria" — https://www.bizkaia.eus/es/web/educacion-tributaria/impuestos-especiales (exento ≤120 g/km; tipos hasta 14,75 %).
- Álava [P]: FAQ IEDMT — https://web.araba.eus/es/hacienda/preguntas-frecuentes-impuesto-especial-determinados-medios-de-transporte
- No se ha encontrado ningún incremento foral de tipos. **No verificado** el texto foral concreto de Gipuzkoa y Navarra.

**Valor por defecto para la herramienta**: tipo = f(CO2 WLTP) con la tabla estatal; override por CCAA solo para el epígrafe 4º según §1.3; Canarias −1 punto; Ceuta/Melilla 0 %.

---

## 2. ITP por compra de coche usado a un particular

### 2.1 Reglas generales
- Compra a **particular** → ITP (modalidad TPO). Lo paga el comprador (modelo 620 o equivalente autonómico). Plazo habitual: 30 días hábiles (Gipuzkoa), 1 mes (Aragón, Cataluña), 2 meses (Navarra).
- Compra a **concesionario/compraventa profesional** → **no hay ITP**. La operación lleva IVA: 21 % sobre el precio, o régimen especial de bienes usados (REBU), con el IVA solo sobre el margen e incluido en el precio. Navarra lo resume así [P]: "Si el transmitente es empresario, la venta está sujeta a IVA y AJD. Si quien transmite es un particular, la compraventa queda sujeta a TPO". Fuente: Guía ITPAJD de Hacienda Foral de Navarra — https://www.navarra.es/documents/48192/6659876/Gu%C3%ADa+ITPAJD+v0.06+05102022.pdf
- **Base imponible**: el valor real. La administración compara el precio del contrato con el valor de tablas (precio medio × % por antigüedad) y toma el **mayor** (p. ej. Aragón y Navarra, ver §2.2).

### 2.2 Tipos por territorio (turismos usados, compraventa entre particulares)
Fuente principal régimen común [P]: Ministerio de Hacienda, *Tributación Autonómica. Medidas 2026*:
- cap. I, p. 27-28: https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-i-tributacion-autonomica-2026.pdf
- cap. IV, sección ITPAJD por CCAA: https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-iv-tributacion-autonomica-2026.pdf

Tipo estatal supletorio para bienes muebles: 4 %.

| Territorio | Tipo general vehículos | Tipos especiales / cuotas fijas (turismos) | Fuente |
|---|---|---|---|
| Andalucía | 4 % (estatal) | **8 %** si >15 CV fiscales; **1 %** turismos "0 emisiones" | [P] cap. IV (art. 46-47 Ley 5/2021) |
| Aragón | 4 % | **Cuota fija** según antigüedad y cilindrada (art. 121-6 TR D.Leg. 1/2005). Para >10 años, según aragon.es: ≤1.000 cc 0 €, 1.001-1.500 cc 20 €, 1.501-2.000 cc 30 € (resto de tramos no extraído) | [P] cap. IV; [P] https://www.aragon.es/administracion-tributaria-de-aragon/gestiones-habituales/compraventa-de-vehiculos |
| Asturias | 4 % | **8 %** si >15 CV fiscales | [P] cap. IV (art. 32 TR D.Leg. 2/2014) |
| Illes Balears | 4 % | **8 %** si >15 CV fiscales; **0 %** etiqueta CERO; **2 %** etiqueta ECO; 0 % ciclomotores | [P] cap. IV (art. 14 TR D.Leg. 1/2014) |
| Canarias | 5,5 % | **Cuota fija** para turismos usados según antigüedad y cilindrada (art. 38-ter TR D.Leg. 1/2009). Tabla no extraída | [P] cap. I y IV |
| Cantabria | 6 % | **Cuotas fijas** para turismos y todoterrenos usados (no históricos). El resto, al 6 % (art. 11 TR D.Leg. 62/2008). Tabla no extraída | [P] cap. IV |
| Castilla-La Mancha | 6 % | — | [P] cap. IV (art. 20 Ley 8/2013) |
| Castilla y León | 5 % | **8 %** si >15 CV fiscales | [P] cap. IV (art. 25.2 TR D.Leg. 1/2013) |
| Cataluña | 5 % | **0 %** etiqueta "0 emisiones" (desde 27-6-2025). Vehículos de **≥10 años** y valor (sin depreciar) < 40.000 € exonerados de presentar autoliquidación (art. 683-6 Código tributario). En la práctica no pagan (**inferencia, verificar**) | [P] cap. IV |
| Comunitat Valenciana | 6 % | **8 %** si ≤5 años y >2.000 cc, o valor ≥ 20.000 €. **Cuotas fijas** si valor < 20.000 € y >5 años. Según GVA, >12 años: ≤1.500 cc 40 €, 1.501-2.000 cc 60 €, >2.000 cc 140 €. Para >5 y ≤12 años, cuotas más altas (verificar en la tabla oficial) | [P] cap. IV (art. 13.Tres.3 Ley 13/1997); [P] https://sede.gva.es/en/detall-tramit?id_proc=12 |
| Extremadura | 6 % | — | [P] cap. IV (art. 38 TR D.Leg. 1/2018) |
| Galicia | 8 % (general muebles) | **3 %** medios de transporte terrestre usados (régimen normal de coches); **0 %** "0 emisiones"; **cuota fija** con ≥15 años: ≤1.199 cc 22 €, 1.200-1.599 cc 38 € (resto de tramos no extraído) | [P] cap. IV (art. 14.Seis TR D.Leg. 1/2011) |
| Madrid | 4 % (estatal) | Bonificación del 100 % para muebles < 500 €, **no aplicable** a vehículos que deban inscribirse en registro | [P] cap. IV (art. 30 ter TR D.Leg. 1/2010) |
| Murcia | 4 % (estatal) | **Cuota fija** para turismos de >12 años según cilindrada (art. 6.10 TR D.Leg. 1/2010). Tabla no extraída | [P] cap. IV |
| La Rioja | 4 % | — | [P] cap. I |
| **Bizkaia** | **4 %** | Sin cuotas fijas | [P] Tarifa ITP Bizkaia (NF 1/2011): "Bienes muebles y semovientes (vehículos…) 4%" — https://www.bizkaia.eus/documents/1135059/1352576/ITP+Tarifa.pdf/c4388ca6-7611-2afd-d3a8-c06f1a0806fd |
| **Gipuzkoa** | **4 %** | Sin cuotas fijas; tablas de valoración propias de la Diputación | [P] https://www.gipuzkoa.eus/es/web/ogasuna/impuestos/modelo/620 ; tablas: https://ssl7.gipuzkoa.net/vehiculos/defaultc.asp |
| **Álava** | 4 % (**no verificado** en fuente primaria) | Modelo 620TV | [S] https://simutransfer.com/transferencia-de-vehiculos-en-el-pais-vasco/ ; [P] índice: https://web.araba.eus/es/hacienda/transmisiones-y-actos-juridicos-documentados |
| **Navarra** | **4 %** | **Exentos** turismos, todoterrenos y motos con ≥10 años desde la 1ª matriculación, salvo históricos o valor > 40.000 €. Ciclomotores exentos. Tablas propias por Orden Foral anual | [P] Guía ITPAJD Navarra (v. 2022, p. 20-22), enlace en §2.1. **Verificar vigencia 2026** |
| Ceuta / Melilla | **no verificado** | — | — |

Notas:
- "CV fiscales" = potencia fiscal (ver §3.2).
- Las tablas de cuotas fijas de Canarias, Cantabria, Murcia y los tramos completos de Aragón y Galicia **no se han extraído**. Para producción, consúltese la norma autonómica citada en el cap. IV.

### 2.3 Base: tablas de precios medios 2026 (régimen común) [P]
- **Orden HAC/1501/2025**, de 17 de diciembre (BOE 23-12-2025), en vigor el 1-1-2026. Anexo I: precios medios de vehículos nuevos (este año distingue PHEV). Anexo IV: % por años de uso. https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26357 (PDF: https://www.boe.es/boe/dias/2025/12/23/pdfs/BOE-A-2025-26357.pdf)
- **Anexo IV (turismos ya matriculados, no vivienda)**:

| Años de uso | % | Años de uso | % |
|---|---|---|---|
| ≤1 | 100 | >7-8 | 28 |
| >1-2 | 84 | >8-9 | 24 |
| >2-3 | 67 | >9-10 | 19 |
| >3-4 | 56 | >10-11 | 17 |
| >4-5 | 47 | >11-12 | 13 |
| >5-6 | 39 | >12 | 10 |
| >6-7 | 34 | | |

- Reducción al 70 % si el coche se dedicó más de 6 meses a autoescuela, alquiler sin conductor o taxi.
- Los territorios forales y Navarra aprueban **sus propias** tablas por Orden Foral (ver Gipuzkoa y Navarra arriba).

### 2.4 Tasa DGT de transferencia 2026 [P]
- **Tasa 1.5 "Transferencia de vehículos": 55,70 €**. Ciclomotores (1.2): 27,85 €. Matriculación (1.1): 99,77 €.
- Fuente: DGT, "Descripción de las tasas públicas aplicables en DGT" — https://sedeclave.dgt.gob.es/WEB_Tasas/jsp/tasas/download/catalogoPrecioTasas.pdf
- Gestoría opcional: 80-200 € [S] https://www.muchoneumatico.com/blog/coches/calcular-transferencia-coche-gestoria/

---

## 3. IVTM (impuesto de circulación)

### 3.1 Cuotas mínimas estatales, turismos (art. 95.1 TRLRHL, RDLeg. 2/2004) [P]

| Potencia fiscal | Cuota mínima €/año |
|---|---|
| < 8 CVF | 12,62 |
| 8 – 11,99 CVF | 34,08 |
| 12 – 15,99 CVF | 71,94 |
| 16 – 19,99 CVF | 89,61 |
| ≥ 20 CVF | 112,00 |

- Los ayuntamientos pueden aplicar un coeficiente de hasta **2** (máximo legal: 25,24 / 68,16 / 143,88 / 179,22 / 224,00 €). También pueden bonificar hasta el **75 %** según carburante, motor o impacto ambiental (art. 95.6).
- Fuente: art. 95 TRLRHL — https://www.boe.es/buscar/act.php?id=BOE-A-2004-4214 ; texto en [S] https://www.supercontable.com/informacion/IAE/Articulo_95_Real_Decreto_Ley_2-2004-_de_5_de_.html
- En **Bizkaia, Gipuzkoa y Álava** el IVTM se rige por norma foral propia (en Bizkaia, NF 7/1989) y el tramo 12-15,99 se puede desdoblar. Navarra tiene tarifa foral única (Ley Foral 2/1995).

### 3.2 Potencia fiscal (CVF) (RD 2822/1998, Reglamento General de Vehículos, anexo V) [P]
- **Combustión**: `CVF = T × (0,785 × D² × R)^0,6 × N`, con T = 0,08 (4 tiempos) o 0,11 (2 tiempos), D = diámetro (cm), R = carrera (cm), N = nº de cilindros. Forma equivalente: `CVF = T × (cilindrada_unitaria_cm3)^0,6 × N`.
- **Eléctricos**: `CVF = Pe / 5,152`, con Pe = potencia efectiva en kW (potencia máxima a 30 minutos, **no** la potencia pico).
- Fuentes: RD 2822/1998 consolidado — https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826 ; explicación [S] km77 — https://www.km77.com/revista/engendro-mecanico/metodo-calculo-potencia-fiscal-electricos/
- Para la app (**estimación**): un BEV de 50-60 kW a 30 min sale con ~10-12 CVF. Si no se conoce Pe, no se debe usar la potencia pico.

### 3.3 Bilbao 2026 (Ordenanza Fiscal nº 2, IVTM) [P]
Fuente: Ayuntamiento de Bilbao, Ordenanza 02 2026 — https://www.bilbao.eus/cs/Satellite?blobcol=urldata&blobheader=application%2Fpdf&blobheadername1=Content-disposition&blobheadername2=pragma&blobheadervalue1=attachment%3B+filename%3D02Vehiculos+2026.pdf&blobheadervalue2=public&blobkey=id&blobtable=MungoBlobs&blobwhere=1274420683420&ssbinary=true (índice: https://www.bilbao.eus/cs/Satellite?cid=1279113294441&language=es&pagename=Bilbaonet%2FPage%2FBIO_ListadoCategorizado)

| Turismos | €/año |
|---|---|
| < 8 CVF | 26,05 |
| 8 – 11,99 | 71,45 |
| 12 – 13,99 | 153,25 |
| 14 – 15,99 | 216,95 |
| 16 – 19,99 | 282,70 |
| ≥ 20 | 361,70 |

Bonificaciones (art. 6.4, rogadas: hay que pedirlas):
- **Vehículos de motor eléctrico: 95 %**, indefinida. "Vehículos de emisiones nulas": 75 %, indefinida.
- **Híbridos** y vehículos a gas (GNC, GLP) o bioetanol: **75 % durante 5 ejercicios** desde la 1ª matriculación.
- Si se pide dentro del mes siguiente a matricular un coche nuevo, se aplica ese mismo año.
- Históricos: 50 %. Familia numerosa: bonificación según categoría y CVF (<16 CVF, un vehículo).
- No son acumulables.

### 3.4 Otras capitales (tarifa 2026 turismos y bonificación eléctrico)
Tabla [S] de guiafiscal.es (cita las ordenanzas oficiales). **Verificar en la ordenanza** antes de usar como dato duro.

| Ciudad | 12-15,99 CVF €/año | Bonificación EV | Híbrido/ECO | Fuente |
|---|---|---|---|---|
| Madrid | 129,00 | 75 % indefinida (BEV, FCEV, PHEV, EREV) | 75 % 6 años | https://guiafiscal.es/patrimonio/ivtm/madrid/ |
| Barcelona | 143,88 (máximo legal) | 75 % 5 años | 50 % 5 años (≤120 g) | https://guiafiscal.es/patrimonio/ivtm/barcelona/ |
| Valencia | 128,05 | 75 % sin límite (rogada) | 75 % | https://guiafiscal.es/patrimonio/ivtm/valencia/ (cita la OF de sede.valencia.es) |
| Sevilla | 130,93 | 75 % 5 años | 75 % 5 años | https://guiafiscal.es/patrimonio/ivtm/sevilla/ |
| Zaragoza | 123,60 | 75 % indefinida (PHEV CERO: 75 % 10 años) | 75 % 6 años | https://guiafiscal.es/patrimonio/ivtm/zaragoza/ (OF nº 6 2026) |
| Málaga | 138,90 | 75 % 5 años | 75 % 5 años | https://guiafiscal.es/patrimonio/ivtm/malaga/ |
| Donostia/San Sebastián | 156,56 (12-13,99) / 226,31 (14-15,99) | 95 % 3 años (rogada) | 75 % | https://guiafiscal.es/patrimonio/ivtm/san-sebastian/ |
| Vitoria-Gasteiz | 169,27 | 90 % 6 años | 50 % 6 años | https://guiafiscal.es/patrimonio/ivtm/vitoria/ |
| Pamplona/Iruña | 141,38 (>12-16 CVF) | 50 % | 25 % | https://guiafiscal.es/patrimonio/ivtm/pamplona/ |
| **Bilbao** [P] | 153,25 (12-13,99) / 216,95 (14-15,99) | **95 %** indefinida | 75 % 5 años | §3.3 |

---

## 4. ITV

### 4.1 Periodicidad, turismos de uso privado (RD 920/2017, art. 6) [P]
- Hasta 4 años: exento.
- De 4 a 10 años: **cada 2 años**.
- Más de 10 años: **anual**.
- La periodicidad no depende de la motorización.
- Fuente: https://www.boe.es/buscar/act.php?id=BOE-A-2017-12841

### 4.2 Tarifas
- **Euskadi/Bizkaia 2026**: según la web del operador Applus+ Iteuve [S/operador], gasolina **59,46 €**, diésel **61,92 €**, eléctrico/híbrido **57,26 €**, IVA y tasa DGT incluidos. https://www.applusiteuve.com/en/la-itv/precios-itv/precio-itv-euskadi/ . En Euskadi la tarifa se actualiza cada año con el IPC interanual de octubre ([S] https://itvcitaprevia.es/precios-itv/pais-vasco/).
- **Rango nacional**: "entre los 30 y 60 euros aproximadamente". La tasa DGT es de 4,18 €. Baleares/Mallorca es la más barata (~17-26 €) y Euskadi/Ceuta las más caras. Fuente [S]: RACE — https://www.race.es/precio-itv
- Defaults (**estimación**): Bizkaia 60 € por inspección; nacional 45 €.

---

## 5. Ayudas 2026 a la compra de BEV/PHEV (particular)

### 5.1 MOVES III → sustituido por el **Programa Auto+** [P]
- MOVES III dejó de admitir solicitudes el 31-12-2025.
- **Real Decreto 609/2026, de 22 de julio (BOE 23-07-2026, en vigor 24-07-2026)**: concesión directa, vigente hasta el 31-12-2030. https://www.boe.es/boe/dias/2026/07/23/pdfs/BOE-A-2026-16010.pdf
- Presupuesto 2026: 350 M€ para la Línea 1 (particulares sin actividad económica) y 50 M€ para la Línea 2 (autónomos/empresas).
- Retroactivo: vehículos nuevos matriculados desde el 1-1-2026, y vehículos de concesionario cuya 1ª matriculación sea desde el 1-1-2025 con un máximo de 12 meses hasta la factura (DT 1ª).
- Solo vehículos con **etiqueta CERO** (BEV, FCEV, PHEV, EREV). Precio máximo M1: **45.000 € sin impuestos** (precio de factura con extras y tras descuentos).
- **Descuento mínimo obligatorio del concesionario: 1.000 €** (sin impuestos). No se exige en compras anteriores a la apertura de la convocatoria.
- **No hay componente de achatarramiento** en el RD.
- Obligación de mantener la titularidad 2 años.
- El pago se hace por transferencia tras la resolución; no se descuenta en factura.
- Plazo de solicitud: el que fije la convocatoria, como máximo hasta el **15 de octubre** de cada año (ampliable al 31-12 si el crédito es incorporable). Asignación por orden de presentación.
- **No verificado**: si la convocatoria 2026 de la Línea 1 está abierta a 1-10-2026. Sí consta el extracto de la Línea 2: BOE-B-2026-30841, https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-30841

**Importe Línea 1 (turismo M1): máximo 4.500 €**, como suma de porcentajes sobre ese máximo (anexo II):

| Criterio | BEV/FCEV | PHEV/EREV |
|---|---|---|
| E1 Eléctrico | 50 % (2.250 €) | 25 % (1.125 €) |
| E2 Precio ≤ 35.000 € s/imp. | 25 % (1.125 €) | 25 % (1.125 €) |
| E2 Precio >35.000 ≤ 45.000 € | 15 % (675 €) | 15 % (675 €) |
| E3 Montaje final en la UE | 15 % (675 €) | 15 % (675 €) |
| E3 Batería ensamblada en la UE (+ requisitos NZIA en BEV) | +10 % (450 €) | +10 % (450 €) |
| **Máximo** | **4.500 €** | **3.375 €** (**estimación**: suma de máximos) |

Ejemplos (**estimación**, aritmética sobre el anexo II):
- BEV ≤35k fabricado fuera de la UE: 3.375 €.
- BEV 35-45k fabricado fuera de la UE: 2.925 €.
- PHEV ≤35k sin criterio europeo: 2.250 €.

### 5.2 Deducción estatal IRPF 15 % (régimen común, **no aplica en País Vasco ni Navarra**) [P]
- Historia en 2026: el RDL 16/2025 no fue convalidado (27-01-2026) y el RDL 2/2026 fue derogado (26/27-02-2026). Finalmente, el **RDL 7/2026, de 20 de marzo** (BOE 21-03-2026), **convalidado el 26-03-2026** (BOE-A-2026-7125), prorroga la deducción hasta el **31-12-2026**, aplicable desde el 1-1-2026.
  - AEAT: https://sede.agenciatributaria.gob.es/Sede/todas-noticias/2026/marzo/23/medidas-materia-tributacion.html
  - Convalidación: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-7125
- Condiciones (art. 81 bis/DA 58ª LIRPF, como en años anteriores; cifras de [S] que citan la norma):
  - **15 %** del valor de adquisición de un vehículo **nuevo** BEV, PHEV o FCEV, con **base máxima de 20.000 € → máximo 3.000 €**. La base se reduce en las ayudas públicas recibidas.
  - También aplica si se paga en 2026 al menos el 25 % a cuenta.
  - **Punto de recarga**: 15 % sobre una base máxima de 4.000 € → **600 €**.
  - Fuentes [S]: https://www.motorpasion.com/observatorio-motorpasion/gobierno-cambia-norma-vuelve-deduccion-irpf-para-compra-coches-electricos-instalacion-puntos-carga ; https://www.somoselectricos.com/coches-electricos/deduccion-irpf-coche-electrico-2026-espana-hasta-3000-euros/20260324171000053184.html
- Existen además deducciones autonómicas (p. ej. Asturias, Canarias, Galicia, Comunitat Valenciana, Baleares) recogidas en el cap. IV de *Tributación Autonómica 2026* [P]. No se detallan aquí.

### 5.3 Bizkaia (IRPF foral) [P/S]
- **Norma Foral 2/2025, de 9 de abril** (BOB 22-04-2025), con efectos en los ejercicios 2025 a 2035:
  - **Compra de vehículo eléctrico nuevo** (BEV, REEV, FCV, FCHV; **PHEV excluido**): deducción del **5 %** del valor de adquisición, o **10 %** si se achatarra un vehículo. Base máxima **40.000 €** en turismos (10.000 € en motos). Máximo 2.000 €, o 4.000 € con achatarramiento (**estimación** aritmética).
  - **Punto de recarga** en vivienda o garaje comunitario: **15 %** sobre una base máxima de **5.000 €** por instalación → 750 € (art. 91 sexies según la fuente).
  - Texto NF 2/2025 [P vía repositorio]: https://www.primeralecturaediciones.com/documentos_diana/LEYES_2025/BIZKAIA/NF_2_2025.pdf ; resúmenes [S]: https://www.asesoriaproyecta.com/bizkaia-2025-2035-ventajas-fiscales-en-renta-si-reformas-tu-casa-compras-un-electrico-o-instalas-un-cargador/ ; https://aslanasesores.com/puntos-de-recarga-para-vehiculo-electrico-deduccion-de-irpf-y-bonificaciones/
- **Gipuzkoa/Álava**: no investigado (**pendiente**).
- **Ayuda autonómica EVE (Gobierno Vasco)**, "Programa de ayudas a inversiones en vehículos de menos emisiones" [P]: la última convocatoria localizada es la de **2025**, ya cerrada (15-10-2025). Daba el 20 % del coste con un máximo de 3.500 €, exigía achatarramiento y fijaba un precio máximo M1 de 40.000 €. **No consta convocatoria 2026** a 1-10-2026. https://www.eve.eus/programa-de-ayudas/programa-de-ayudas-a-inversiones-en-vehiculos-de-menos-emisiones/
- En Euskadi el Programa Auto+ estatal (§5.1) aplica igual que en el resto de España: es una ayuda estatal de concesión directa, no territorializada como el MOVES III.

---

## 6. Precios de la energía

### 6.1 Carburantes
| Dato | Gasolina 95 | Diésel (gasóleo A) | Fecha | Fuente |
|---|---|---|---|---|
| España, media ponderada (Boletín Petrolero UE) | **1,940 €/l** | **1,934 €/l** | semana 28-09-2026 | [P] Comisión Europea, Weekly Oil Bulletin (xlsx "prices with taxes") — https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en |
| España, media simple de 10.903/11.263 estaciones | 1,824 €/l | 1,917 €/l | 01-10-2026 15:57 | [P] MITECO/Minetur API Geoportal — https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/ (**estimación**: media calculada por nosotros) |
| **Bizkaia**, media simple de 127 estaciones | **1,846 €/l** (mediana 1,849) | **1,928 €/l** (mediana 1,975) | 01-10-2026 | [P] misma API, `/FiltroProvincia/48` (**estimación**: media calculada por nosotros) |
| España, media mensual septiembre | 1,834 €/l | 1,831 €/l | sep-2026 | [S] https://gasolineracerca.es/informes/precios-carburantes-2026-09 (datos MITECO) |

Tendencia: doce semanas seguidas de subidas hasta finales de septiembre de 2026, cerca de 2 €/l ([S] https://www.bizkaiagaur.com/2026/09/25/el-precio-de-la-gasolina-y-el-diesel-escala-hasta-rozar-los-dos-euros-por-litro-tras-doce-semanas-de-subidas). El IPC de septiembre (4,9 %) se explica sobre todo por los carburantes (§7.5). Rebaja fiscal temporal vigente (RDL 25/2026, BOE 30-09-2026, en vigor el 1-10-2026): 20 c€/l en octubre, 13 c€/l en noviembre y 6 c€/l en diciembre, con una cláusula para volver a 20 c€/l si el IPC del carburante supera en más del 15 % al de un año antes. https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20265 ; [S] https://www.eldiario.es/economia/gobierno-prorroga-rebajas-fiscales-gasolina-diesel-limita-tarifa-gas-evitar-dispare-invierno_1_13545625.html

Los precios del 1-10 ya reflejan parte de la rebaja de octubre. Para TCO a varios años conviene **no** usar el pico actual sin más; se recomienda un parámetro editable.

### 6.2 Electricidad para carga doméstica
- **PVPC (2.0TD)**, término de energía de septiembre de 2026 (incluye peajes y cargos; **sin** IEE, IVA ni término de potencia):
  - Media de todas las horas: **0,184 €/kWh**.
  - Media del periodo **valle** (00-08 h laborables + fines de semana completos): **0,170 €/kWh**.
  - Mercado spot medio: 0,143 €/kWh.
  - Fuente [P]: REE apidatos, `mercados/precios-mercados-tiempo-real`, 1-30 sep 2026 — https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=2026-09-01T00:00&end_date=2026-09-30T23:59&time_trunc=hour (**estimación**: medias calculadas por nosotros).
  - Impuestos a sumar: Impuesto Especial sobre la Electricidad 5,11 % (rebajado al 0,5 % del 22-3 al 30-6-2026 por el RDL 7/2026) e IVA 21 %. El RDL 25/2026 prevé IVA 10 % e IEE 0,5 % de forma **condicionada** a que el IPC energético supere el 15 % ([S] https://www.iberley.es/noticias/nuevas-rebajas-fiscales-materia-energetica-2026-37037). Con impuestos generales, el valle PVPC queda en ≈ 0,170 × 1,0511 × 1,21 ≈ **0,216 €/kWh** (**estimación**).
- **Tarifa libre para coche eléctrico**:
  - Octopus "Intelligent Octopus Go": **0,068 €/kWh** en cargas inteligentes programadas. El resto del consumo va a la tarifa base (p. ej. Octopus Relax 0,129 €/kWh). Precios con impuestos según la web. [P-operador] https://octopusenergy.es/intelligent-octopus-go ; https://octopusenergy.es/tarifas
  - Rango de mercado para tarifas VE en horas valle: 0,06-0,10 €/kWh [S] https://www.ahorrove.es/articulo/previsiones-mejor-tarifa-luz-coche-electrico-2026 ; https://www.electromovilidad24.com/articulos/precio-kwh-supercharger-tesla-redes-carga-espana-2026.html (casa 0,04-0,10 €/kWh).
- Defaults (**estimación**): carga en casa con tarifa VE **0,09 €/kWh**; con PVPC valle **0,22 €/kWh**; pérdidas de carga AC ~10 % (no verificado aquí).

### 6.3 Carga pública (rangos 2026) [S]
| Red / tipo | €/kWh | Fuente |
|---|---|---|
| AC lenta/semirrápida (≤22 kW), Iberdrola / Zunder | 0,20-0,25 (en muchas ubicaciones hoy 0,30-0,49) | https://movilidadelectrica.com/precio-carga-rapida-de-vehiculos-electricos/ |
| DC rápida 50-150 kW, Iberdrola | ~0,45 (sin plan 0,49) | idem |
| DC ultrarrápida ≥350 kW, Iberdrola | ~0,69 | idem |
| Zunder DC | 0,45-0,55 | https://www.electromovilidad24.com/articulos/precio-kwh-supercharger-tesla-redes-carga-espana-2026.html (12-03-2026) |
| Tesla Supercharger, no-Tesla sin suscripción | 0,47-0,52 (Tesla: 0,28-0,45 según franja) | idem |
| Ionity | 0,62-0,66 | idem |
| Wenea | 0,42-0,59 | idem |

Defaults (**estimación**): AC pública 0,35 €/kWh; DC rápida 0,55 €/kWh.

---

## 7. Financiación y coste de oportunidad

### 7.1 Préstamo coche, bancos (septiembre-octubre 2026) [S]
| Entidad / producto | TIN | TAE | Notas | Fuente |
|---|---|---|---|---|
| Bankinter Consumer Finance | 4,45 % | 4,54 % | ≤30.000 €, ≤10 años, con comisiones | Kelisto (04-09-2026) https://www.kelisto.es/prestamos/mejor-compra/mejores-prestamos-para-comprar-un-coche-3617 |
| ING Préstamo Naranja | 5,49 % | 5,63 % | ≤60.000 €, ≤8 años, sin comisión | idem |
| Santander | 5,24 % | ~5,8 % (el dato extraído era ilegible: verificar) | apertura 1-2 %; amortización anticipada al máximo legal | idem |
| ABANCA Auto 24h | 5,25 % | 9,84 % | apertura 1,5 % | idem |
| Laboral Kutxa online | 5,95 % | 6,40 % | ≤5 años | idem |
| BBVA Coche | — | 6,50 % (ecológico desde 5,25 %) | ≤75.000 €, 96 meses | https://bankkers.com/prestamos/mejores-prestamos-coche/ ; https://www.hoyfinanzas.es/prestamos/prestamo-coche-online-bbva-tipos-interes-comisiones |
| Cetelem Auto | — | 6,75 % (otra fuente: TIN 11,99 % / TAE 12,67 %) | ≤75.000 € | bankkers; buscador Kelisto |
| Kutxabank Préstamo Coche Joven (18-30) | — | 5,11 % | ≤75.000 € | https://www.kelisto.es/prestamos-personales/bancos/kutxabank/prestamo-coche-joven |
| CaixaBank | — | 3,75 % VE / 6,75 % combustión | — | [S] resumen de buscador; **no verificado** |

- **Comisión de apertura**: habitual 0-2 %. Media en bancos 0,55 % frente a **3,24 % en concesionarios** (estudio Kelisto [S] https://www.kelisto.es/prestamos/mejor-compra/financiar-coche). No tiene límite legal, pero debe incluirse en la TAE.
- **Financiación de concesionario**: TIN medio 7,54 % (Kelisto, ídem). TAE típica del 7-10 %, a menudo con seguros vinculados y cuota final (multiopción) [S] https://www.motor.es/noticias/financiar-coche-intereses-tin-tae-2026115340.html
- **Referencia oficial** [P]: tipo de nuevas operaciones de crédito al consumo de hogares, área del euro, 7,46-7,59 % (marzo-abril 2026, notas BCE): https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/ComunicadosBCE/NotasInformativasBCE/26/presbce2026-80.pdf . Es dato del **área del euro**, no de España.

### 7.2 Amortización anticipada: límites legales (Ley 16/2011, art. 30) [P]
- La compensación al prestamista no puede superar el **1 %** del importe reembolsado si queda **más de 1 año** de contrato, ni el **0,5 %** si queda **1 año o menos**. Tampoco puede superar los intereses que se habrían pagado en ese periodo.
- No hay compensación en préstamos a tipo variable ni en reembolsos con seguro de amortización.
- https://www.boe.es/buscar/act.php?id=BOE-A-2011-10970

### 7.3 Euríbor 12 meses [S que cita BdE]
- **Media de septiembre de 2026: 3,247 %**. Diario 30-09-2026: ~3,33 %. Máximo desde 2024.
- https://www.euribor.com.es/2026/09/30/el-euribor-cierra-septiembre-en-el-3243-y-toca-techo-de-dos-anos-la-revision-de-octubre-golpeara-con-hasta-102-euros-mas-al-mes/ ; https://www.euribordiario.es/
- El dato oficial lo publica el BdE ("tipos de referencia oficiales") en el BOE a primeros de mes. Verificar el de septiembre cuando se publique.
- BCE [P]: subida de 25 pb el 10-09-2026 (efectiva el 16-09). **Facilidad de depósito 2,50 %**, MRO 2,65 %. https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260910~314e508016.es.html

### 7.4 Rentabilidades seguras (coste de oportunidad)
- **Letras del Tesoro 12 meses** [P]: subasta del 01-09-2026, tipo **marginal 2,846 %**, **medio 2,832 %** (anterior 2,679 %). 9 meses (08-09-2026): 2,776 % medio; 6 meses: 2,623 %; 3 meses: 2,456 %. https://www.tesoro.es/deuda-publica/subastas/resultado-ultimas-subastas/letras-del-tesoro
- **Depósitos 12 meses** [S]: 2,75-3,5 % TAE en las mejores ofertas (Mano Bank 3,46 %, Volkswagen Bank 3,15 %, Self Bank 2,75 %). https://www.kelisto.es/depositos/mejor-compra/los-mejores-depositos-2854 ; https://www.rankia.com/blog/mejores-depositos/4127358-mejores-depositos
- **Cuentas remuneradas** [S]: ~3,0-3,15 % TAE (B100 3,15 %, Trade Republic 3,04 %, bunq 3,01 %). https://www.kelisto.es/cuentas-bancarias/mejor-compra/las-mejores-cuentas-ahorro-2851
- Default coste de oportunidad (**estimación**): **2,8 % nominal** (Letra 12 m), antes de IRPF del ahorro.

### 7.5 Inflación
- **IPC adelantado septiembre 2026: 4,9 % anual** (IPCA 5,0 %; subyacente 3,1 %; agosto 4,3 %). [P] INE, 29-09-2026: https://www.ine.es/dyngs/Prensa/adIPC0926.htm
- **Banco de España** (proyecciones de junio de 2026, las últimas localizadas): IAPC **3,6 % en 2026**, **2,6 % en 2027**. 2028 no localizado. [S] https://www.pressdigital.es/articulo/economia/2026-06-18/5924195-banco-espana-mantiene-prevision-pib-2026-23-pero-eleva-inflacion-36 ; informe [P]: https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/InformesBoletinesRevistas/BoletinEconomico/26/T2/Fich/be2602-it.pdf
- **BCE** (proyecciones de septiembre de 2026, área del euro) [P]: IAPC **3,0 % (2026), 2,5 % (2027), 2,1 % (2028)**; subyacente 2,5 / 2,6 / 2,3 %. https://www.ecb.europa.eu/press/projections/html/ecb.projections202609_ecbstaff~8e340fc69d.es.html

---

## 8. Seguro de coche (primas medias)
| Dato | Valor | Fecha | Fuente |
|---|---|---|---|
| Prima media del ramo autos (ICEA; todos los vehículos) | 387,91 €/año (+7 %) | 2024 | [S, cita ICEA] https://www.inese.es/la-prima-media-en-autos-sube-un-7-en-2024/ ; ICEA: https://www.icea.es/es-ES/informacion-seguro/vision-ramos/automoviles |
| Terceros ampliado, nacional (Avant2/Versus, emisiones reales) | 410 € | ago-2026 | [S] https://blog.segurostv.es/seguro-autos-precio-primas-bajadas-2026/ |
| Todo riesgo con franquicia baja / media / alta / sin franquicia | 599 / 670 / 889 / 799 € | ago-2026 | idem |
| Terceros ampliado por combustible (Rastreator) | gasolina 279 €, diésel 332 €, eléctrico/híbrido 334 € | may-2026 | [S] https://www.bolsamania.com/noticias/mercados/economiafinanzas--el-seguro-de-coche-sube-un-3-en-2026-segun-el-comparador-rastreator--22488948.html |
| **Bilbao**: media; terceros; terceros ampliado; todo riesgo con franquicia de 300 € | 454 €; 327 €; **374 €**; **661 €** | sep-2026 | [S] https://roams.es/seguros/seguro-coche/mejor-seguro-coche-bilbao/ |
| Conductor 18-24 años, terceros ampliado | 638 € (55-64 años: 290 €) | 2026 | [S] Rastreator, enlace anterior |

Tendencia: las primas tocaron máximo histórico en el 2T-2026 (índice Kelisto [S] https://www.kelisto.es/seguros-coche/actualidad/indice-seguros-coche-kelisto), mientras el índice Avant2 muestra caídas interanuales. Las cifras dependen mucho del perfil, así que la herramienta debería pedir la prima o usar estos valores solo como placeholder.

---

## 9. Mantenimiento y averías
| Motorización | Mantenimiento anual (OCU) | Fuente |
|---|---|---|
| Eléctrico | 140 € | [S, consumo] OCU, encuesta a >85.000 conductores en 10 países europeos (año no indicado) — https://www.ocu.org/coches/coches/informe/fiabilidad-coches-electricos |
| Gasolina | 250 € | idem |
| Diésel | 250 € | idem |
| Híbrido ligero (MHEV) | 270 € | idem |
| Híbrido no enchufable (HEV) | 260 € | idem |
| Híbrido enchufable (PHEV) | 300 € | idem |

- Dato alternativo (Solera, España): eléctrico **368 €/año** frente a combustión **513 €/año** (−28 %). La mano de obra en eléctricos es ~17 % más cara (alta tensión). [S] https://www.somoselectricos.com/coches-electricos/coche-electrico-hibrido-enchufable-mantenimiento-mas-caro/20260420081200054286.html
- **Averías fuera de garantía**: coste medio por reparación en España **718 €** en 2024 (657 € en 2023), según CG Car-Garantie. [S] https://www.infobae.com/espana/2025/07/09/cuanto-gastamos-por-averias-en-el-coche-en-una-decada-los-diez-coches-mas-baratos-de-reparar/
- Averías caras de referencia [S] (RACE top 10 https://www.race.es/top-10-averias-mas-caras ; [S] https://www.infobae.com/espana/2025/11/14/estas-tres-averias-pueden-costarte-15000-euros-un-experto-en-coches-explica-como-evitarlas/):
  - Caja de cambios manual: 7.000-10.000 €.
  - Caja automática: 11.000-14.000 €.
  - Turbo: 1.000-5.000 € (~2.800 € típico).
- **Batería de tracción de un BEV fuera de garantía**: **no investigado**. La garantía habitual del fabricante es de 8 años/160.000 km (no verificado aquí).
- Modelado sugerido (**estimación**): mantenimiento según la tabla OCU, más una provisión de averías desde el fin de la garantía (año 3-4) de ~200-400 €/año en combustión/PHEV y ~100-200 €/año en BEV (excluida batería).

---

## 10. Tabla resumen de valores por defecto (para desarrollador)

| Parámetro | Valor por defecto | Tipo | Fuente principal |
|---|---|---|---|
| IEDMT ≤120 g/km | 0 % | ley | AEAT / Ley 38/1992 |
| IEDMT 121-159 g/km | 4,75 % | ley | idem |
| IEDMT 160-199 g/km | 9,75 % | ley | idem |
| IEDMT ≥200 g/km | 14,75 % (CAT/AST/BAL/VAL 16 %, MUR 15,9 %, CANT 15 %) | ley | Hacienda Trib. Autonómica 2026 |
| IEDMT Canarias | tipo estatal −1 punto | ley | AEAT |
| IEDMT Ceuta/Melilla | 0 % | ley | AEAT |
| ITP usado a particular (Bizkaia) | 4 % sobre max(precio, tabla) | ley | DFB |
| Depreciación tablas Hacienda | 100/84/67/56/47/39/34/28/24/19/17/13/10 % | ley | Orden HAC/1501/2025 |
| Tasa DGT transferencia | 55,70 € | ley | DGT |
| Tasa DGT matriculación | 99,77 € | ley | DGT |
| IVTM Bilbao 12-13,99 CVF | 153,25 € | ordenanza | Ayto. Bilbao |
| IVTM Bilbao 14-15,99 CVF | 216,95 € | ordenanza | Ayto. Bilbao |
| Bonificación IVTM Bilbao BEV | 95 % indefinida | ordenanza | Ayto. Bilbao |
| Bonificación IVTM Bilbao híbrido | 75 % × 5 años | ordenanza | Ayto. Bilbao |
| IVTM mínimo estatal 12-15,99 CVF | 71,94 € (máx. 143,88 €) | ley | TRLRHL art. 95 |
| CVF eléctrico | Pe(kW, 30 min) / 5,152 | ley | RGV anexo V |
| ITV periodicidad | 0-4 años: no; 4-10: bienal; >10: anual | ley | RD 920/2017 |
| ITV Bizkaia | gasolina 59,46 €, diésel 61,92 €, BEV/HEV 57,26 € | operador | Applus+ Iteuve |
| Ayuda Auto+ BEV (máx.) | 4.500 € (típico no UE ≤35k: 3.375 €) | ley | RD 609/2026 |
| Ayuda Auto+ PHEV (máx.) | 3.375 € (típico 2.250 €) | estimación sobre RD | RD 609/2026 |
| Precio máx. Auto+ | 45.000 € sin impuestos | ley | RD 609/2026 |
| Deducción IRPF estatal VE (no forales) | 15 % × min(precio, 20.000) → ≤3.000 € (2026) | ley | RDL 7/2026 |
| Deducción IRPF Bizkaia BEV | 5 % (10 % con achatarramiento) × min(precio, 40.000) | norma foral | NF 2/2025 |
| Deducción punto de recarga | Estatal 15 % hasta 600 €; Bizkaia 15 % hasta 750 € | ley | RDL 7/2026 / NF 2/2025 |
| Gasolina 95 | 1,85 €/l (Bizkaia, 1-10-2026) | dato | MITECO API |
| Diésel | 1,93 €/l (Bizkaia, 1-10-2026) | dato | MITECO API |
| Electricidad casa, tarifa VE | 0,09 €/kWh | estimación | Octopus / comparadores |
| Electricidad casa, PVPC valle con impuestos | 0,22 €/kWh | estimación | REE sep-2026 |
| Carga pública AC | 0,35 €/kWh | estimación | rangos §6.3 |
| Carga pública DC rápida | 0,55 €/kWh | estimación | rangos §6.3 |
| Préstamo banco, TIN | 5,5 % (TAE ~6 %) | estimación | comparadores sep-2026 |
| Comisión apertura banco | 0,5-1 % | estimación | Kelisto |
| Financiación concesionario, TIN | 7,5 % (+ apertura ~3 %) | estimación | Kelisto |
| Amortización anticipada | 1 % (>1 año restante) / 0,5 % (≤1 año) máx. | ley | Ley 16/2011 art. 30 |
| Euríbor 12 m | 3,25 % (media sep-2026) | dato | euribor.com.es (BdE) |
| Coste de oportunidad (Letra 12 m) | 2,83 % | dato | Tesoro (01-09-2026) |
| Depósito / cuenta remunerada | 3,0-3,2 % TAE | dato | comparadores |
| IPC actual | 4,9 % (sep-2026, adelantado) | dato | INE |
| Inflación esperada 2026 / 2027 / 2028 | 3,6 % / 2,6 % / 2,1 % (2028 = BCE área euro) | proyección | BdE jun-2026 / BCE sep-2026 |
| Seguro terceros ampliado (Bilbao) | 374 €/año | dato | Roams sep-2026 |
| Seguro todo riesgo con franquicia (Bilbao) | 661 €/año | dato | Roams sep-2026 |
| Seguro todo riesgo sin franquicia (nacional) | 799 €/año | dato | Avant2 ago-2026 |
| Mantenimiento anual | BEV 140 / gasolina 250 / diésel 250 / HEV 260 / MHEV 270 / PHEV 300 € | dato | OCU |
| Coste medio por reparación | 718 € | dato | CG Car-Garantie 2024 |

---

## 11. Tabla por territorio (ITP compraventa de turismo usado entre particulares)

| Territorio | ITP % | Notas |
|---|---|---|
| Andalucía | 4 | 8 % si >15 CVF; 1 % si "0 emisiones" |
| Aragón | 4 | Cuota fija según antigüedad y cilindrada (>10 años: 0/20/30 € hasta 2.000 cc) |
| Asturias | 4 | 8 % si >15 CVF |
| Illes Balears | 4 | 8 % si >15 CVF; 0 % CERO; 2 % ECO |
| Canarias | 5,5 | Cuota fija para turismos usados según antigüedad y cilindrada (tabla pendiente) |
| Cantabria | 6 | Cuotas fijas para turismos y todoterrenos usados (tabla pendiente) |
| Castilla-La Mancha | 6 | — |
| Castilla y León | 5 | 8 % si >15 CVF |
| Cataluña | 5 | 0 % "0 emisiones"; ≥10 años y <40.000 € sin autoliquidación |
| Comunitat Valenciana | 6 | 8 % si ≤5 años y >2.000 cc o valor ≥20.000 €; cuotas fijas si >5 años y <20.000 € |
| Extremadura | 6 | — |
| Galicia | 3 | 0 % "0 emisiones"; cuota fija con ≥15 años (22 € ≤1.199 cc; 38 € 1.200-1.599 cc; …) |
| Madrid | 4 | — |
| Murcia | 4 | Cuota fija para >12 años según cilindrada (tabla pendiente) |
| La Rioja | 4 | — |
| Bizkaia | 4 | Sin cuotas fijas; NF 1/2011 |
| Gipuzkoa | 4 | Sin cuotas fijas; tablas propias DFG |
| Álava | 4 | No verificado en fuente primaria |
| Navarra | 4 | Exentos turismos/todoterrenos/motos ≥10 años (salvo históricos o >40.000 €); tablas forales propias (verificar vigencia 2026) |
| Ceuta / Melilla | — | No verificado |
| Compra a profesional (cualquier territorio) | 0 (sin ITP) | IVA 21 % o REBU, incluido en el precio |

---

## Pendientes / huecos conocidos
1. Tablas completas de cuotas fijas de ITP (Aragón, Canarias, Cantabria, Galicia, Murcia, Valencia 5-12 años).
2. ITP en Álava, Ceuta y Melilla con fuente primaria. Vigencia 2026 de la exención navarra.
3. IRPF foral de Gipuzkoa, Álava y Navarra por compra de VE o punto de recarga.
4. Estado de la convocatoria 2026 de la Línea 1 del Auto+ (fecha de apertura).
5. Ordenanzas IVTM de las capitales distintas de Bilbao: verificar en fuente municipal.
6. Euríbor oficial de septiembre (BOE/BdE) y proyecciones de inflación del BdE de septiembre de 2026, si se publican.
7. Coste de sustitución de la batería de un BEV y garantías.
