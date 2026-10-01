# Datos de mercado 2026 para los Coches candidatos (España)

Investigación hecha el **1 de octubre de 2026**. Salvo que se diga otra cosa, **todas las fuentes se consultaron ese día** ("consultado 2026-10-01"). Cuando el dato viene de un artículo, se indica también la fecha del artículo.

Convenciones:

- **PVP tarifa**: precio oficial de tarifa con IVA (21 %), transporte e IEDMT incluidos, **antes** de descuentos.
- **Contado**: precio final pagando al contado, con los descuentos oficiales de marca y concesionario.
- **Financiando**: precio final si se financia con la financiera de la marca. La diferencia con Contado es el **descuento por financiar**.
- **Base**: precio sin IVA ni IEDMT según km77. Se comprueba así: `base × (1,21 + tipo IEDMT) = PVP tarifa`.
- **estimación**: dato deducido por mí y no publicado tal cual por ninguna fuente. Siempre explico cómo lo he calculado.
- "No encontrado" significa que lo busqué y no apareció en ninguna fuente fiable. No he puesto un número inventado en su lugar.

Avisos generales:

- Las ofertas de marca caducan cada mes. Muchas de las que aparecen aquí vencían el 30/09/2026 o vencen el 31/10 o el 03/11/2026. Conviene volver a comprobarlas antes de usarlas como valores por defecto.
- Las ayudas del **Plan Auto+** (el sustituto de MOVES III, regulado por el RD-ley 2/2026) aparecen dentro de varios "precios financiando" de BEV y PHEV. Se indica en cada caso. El comparador debería tratarlas como un concepto aparte y no como parte del precio.
- Algunas webs de marca (mazda.es, tesla.com, arval.es) cargan las condiciones con JavaScript y no pude leerlas directamente. En esos casos lo digo y cito la fuente secundaria que sí las recoge.

---

## 0. Datos transversales

### 0.1 Depreciación y valor residual por tipo de motor (índice GANVAM-DAT)

| Motorización | Valor retenido a 3 años (cierre 2025, publicado 20/02/2026) | Valor retenido a 3 años (1T 2025, publicado 13/05/2025) | km de referencia |
|---|---|---|---|
| Híbrido no enchufable (HEV) | **68 %** (precio medio 21.352 €) | 70,8 % | 60.000 km |
| Gasolina | **60,2 %** (16.153 €) | 67 % | 60.000 km |
| Diésel | 58,3 % | 65 % | 90.000 km |
| Híbrido enchufable (PHEV) | **59,4 %** (30.734 €) | 61 % | 60.000 km |
| Eléctrico (BEV) | **48 %** (21.884 €) | 50 % | 60.000 km |

- Fuente 2026: Ganvam, "El híbrido no enchufable, la propulsión que más valor retuvo en 2025…", 20/02/2026. https://ganvam.es/el-hibrido-no-enchufable-la-propulsion-que-mas-valor-retuvo-en-2025-con-un-precio-medio-de-21-350-euros/ . Metodología: precios reales de transacción y precios de oferta en portales.
- Fuente 2025: esdiario / coches.com, 13/05/2025, con datos Ganvam-DAT. https://www.esdiario.com/motor/250513/158955/vehiculo-hibrido-enchufable-tres-anos-antiguedad-mantiene-70-8-valor.html y https://noticias.coches.com/informes/hibridos-menos-se-deprecian-y-electricos-mas/548544
- **A 4 y 5 años no encontré ningún estudio sistemático y público** por tipo de motor para España. Highmotor (17/08/2026) solo da datos sueltos y sin fuente identificada: un Corolla híbrido conserva el 62-65 % a 4 años y un BEV de marca generalista pierde el 55-60 % a 4 años. https://www.highmotor.com/los-coches-con-mejor-valor-de-reventa-en-2026-que-segmentos-y-motorizaciones.html
- La evidencia por modelo, sacada de anuncios de usados, está en cada ficha. Son **precios de oferta de profesionales, no precios de transacción**.

**Curva de valor residual propuesta como valor por defecto (estimación).** Parto de los puntos a 3 años de GANVAM-DAT 2026. Para extender a 4 y 5 años aplico una pérdida adicional de unos 6-7 puntos por año en HEV y gasolina y de unos 8 puntos por año en BEV y PHEV. Esos ritmos salen de comparar los anuncios de 2021-2022 con los de 2023 que aparecen en las fichas. Todo esto es una estimación, no un dato publicado:

| Motorización | 3 años | 4 años | 5 años |
|---|---|---|---|
| HEV | 68 % | 62 % | 56 % |
| Gasolina / MHEV | 60 % | 54 % | 48 % |
| PHEV | 59 % | 51 % | 44 % |
| BEV (media de mercado) | 48 % | 41 % | 35 % |

Los anuncios de usados apuntan a que el Tesla Model 3 y el Mazda CX-30 retienen bastante más que la media de su tipo (ver sus fichas).

### 0.2 Seguro a todo riesgo (conductor de 40 años)

- **No encontré datos indicativos específicos de Bizkaia** para ninguno de los modelos.
- Tesla Model 3: Helvetia (la aseguradora de Tesla) cotizaba **523,82 €/año con franquicia de 1.000 €** y **849 €/año con franquicia de 400 €**. Perfil: conductor único de unos 40 años, más de 4 años de carné, garaje comunitario, sin partes y 12.000 km/año. **El dato es de enero de 2023** y no lo he podido actualizar. Motorpasión, 31/01/2023. https://www.motorpasion.com/coches-electricos/tesla-hizo-que-asegurar-sus-coches-fuera-muy-caro-luego-lanzo-su-propia-aseguradora
- Rankingsegurosespana.com (09/2026) da un rango genérico de **700-1.100 €/año** para un BEV a todo riesgo con perfil estándar. Cita una prima media de mercado de 975,6 € a cierre de 2025 atribuida a ICEA/UNESPA, que no he podido verificar en la fuente original. https://rankingsegurosespana.com/blog/mejor-seguro-para-un-tesla-model-3-en-espana-2026
- Mazda, BYD, Cupra y Toyota: no encontrado.

### 0.3 Suscripción (multimarca)

- **Bipi** (bipicar.com): **Toyota C-HR (híbrido, automático) desde 625 €/mes**, con plazos de 3, 6 o 12 meses. **Cupra Formentor (gasolina, automático) desde 655 €/mes**, sin permanencia o con 3, 6 o 12 meses. https://bipicar.com/es/es/coches/
  - Kilometraje base de **800 km/mes**, ampliable con packs hasta 2.500 km/mes. Los km no usados se acumulan. **El exceso se cobra a 0,12 €/km** al terminar. https://help.bipicar.com/hc/es/articles/21161117717532 y https://help.bipicar.com/hc/es/articles/21161117996956
  - En Bipi no había Tesla Model 3, BYD Atto 2 ni Mazda CX-30.
- **KINTO Flex** (renting flexible de Toyota, **orientado a negocio**): **Toyota C-HR 140H "o similar", desde 513 €/mes sin IVA** (620,73 € con IVA, estimación al 21 %). La tarifa es "24 meses / 1500 km" y no se aclara si los 1.500 km son al mes. Sin permanencia. Incluye seguro a todo riesgo sin franquicia, mantenimiento, neumáticos, ITV e impuestos. https://www.kinto-mobility.eu/es/es/alquiler-coches/renting-flexible
- **Arval Flex** (particulares): plazos de 1 a 24 meses y 1.000-5.000 km/mes. No encontré precios para estos modelos. https://www.arval.es/ofertas/renting-particulares-flexible
- **Ayvens Flex**: solo para empresas en España. No aplica.
- Suscripción de la propia marca (Mazda, Tesla, BYD, Cupra): no encontré ninguna para particulares en España.

### 0.4 Renting: lo que suele incluir y el exceso de km

- Ayvens (oferta para particulares, sin entrada): incluye asistencia 24/365, cambios de neumáticos ilimitados, mantenimiento, gestión de multas y red de más de 1.700 talleres. https://www.ayvens.com/es-es/ofertas-renting-particulares/
- **€/km de exceso**: ninguno de los proveedores consultados (Ayvens, Arval, Toyota/KINTO, Volkswagen Renting, Revel) lo publica. Ayvens solo dice que se paga una "compensación" por el exceso y que puede haber un abono por los km no recorridos. https://www.ayvens.com/es-es/sobre-nosotros/blog/gestion-de-flota/limite-kilometros-contrato-leaseplan/ — **No encontrado.** Como referencia publicada solo está Bipi, con 0,12 €/km.

### 0.5 Caballos fiscales (CVF)

Fórmula para motores de 4 tiempos (RD 2822/1998): `CVF = 0,08 × (0,785 × D² × R)^0,6 × N`, con D (diámetro) y R (carrera) en cm y N el número de cilindros. Las fuentes consultadas solo dan la cilindrada, así que los CVF de la tabla final son una **estimación**. Para calcularlos usé las cotas de diámetro × carrera de cada motor que conozco, **sin verificarlas en una fuente primaria**:

- Mazda 2.5 e-Skyactiv G (89 × 100 mm, 4 cilindros): unos **15,2 CVF**.
- Mazda 2.0 e-Skyactiv G (83,5 × 91,2 mm): unos **13,3 CVF**.
- VW 1.5 TSI/eTSI/e-Hybrid (74,5 × 85,9 mm): unos **11,2 CVF**.
- Toyota 1.8 2ZR-FXE (80,5 × 88,3 mm): unos **12,5 CVF**.
- En BEV (Tesla, BYD) la potencia fiscal se toma de la potencia en kW. Las ordenanzas forales y municipales también suelen bonificar a los BEV.

---

## 1. Mazda CX-30 e-Skyactiv G (gasolina mild hybrid, 140 CV)

**Cambio de motor importante.** Desde el modelo 2024/2025, el CX-30 que se vende en España monta el **2.5 e-Skyactiv G de 140 CV (103 kW)**, no el 2.0. El **2.0 e-Skyactiv G (122 y 150 CV)** es el que equipan los usados de 2023. Fuente: km77, listado de versiones. https://www.km77.com/coches/mazda/cx-30/2020/estandar/datos

### 1a. Nuevo: versión elegida, **CX-30 2.5 e-Skyactiv G 140 CV Centre-Line, manual, tracción delantera**

Elegí Centre-Line porque es el acabado intermedio. Mazda no publica qué acabado vende más. La Prime-Line es la que lleva la oferta de financiación.

**Precio**

| Concepto | Valor | Fuente |
|---|---|---|
| PVP tarifa | **33.720 €** | mazda.es, ficha del modelo (tarjeta Centre-Line); km77 |
| Descuento oficial | 4.700 € | km77 (tarifa 08/2026) |
| Contado | **29.020 €** | km77 |
| Base (sin IVA ni IEDMT) | 26.815 € sobre tarifa | km77 |
| IEDMT | 4,75 % (135 g/km) | km77 |
| Descuento extra por financiar | **1.400 €** (estimación) | Calculado con la Prime-Line, que es la única con oferta publicada: contado 27.170 € y financiando 25.770 €. Supongo que aplica igual al Centre-Line. |

Las demás versiones, con PVP de tarifa de mazda.es: Prime-Line 31.870 €, Centre-Line 33.720 €, Homura 34.720 €, Makoto 36.070 €, Exclusive-Line 36.770 €, Takumi 38.970 €. Las versiones automáticas cuestan 2.300 € más (quecochemecompro). https://www.mazda.es/promociones/promociones-actuales/mazdacx30/ (HTML con los `priceText`) · https://www.km77.com/coches/mazda/cx-30/2020/estandar/estandar/cx-30-25-e-skyactiv-g-140-cv-centre-line/datos · https://www.quecochemecompro.com/precios/mazda-cx-30/

**Técnica (km77)**

- Motor: 2.488 cc, 4 cilindros, 103 kW / 140 CV, 238 Nm, cambio manual de 6 marchas.
- CO2 WLTP: **135 g/km**. Consumo WLTP combinado: **6,0 l/100 km**. El rango de la gama es 5,9-6,6 l/100 km.
- Etiqueta DGT: **ECO** (mild hybrid de 24 V).
- Neumáticos de serie: **215/55 R18**, con llanta de 7 × 18.
- Aviso: carwow da 1.998 cc para este motor, y es un error.

**Garantía**: **6 años o 150.000 km** desde el 01/09/2022, sin coste. Se puede ampliar hasta **10 años o 200.000 km** (coches.net, 09/06/2026). https://es.mazda-press.com/news/mazda-amplia-la-garantia-de-toda-su-gama-a-6-anos/ · https://www.coches.net/consejos/garantias-coche-nuevo-espana

**Neumáticos, juego de 4**: Continental EcoContact 6 a unos 124-139 €/ud. y Michelin Primacy 4 a unos 157-203 €/ud. (Midas, Carter Cash, neumaticos-online.es). **Juego de 4: unos 500-640 €** más montaje (estimación). https://www.midas.es/presupuestos-online/neumaticos/neumaticos-215-55-R18_W215-H55-D18

**Renting para particulares**

| Proveedor | Versión | Cuota con IVA | Plazo | km/año | Entrada | Fuente |
|---|---|---|---|---|---|---|
| **Ayvens** | 2.5 140 CV **AT** Centre-Line | **405 €/mes** | 36 m | 10.000 | 0 € | https://www.ayvens.com/es-es/ofertas-renting-particulares/ |
| Agregador (rentingfinders) | 2.5 140 CV Centre-Line, manual | 389 €/mes | n/d | n/d | 0 € | https://rentingfinders.com/ofertas-renting-mazda/cx-30/ |
| Agregador (rentingfinders) | 2.5 140 CV Prime-Line, manual | 356 €/mes | n/d | n/d | 0 € | ídem |

En el caso de Ayvens, el exceso de km es "compensación" sin cifra publicada (ver 0.4).

**Financiación con cuota final: Mazda FlexiOpción**

Versión: 2.5 140 CV 6MT FWD **Prime-Line**. Oferta válida hasta el 30/09/2026. **No pude leer el texto legal en mazda.es** porque se carga con JavaScript. Lo tomo del texto legal de mazda.es que reproduce el resultado del buscador:

- Precio al contado: 27.170 €. Precio financiando: 25.770 €.
- Entrada: **6.820,79 €**.
- Plazo de **36 meses**: 1 cuota de 137,11 €, **34 cuotas de 149 €** y **cuota final de 16.958,03 €**.
- **Máximo 30.000 km en total**, es decir, 10.000 km/año.
- **TIN 5,99 %**, **TAE 7,43 %**, **comisión de apertura del 3 % (568,47 €)**.
- Importe del crédito: 18.949,08 €. Coste total del crédito: 3.780,53 €. Importe total adeudado: 22.729,61 €.
- **€/km de exceso: no publicado.** En los foros de clientes se habla de "céntimos por km excedido", sin cifra (clubmazda.net). No encontrado.
- La cuota final como porcentaje del precio financiado es 16.958 / 25.770 = **65,8 % a 3 años y 30.000 km** (cálculo propio).

**Préstamo clásico de marca**: no encontré condiciones publicadas.

**Suscripción**: Mazda no tiene suscripción propia en España (no encontrado). Bipi no tiene el CX-30.

### 1b. Usado: **CX-30 2.0 e-Skyactiv G (122 o 150 CV) de 2023, con unos 45.000 km**

- coches.net, búsqueda de CX-30 de 2023 (consultado 2026-10-01): **77 anuncios, precio medio 23.201 €, km medio 54.280**. https://www.coches.net/mazda/cx30/segunda-mano/2023/
  - Anuncios de referencia, todos de profesional: 2.0 150 CV Homura con 44.539 km a **24.490 €**; 2.0 150 CV Homura con 50.509 km a **22.700 €**; 2.0 122 CV Evolution con 28.000 km a 25.500 €; 2.0 122 CV Evolution con 78.000 km a 22.900 €.
- OcasionPlus: 2.0 e-Skyactiv-G 122 CV Zenith AT de 2023 con 46.797 km a **21.900 €**. https://www.ocasionplus.com/coches-segunda-mano/mazda-cx30-20-eskyactivg-zenith-at-con-46797km-2023-xdhybqad
- **Rango típico en concesionario con unos 45.000 km: 21.900-25.000 €.** Valor central: **unos 23.500 €** (estimación).
- Especificaciones del 2.0 e-Skyactiv G 122 CV: 1.998 cc, 90 kW. Es mild hybrid de 24 V con etiqueta ECO. km77: https://www.km77.com/coches/mazda/cx-30/2020/estandar/zenith/cx-30-zenith-20-skyactiv-g-90-kw-122-cv2/datos
- **Evidencia de depreciación**: en 2023, el Zenith 2.0 122 CV manual tenía un precio con descuento de **29.286 €** (con 3.200 € de descuento oficial sobre tarifa, según km77). Un usado de 2023 a unos 23.200 € de media equivale a **~79 % del precio con descuento tras unos 3 años** (estimación). Ojo: la media de coches.net mezcla acabados y motores de 122 y 150 CV, y son precios de oferta. Aun así, sale muy por encima de la media de gasolina de GANVAM (60 %).

---

## 2. BYD Atto 2 (eléctrico), nuevo

Versión elegida: **Atto 2 Comfort (64,8 kWh, 150 kW / 204 CV)**. Es la única con autonomía comparable a las demás (430 km). BYD no publica qué acabado vende más. Active y Boost (45,1 kWh, 130 kW / 177 CV, 312 km) aparecen como referencia.

**Precio**

| Concepto | Comfort | Active | Boost | Fuente |
|---|---|---|---|---|
| PVP tarifa | **36.200 €** | 29.990 € | 31.990 € | km77 (Comfort); BYD, nota de prensa de 11/2025 |
| Descuento oficial | 4.460 € | | | km77 (tarifa 06/2026) |
| Contado | **31.740 €** | 25.790 € (km77) / 25.864 € (BYD, 10/2026) | 27.047 € | km77; byd.com |
| Financiando | **27.415 €** (oferta de 05/2026) | **18.739 €** (válido hasta el 31/10/2026) | n/d | somoselectricos (14/05/2026); byd.com |
| Base sin IVA | 29.917 € (sobre tarifa) | | | km77 |
| IEDMT | 0 % | | | km77 |

- **El "precio financiando" de BYD no es un descuento comercial de verdad.** Incluye el **adelanto de 3.375 € del Plan Auto+**, que paga CA Auto Bank y que el cliente tiene que devolver si no tiene derecho a la ayuda. También incluye un **incentivo de 950 € del Plan CAE** (cesión de los Certificados de Ahorro Energético). En el Comfort: 31.740 − 27.415 = 4.325 = 3.375 + 950.
- Condiciones de la financiación lineal de BYD: importe mínimo financiado de 15.000 €, **plazo mínimo de 72 meses y permanencia de 36 meses**.
- **BYD indica expresamente que el precio "no incluye gastos de gestoría, ni matriculación ni transporte"**. Es distinto de Mazda, Toyota y Cupra, que sí los incluyen. El importe de esos gastos no se publica (no encontrado).
- Fuentes: https://www.km77.com/coches/byd/atto-2/2025/estandar/estandar/atto-2-comfort/datos · https://www.byd.com/es-es/promociones/atto-2-promocion · https://www.byd.com/es-es/news-list/byd-amplia-gama-atto-2-con-version-comfort · https://somoselectricos.com/byd-atto-2-electrico-149-euros-mes-precio-financiado/

**Técnica (km77 y byd.com)**

- Potencia: 150 kW / 204 CV, 310 Nm.
- Batería LFP Blade de **64,8 kWh**. Active y Boost llevan 45,1 kWh.
- Autonomía WLTP: **430 km** (604 km en ciclo urbano).
- Consumo WLTP: **17,4 kWh/100 km**. El rango de la gama es 16-17,4. En la prueba de km77 en autovía consumió 21,7 kWh/100 km.
- Carga en continua (DC) hasta 155 kW, del 10 al 80 % en 25 minutos. Cargador de alterna (AC) de 11 kW.
- Etiqueta **CERO** y CO2 0.
- Neumáticos **215/60 R17 96H**, de serie Hankook iON GT.

**Garantía**: vehículo **6 años o 150.000 km**. Batería y sistema de propulsión **8 años**. El límite de km de la batería es **250.000 km** según coches.net (09/06/2026) y movilidadelectrica.com (28/05/2026). https://www.coches.net/consejos/garantias-coche-nuevo-espana · https://movilidadelectrica.com/garantia-del-coche-electrico-2026/

**Neumáticos, juego de 4**: Hankook iON GT SUV 215/60 R17 96H entre 102 y 126 €/ud. (grip500, neumaticos-online.es, 1001neumaticos, MotorTown). **Juego de 4: unos 420-500 €** más montaje (estimación). https://www.grip500.es/neumatico/215-60-17/hankook-ion-gt-suv-ik41a-gp1866558

**Renting para particulares**

- **Eléctrico: no encontré ninguna oferta verificable** del Atto 2 BEV en un proveedor primario. Ayvens y coches.net solo listan el Atto 2 **DM-i** (híbrido enchufable) y Revel no tiene Atto 2 en flota. Un snippet de buscador hablaba de 580 €/mes con IVA para el Comfort, pero no pude verificarlo. **No encontrado.**
- Como referencia del DM-i, que es otro motor: Ayvens ofrece el **Atto 2 DM-i Active a 468 €/mes con IVA, 72 meses, 10.000 km/año y sin entrada**. https://www.ayvens.com/es-es/ofertas-renting-particulares/ · En coches.net el DM-i Active sale a 454 €/mes y el DM-i Boost a 502 €/mes con IVA, ambos a 60 meses y 10.000 km. https://www.coches.net/renting/byd/atto_2/

**Financiación con cuota final: BYD "Easy Plan" (CA Auto Bank)**

- **Comfort** (oferta válida hasta el 31/05/2026, publicada el 14/05/2026; no he encontrado una versión más reciente):
  - Precio contado 31.740 €, precio financiado 27.415 € (incluye el adelanto del Plan Auto+).
  - Entrada **9.032,76 €**.
  - **36 cuotas de 149 €** y **cuota final de 16.652 €**.
  - Comisión de apertura del **3,75 % (712,29 €)**.
  - La fuente no da TIN ni TAE.
  - https://somoselectricos.com/byd-atto-2-electrico-149-euros-mes-precio-financiado/
- **Active** (oferta en vigor, válida hasta el 31/10/2026):
  - Precio contado 25.790 €, precio financiado 22.289 €.
  - Entrada **6.339,86 €**.
  - **36 cuotas de 149 €** y **cuota final de 14.447,80 €**.
  - **TIN 6,99 %**, **TAE 7,17 %**, comisión del 3,75 % (618,01 €) pagada al contado.
  - **10.000 km/año.**
  - €/km de exceso: no publicado.
  - https://www.ca-autobank.es/ofertas-financiacion/byd-atto-2-active/
- Cuota final del Comfort sobre su precio financiado: 16.652 / 27.415 = **60,7 % a 3 años y 30.000 km** (cálculo propio).
- Préstamo clásico: la "Financiación Lineal" pide un mínimo de 72 meses y no publica TIN (no encontrado).

**Suscripción**: no encontrada (ni de BYD ni en Bipi).

**Depreciación**: BYD no tiene todavía historial de 3 años en España, porque el Atto 2 llegó en 2025. Lo único publicado es una estimación sin metodología de ahorrove.es: depreciación de un 40-45 % a 3 años para BYD. Para el comparador uso la media de BEV de GANVAM: **48 % retenido a 3 años**. Teniendo en cuenta las bajadas de precio de las marcas chinas, conviene aplicarle un ajuste a la baja de unos 5 puntos (estimación).

---

## 3. Tesla Model 3 RWD ("Model 3 Standard / Tracción trasera")

### 3a. Nuevo: versión elegida, **Model 3 Tracción trasera (Standard)**

La gama en España (10/2026) es: Standard RWD, Premium Gran Autonomía RWD, Premium Gran Autonomía AWD y Performance.

**Precio**

| Concepto | Valor | Fuente |
|---|---|---|
| PVP Standard RWD | **36.990 €** más **980 € de gastos de destino y documentación** = **37.970 €** | referidotesla.com (seguimiento de precios, 28/09/2026); diariomotor (22/05/2026) |
| Oferta "Tesla Bonus" | **33.365 € al contado** para pedidos del 07/07 al **30/09/2026** con entrega antes del 31/12/2026. **Caducada a fecha de consulta.** No consta si se ha renovado. | diariomotor, 04/09/2026 |
| Con Plan Auto+ | unos 30.000 € (aprox., según diariomotor) | diariomotor, 22/05/2026 |
| Premium Gran Autonomía RWD | 44.990 € | referidotesla.com |
| IEDMT | 0 % | |

- Precio sin IEDMT y base sin IVA: Tesla no los desglosa. Como el IEDMT es 0 %, la base sería 37.970 / 1,21 ≈ **31.380 €** (cálculo propio).
- No hay descuentos de concesionario: Tesla vende con precio cerrado.
- Fuentes: https://www.referidotesla.com/cambios-precios-tesla/ · https://www.diariomotor.com/noticia/oferta-tesla-model-3-septiembre-2026/ · https://www.diariomotor.com/noticia/financiacion-tesla-model-3-2026/

**Técnica**

- Potencia: **208 kW / 283 CV**, 420 Nm.
- Batería LFP de **60,0 kWh útiles** (64 kWh nominales).
- Autonomía WLTP: **534 km**.
- Consumo WLTP: **13,0 kWh/100 km** (130 Wh/km con pérdidas de carga; el consumo del vehículo es 112 Wh/km). Diariomotor da 12,2 kWh/100 km.
- Disponible desde 12/2025.
- Fuente: ev-database. https://ev-database.org/car/3403/Tesla-Model-3-RWD
- Etiqueta **CERO**.
- Neumáticos: medida habitual del Model 3 con llanta de 18" **235/45 R18**. No la he confirmado en una ficha oficial de la versión Standard (tesla.com devuelve 403). Montaje de serie habitual: Michelin Pilot Sport 4 o Hankook iON.

**Garantía**: vehículo **4 años o 80.000 km**. Batería y propulsión **8 años o 160.000 km** en RWD (movilidadelectrica.com, 28/05/2026). Coches.net (09/06/2026) da 240.000 km para la batería. Hay que verificarlo en las condiciones de Tesla. Tesla no ofrece ampliación gratuita. https://movilidadelectrica.com/garantia-del-coche-electrico-2026/ · https://www.coches.net/consejos/garantias-coche-nuevo-espana

**Neumáticos, juego de 4**: Michelin Pilot Sport 4 235/45 R18 98Y XL entre 184 y 194 €/ud. (rodi.es, Feu Vert); Hankook Ventus Evo a unos 110 €/ud. **Juego de 4: unos 450-780 €** más montaje, según la marca (estimación). https://www.rodi.es/neumaticos/michelin/pilot-sport-4-235-45-r18-98-y-8609/

**Renting para particulares**

| Proveedor | Cuota con IVA | Plazo | km/año | Entrada | Fuente |
|---|---|---|---|---|---|
| Listado en coches.net, proveedor no identificado | **672 €/mes** | 60 m (también 24, 36 y 48 m) | 10.000 | n/d | https://www.coches.net/renting/tesla/model_3/ |
| rentingfinders (10/2026) | 672 €/mes | n/d | n/d | 0 € | https://rentingfinders.com/ofertas-renting-tesla/model-3/ |

- Ayvens, Arval y Revel: sin oferta del Model 3 a fecha de consulta.
- Lo que incluye: seguro a todo riesgo, mantenimiento, impuestos e ITV, según los agregadores.

**Financiación con cuota final: "Tesla Future" (multiopción)**

Datos de diariomotor (22/05/2026), con el TIN promocional de esas fechas:

- Entrada **7.250 €**.
- 1 cuota de 297 €, **58 cuotas de 299 €** y **cuota final de 14.312 €** (60 meses).
- **TIN 2,24 %**, **TAE 2,27 %**.
- **Límite de 10.000 km/año**, con penalización por exceso. **El €/km no se publica** (no encontrado).
- Comisión de apertura: no indicada.
- Cuota final sobre el precio sin bonus: 14.312 / 37.970 = **37,7 % a 5 años y 50.000 km** (cálculo propio).

**Préstamo clásico de Tesla**

- En la promoción de mayo de 2026: **TIN 1,99 %, TAE 2,01 %**. Ejemplo: entrada de 14.000 €, 60 meses de 399 €, coste total del crédito 1.170 € (diariomotor, 22/05/2026).
- **Desde el 28/09/2026** el tipo del Model 3 Standard subió a **TIN 7,00 %, TAE 7,25 %**. El Gran Autonomía RWD se queda en 5,75 % / 5,90 % (referidotesla.com). **Es el dato más reciente.**

**Suscripción**: no encontrada (ni de Tesla en España ni en Bipi).

### 3b. Usado: **Model 3 RWD de 2023, con unos 50.000 km**

Los Model 3 de 2023 incluyen tanto el modelo anterior como el primer Highland (pedidos desde 09/2023).

- coches.net, búsqueda de Model 3 de 2023: **39 anuncios, precio medio 31.342 €, km medio 72.745**. https://www.coches.net/tesla/model_3/segunda-mano/2023/
  - Anuncios de RWD (profesional): 35.464 km a 31.990 €; **39.582 km a 32.985 €**; **46.595 km a 33.990 €**; 60.000 km a 30.000 €; 79.765 km a 30.890 €; 105.347 km a 30.990 €.
  - Otro anuncio de coches.net: RWD con 50.383 km a **28.390 €** (Mataró).
- OcasionPlus: "Gran Autonomía RWD 283 CV" de 2023 con 69.104 km a 32.790 €. https://www.ocasionplus.com/coches-segunda-mano/tesla-model-3-gran-autonoma-rwd-con-69104km-2023-nie8vqah
- **Rango típico en concesionario con unos 50.000 km: 28.400-34.000 €.** Valor central: **unos 31.500 €** (estimación).
- Especificaciones del usado: las de la versión RWD de 2023, con batería LFP de unos 60 kWh y 513 km WLTP. La consulta es del 16/07/2025 en diariomotor. Etiqueta CERO.
- **Evidencia de depreciación**: el RWD (Highland) de 09/2023 costaba **39.990 €** (somoselectricos y xataka, 09/2023). Un usado a 31.500 € equivale a **~79 % del PVP antes de ayudas** a unos 3 años, y a más todavía si se descuentan las ayudas MOVES III de 4.500-7.000 € que existían entonces (estimación). Se separa mucho del 48 % medio de BEV de GANVAM. Las causas probables son que es un modelo muy demandado y que los precios de los nuevos actuales están en un nivel parecido. Model 3 de 2022 (4 años): **38 anuncios, precio medio 29.130 €, km medio 85.312** (coches.net). https://www.coches.net/tesla/model_3/segunda-mano/2022/ · https://somoselectricos.com/desvelado-nuevo-tesla-model3-desde-39990-euros-espana/

---

## 4. Cupra Formentor 1.5 TSI 150 CV (gasolina), nuevo

Versión elegida: **Formentor 1.5 TSI 110 kW (150 CV), manual de 6 marchas**, el acceso de gasolina "pura" que pide el enunciado. km77 la da como **en venta**, con tarifa de 03/2026. **Las ofertas de Cupra (financiación y renting) son para el 1.5 eTSI 150 CV DSG (mild hybrid, ECO)**, así que lo incluyo también. Es la versión de 150 CV que Cupra promociona y la más parecida a lo que se vende.

**Precio**

| Concepto | 1.5 TSI 150 manual | 1.5 eTSI 150 DSG (MY27) | Fuente |
|---|---|---|---|
| PVP tarifa | **39.062 €** (calculado: 31.063 × 1,2575) | n/d | km77 |
| Descuento oficial | 5.800 € | | km77 |
| Contado | **33.262 €** | **35.391,71 €** | km77; cupra.com |
| Financiando | n/d | **34.541,71 €** (descuento por financiar de 850 €) | cupra.com |
| Base sin IVA ni IEDMT | 31.063 € sobre tarifa | | km77 |
| IEDMT | 4,75 % | 4,75 % (132-144 g/km) | |

- El precio "financiando" de Cupra incluye IVA, transporte, IEDMT, descuento de marca y concesionario y la "bonificación" de Volkswagen Bank. La oferta era válida hasta el 30/09/2026.
- https://www.km77.com/coches/cupra/formentor/2024/estandar/estandar/formentor-15-tsi-110-kw-150-cv/datos · https://www.cupra.com/es-es/ofertas/cupra-formentor-etsi-150cv

**Técnica**

- 1.5 TSI manual (km77): 1.498 cc, 4 cilindros, 110 kW / 150 CV, 250 Nm. **CO2 137 g/km**, **6,1 l/100 km**. Etiqueta **C**. Neumáticos **245/45 R18 96W**.
- 1.5 eTSI DSG (texto legal de Cupra): **5,8-6,4 l/100 km** y **132-144 g/km**. Etiqueta **ECO**. Cupra cita llanta de 19" en esta versión.

**Garantía**: **3 años sin límite de km** (coches.net, 09/06/2026). Se puede ampliar pagando hasta **5 años o 100.000 km** ("Extensión de garantía CUPRA"). https://www.cupraofficial.es/cupra-care/garantia-cupra · https://www.coches.net/consejos/garantias-coche-nuevo-espana

**Neumáticos, juego de 4 (245/45 R18)**: Bridgestone Turanza 6 o T005 entre 141 y 153 €/ud. y Michelin Pilot Sport 4 entre 182 y 200 €/ud. (Oponeo, Norauto, Euromaster). **Juego de 4: unos 570-800 €** más montaje (estimación). https://www.oponeo.es/neumaticos/bridgestone/245-45-r18

**Renting para particulares**

| Proveedor | Versión | Cuota con IVA | Plazo | km/año | Entrada | Fuente |
|---|---|---|---|---|---|---|
| **Volkswagen Renting** (oferta oficial Cupra) | 1.5 eTSI 150 DSG MY26.5 | **425 €/mes** | 48 m | 10.000 | 0 € | cupra.com/es-es/ofertas (nota 6). **Válida hasta el 31/08/2026**: puede estar caducada. |
| Listado en coches.net | 1.5 eTSI 150 DSG | 429 €/mes | 36 m | 10.000 | n/d | https://www.coches.net/renting/cupra/formentor/ |
| Listado en coches.net | 1.5 eTSI 150 DSG Beyond | 485 €/mes | 60 m | 10.000 | n/d | ídem |

- Volkswagen Renting incluye mantenimiento y desgaste en la red oficial, seguro, reparaciones y asistencia. **No incluye el cambio de neumáticos.** https://www.cupra.com/es-es/ofertas
- 1.5 TSI manual: no encontré oferta de renting.

**Financiación con cuota final: CUPRA Flex / "Compra Flexible" (Volkswagen Bank)**

1.5 eTSI 150 DSG MY27, oferta válida hasta el 30/09/2026:

- Entrada **7.693,71 €**.
- **48 cuotas de 220 €** y **cuota final de 23.290,19 €**, **calculada con 10.000 km/año**.
- **TIN 6,95 %**, **TAE 8,34 %**, **comisión de apertura del 3,50 % (939,68 €) al contado**.
- Importe financiado: 26.848 €. Intereses: 7.002,19 €. Importe total adeudado: 34.789,87 €. Precio total a plazos: 42.483,58 €.
- Crédito mínimo de 18.000 €, con **permanencia mínima de 48 meses**.
- CUPRA Flex en general: plazos de 36 a 60 meses y **10.000 a 40.000 km/año**. Cupra dice "garantía y mantenimiento incluidos", pero el texto legal de la oferta no lo detalla.
- **€/km de exceso: no publicado.** La FAQ de VWFS menciona una **tolerancia de 1.250 km** sin coste (no encontrado en el contrato). https://www.cupra.com/es-es/servicios-financieros/cupra-flex
- Cuota final sobre el precio financiando: 23.290 / 34.542 = **67,4 % a 4 años y 40.000 km** (cálculo propio).

**Préstamo clásico**: no encontré condiciones publicadas.

**Suscripción**: Bipi, **Cupra Formentor gasolina automático desde 655 €/mes**, sin permanencia o con 3, 6 o 12 meses, 800 km/mes y 0,12 €/km de exceso (ver 0.3).

**Evidencia de depreciación** (coches.net, Formentor de 2022, unos 4 años): **389 anuncios, precio medio 24.636 €, km medio 77.545**.

- 1.5 TSI 150 DSG: 44.978 km a 24.900 €; 59.900 km a 25.490 €; 64.761 km a 24.990 €.
- 1.5 TSI 150 manual: 91.644 km a 20.990 €.
- https://www.coches.net/cupra/formentor/segunda-mano/2022/
- No encontré el precio de nuevo de 2022 para calcular el porcentaje exacto. Si se toma como referencia un precio con descuento en 2022 de unos 33.000-35.000 € (estimación), el 1.5 TSI DSG retiene **~71-75 % a 4 años y unos 50.000 km** (estimación).

---

## 5. Cupra Formentor e-Hybrid 204 CV (PHEV), nuevo

Versión elegida: **Formentor 1.5 TSI e-HYBRID 150 kW (204 CV) DSG-6**, de la generación 2024 en adelante, con batería de 19,7 kWh útiles. Cupra hace la oferta con el acabado **Beyond Core MY27**. La 204 CV es la potencia actual equivalente a la que pide el enunciado.

**Precio**

| Concepto | Valor | Fuente |
|---|---|---|
| PVP tarifa (Beyond) | **48.540 €** (calculado: 40.116 × 1,21) | km77, tarifa 03/2026 |
| Descuento oficial (Beyond) | 3.820 €, que deja el precio en **44.720 €** | km77 |
| Contado (Beyond Core MY27) | **40.836,25 €** | cupra.com, texto legal |
| Financiando (Beyond Core MY27) | **39.986,25 €** (850 € por financiar) | cupra.com |
| IEDMT | 0 % | km77 |
| Plan Auto+ | La financiación de Cupra mete una **cuota irregular de 3.375 € en el mes 12** "en previsión de recibir la ayuda del Plan Auto+". Si la ayuda no llega, el cliente la paga igual. Quecochemecompro cita 2.925 € de Plan Auto+ para el Formentor PHEV. | cupra.com; quecochemecompro |

https://www.cupraofficial.es/ofertas/cupra-formentor-ehybrid-204cv · https://www.km77.com/coches/cupra/formentor/2024/estandar/phev/formentor-15-ehybrid-150-kw-204-cv-dsg-beyond/datos

**Técnica**

- Potencia: 1.498 cc. Motor térmico de 150 CV y eléctrico de 85 kW / 116 CV. **Potencia del sistema: 150 kW / 204 CV**, 350 Nm (km77).
- **Batería de 25,7 kWh brutos y 19,7 kWh útiles** (km77).
- **Autonomía eléctrica WLTP de 115-125 km** (Cupra) y de 143-163 km en ciclo urbano (angurten.de).
- Consumo WLTP ponderado: **1,4-1,6 l/100 km** y **32-37 g/km**, según el texto legal de Cupra España (09/2026, probablemente homologación Euro 6e-bis). km77 da 1,5 l/100 km y 32 g/km. Con la homologación anterior, en Alemania se publicaba 0,4-0,5 l/100 km y 9-10 g/km.
- **Consumo con batería descargada (charge-sustaining) WLTP: 5,4-5,8 l/100 km** y 122-131 g/km. Fuente: angurten.de, ficha de datos técnicos alemana según Pkw-EnVKV. No encontré esta cifra en una fuente española. https://www.angurten.de/is/technische-daten/Cupra-Formentor-15+e-Hybrid+(204+PS)-110-kW-150-PS-1917-19515.html
- **Consumo eléctrico WLTP: 16,1-17,2 kWh/100 km** (misma fuente).
- Carga: DC a 50 kW, del 10 al 80 % en 26 minutos; AC a 11 kW, carga completa en unas 2,5 horas (km77).
- Etiqueta **CERO**.
- Neumáticos **245/45 R18 96W** (km77, Beyond).

**Garantía**: **3 años sin límite de km**, ampliable pagando hasta 5 años o 100.000 km. **Batería de alto voltaje: 8 años o 160.000 km** (coches.net, 09/06/2026; cupraofficial.es).

**Neumáticos, juego de 4**: igual que el 1.5 TSI. **Unos 570-800 €** (estimación).

**Renting para particulares**

| Proveedor | Cuota con IVA | Plazo | km/año | Entrada | Fuente |
|---|---|---|---|---|---|
| **Arval** (a través de CaixaBank) | **unos 445-450 €/mes** | 48 m | 10.000 | 0 € | Snippet de búsqueda de arval.es y caixabank.es. **No pude abrir la página de Arval (403, contenido por JavaScript): sin verificar.** https://www.arval.es/renting-particulares/cupra/formentor/15-tsi-e-hybrid-150kw-204-cv-dsg |
| Listado en coches.net | **509 €/mes** | 60 m | 10.000 | n/d | https://www.coches.net/renting/cupra/formentor/ |

**Financiación con cuota final: CUPRA Flex (Volkswagen Bank)**

Beyond Core MY27, oferta válida hasta el 30/09/2026:

- Entrada **7.814,50 €**.
- **47 cuotas de 235 €** y **1 cuota de 3.375 € en el mes 12** (la del Plan Auto+).
- **Cuota final de 26.283,14 € en el mes 48**, **calculada con 10.000 km/año**.
- **TIN 7,45 %**, **TAE 9,12 %**, **comisión de apertura del 3,95 % (1.270,78 €) al contado**.
- Importe financiado: 32.171,75 €. Intereses: 8.531,29 €. Importe total adeudado: 41.973,82 €. Precio total a plazos: 49.788,32 €.
- Crédito mínimo de 10.000 € y permanencia de 48 meses.
- €/km de exceso: no publicado.
- Cuota final sobre el precio financiando: 26.283 / 39.986 = **65,7 % a 4 años y 40.000 km** (cálculo propio).

**Suscripción**: no encontrada para la versión PHEV. Bipi solo tiene el Formentor de gasolina.

**Evidencia de depreciación** (generación anterior, 1.4 e-Hybrid 204 CV con batería de 12,8 kWh):

- 2022 con 88.695 km a **23.400 €** (coches.net).
- 40.171 km a **26.295 €** (Grupo Palacios). https://www.grupopalacios.es/coche-detalle/cupra-formentor-14-e-hybrid-150kw-204-cv-dsg-180933
- Con un PVP en 2021 de unos 38.640 € (highmotor, lanzamiento en 2021), retiene **~61-68 % a 4-5 años** (estimación). Encaja con el 59,4 % medio de PHEV de GANVAM a 3 años. Para la generación actual, de autonomía mucho mayor, cabe esperar algo mejor, pero no hay datos todavía.

---

## 6. Toyota C-HR híbrido (HEV), nuevo

Versión elegida: **C-HR Hybrid 140 (140H) Advance**, 1.8, tracción delantera.

- Es la versión de las promociones de Toyota y el acabado de acceso de la gama 140H. La gama 140H tiene Advance, Spirit y GR Sport (km77).
- El **200H** hoy solo se vende como **GR Sport AWD-i a 38.500 €** con descuento (197 CV, 5,1 l/100 km, según km77). La promoción del 200H Advance que hay en toyota.es está **caducada** (válida hasta el 02/06/2025). La descarto como valor por defecto.

**Precio**

| Concepto | Valor | Fuente |
|---|---|---|
| PVP tarifa | **36.500 €** (calculado: 30.165 × 1,21) | km77, tarifa 06/2026 |
| Descuento oficial | 5.000 €, que deja el precio en **31.500 €** | km77 |
| Contado (oficial Toyota) | **31.725 €** | toyota.es, texto legal |
| Financiando con Toyota Easy | **28.800 €** (descuento por financiar de **2.925 €**) | toyota.es |
| Base sin IVA | 30.165 € sobre tarifa | km77 |
| IEDMT | 0 % (108 g/km) | km77 |

- El precio de Toyota incluye IVA, transporte, impuesto de matriculación y aportación del concesionario. No incluye otros gastos de matriculación ni la pintura metalizada.
- https://www.toyota.es/promociones/toyota-c-hr-140h-advance-easy-plus · https://www.km77.com/coches/toyota/c-hr/2024/estandar/estandar/c-hr-140h-advance/datos

**Técnica (km77)**

- Motor: 1.798 cc, 4 cilindros. Térmico de 72 kW / 98 CV y eléctrico de 70 kW / 95 CV. **Potencia del sistema: 103 kW / 140 CV.**
- **CO2 108 g/km** y **4,8 l/100 km** WLTP. El rango de Toyota para la gama es 105-116 g/km y 4,7-5,1 l/100 km.
- Batería de iones de litio de 0,85 kWh.
- Etiqueta **ECO**.
- Neumáticos **225/55 R18 98V**.

**Garantía**

- **3 años sin límite de km** (coches.net, 09/06/2026).
- **Toyota Relax**: hasta **15 años o 250.000 km**, renovable año a año si se hace el mantenimiento en la red oficial (texto legal de toyota.es).
- Batería híbrida: 10 años (coches.net).
- El paquete **Toyota Easy Plus** (875 € en esta oferta) da **4 años de garantía y 4 mantenimientos**, uno cada 15.000 km o cada año.

**Neumáticos, juego de 4 (225/55 R18 98V)**: Bridgestone Turanza 6 entre 121 y 157 €/ud. y Michelin Primacy 3 entre 149 y 185 €/ud. (Oponeo, Confortauto, Norauto). **Juego de 4: unos 520-650 €** más montaje (estimación). https://www.oponeo.es/neumatico/bridgestone-turanza-6-225-55-r18-98-v

**Renting**

| Proveedor | Cuota | Plazo | km/año | Entrada | Incluye | Fuente |
|---|---|---|---|---|---|---|
| **Toyota Easy Renting** (Toyota Financial Services), **particulares** | **350 €/mes con IVA** | 48 m | 10.000 | **4.583 € con IVA** (no reembolsable) | Mantenimiento integral, asistencia 24 h, **seguro a todo riesgo sin franquicia**, impuestos, matriculación, vehículo de sustitución y gestión de multas. **No incluye neumáticos.** | https://www.toyota.es/promociones (válida hasta el 03/11/2026) |
| KINTO One (Toyota), **empresas** | 372 €/mes **sin IVA** (450,12 € con IVA, estimación) | 48 m | 10.000 | 0 € | Igual que la anterior, sin neumáticos | https://www.toyota.es/empresas/promociones/toyota-c-hr-hybrid-140h-advance-kinto-one (válida hasta el 02/11/2026) |

€/km de exceso: no publicado.

**Financiación con cuota final: Toyota Easy (Toyota Kreditbank)**

C-HR Hybrid 140 Advance, oferta válida hasta el 03/11/2026:

- Precio financiando 28.800 € más el paquete Easy Plus (875 €, opcional, que va dentro del crédito).
- Entrada **10.931,20 €**.
- Plazo de **49 meses**: **48 cuotas de 160 €** y **última cuota de 17.435,54 €**.
- **TIN 7,75 %**, **TAE 8,99 %** (la TAE no incluye el Easy Plus).
- **Comisión de apertura del 2,99 % (560,44 €), financiada.**
- Importe del crédito: 19.304,24 €. Importe total adeudado: 25.115,54 €. Coste total del crédito: 6.371,74 €.
- Capital mínimo financiado de 17.000 €.
- **Km/año: no figuran en el texto legal.** En los foros de clientes (clubtoyotachr.com) se habla de un límite por modelo (por ejemplo, 25.000 km/año en un RAV4) y de **0,10 €/km de exceso**. Es fuente secundaria y no verificada.
- Cuota final sobre el precio financiando: 17.436 / 28.800 = **60,5 % a 4 años** (cálculo propio).
- https://www.toyota.es/promociones/toyota-c-hr-140h-advance-easy-plus

**Préstamo clásico**: Toyota solo promociona Toyota Easy. No encontré financiación lineal publicada.

**Suscripción**:

- Bipi, **C-HR híbrido automático desde 625 €/mes** (3, 6 o 12 meses).
- KINTO Flex, **C-HR 140H desde 513 €/mes sin IVA** (orientado a negocio, sin permanencia).
- Ver 0.3.

**Evidencia de depreciación** (generación anterior, C-HR 125H Advance de 2021, unos 5 años):

- coches.net: **precio medio 21.248 €** con **92.678 km de media**. Anuncios de 125H Advance: 48.194 km a 23.399 €, 60.250 km a 22.190 € y 85.343 km a 21.490 €.
- km77 Ocasión: anuncios entre 19.990 y 22.990 €.
- Precio de nuevo con descuento en km77 (última tarifa, hasta 11/2023): **29.550 €**.
- Retención: **~72 % a 5 años y unos 90.000 km**, y **~79 % a 5 años y unos 50.000 km** (estimación, con precios de oferta y sin corregir la inflación del precio de nuevo). Encaja con el 68 % a 3 años de GANVAM para HEV si se tiene en cuenta la fuerte demanda de Toyota.
- https://www.coches.net/toyota/chr/segunda-mano/2021/ (vía buscador) · https://www.km77.com/coches/toyota/c-hr/2020/estandar/advance/c-hr-125h-advance/datos

---

## 7. Tabla resumen para valores por defecto

Valores en € con IVA. "Precio" es el precio de compra al contado que propongo como valor por defecto, con descuentos oficiales y sin ayudas públicas. Las cuotas finales se expresan en % sobre el precio financiado. **Est.** = estimación.

### 7.1 Precio, técnica y garantía

| Campo | Mazda CX-30 2.5 140 Centre-Line (nuevo) | Mazda CX-30 2.0 122/150 de 2023 (usado) | BYD Atto 2 Comfort | Tesla Model 3 RWD Standard (nuevo) | Tesla Model 3 RWD de 2023 (usado) | Cupra Formentor 1.5 TSI 150 (manual) | Cupra Formentor e-Hybrid 204 | Toyota C-HR 140H Advance |
|---|---|---|---|---|---|---|---|---|
| Estado | nuevo | usado, 3 años, unos 45.000 km | nuevo | nuevo | usado, 3 años, unos 50.000 km | nuevo | nuevo | nuevo |
| PVP tarifa | 33.720 | — | 36.200 | 37.970 (con destino) | — | 39.062 | 48.540 (Beyond) | 36.500 |
| Precio contado (por defecto) | **29.020** | **23.500** (rango 21.900-25.000) | **31.740** (sin transporte ni matriculación) | **37.970** (33.365 con el bonus caducado el 30/09) | **31.500** (rango 28.400-34.000) | **33.262** (eTSI DSG: 35.392) | **40.836** (Beyond Core) | **31.725** |
| Precio financiando | 27.620 (est.) | — | 27.415 (incluye Plan Auto+ y CAE) | — | — | eTSI DSG: 34.542 | 39.986 | 28.800 |
| Descuento por financiar | 1.400 (est.) | — | 0 real (4.325 de ayudas adelantadas) | 0 | — | 850 | 850 | 2.925 |
| IEDMT | 4,75 % | — | 0 % | 0 % | — | 4,75 % | 0 % | 0 % |
| Combustible | gasolina MHEV | gasolina MHEV | BEV | BEV | BEV | gasolina | PHEV | HEV |
| Potencia kW / CV | 103 / 140 | 90 / 122 (o 110 / 150) | 150 / 204 | 208 / 283 | 208 / 283 (aprox.) | 110 / 150 | 150 / 204 | 103 / 140 |
| Cilindrada (cc) | 2.488 | 1.998 | — | — | — | 1.498 | 1.498 | 1.798 |
| CV fiscales (est.) | 15,2 | 13,3 | — | — | — | 11,2 | 11,2 | 12,5 |
| CO2 WLTP (g/km) | 135 | n/d (unos 130-140) | 0 | 0 | 0 | 137 | 32-37 | 108 |
| Consumo WLTP | 6,0 l | n/d (unos 5,6-6,2 l) | 17,4 kWh | 13,0 kWh | unos 13-14 kWh (est.) | 6,1 l | 1,5 l ponderado / **5,6 l descargado** / **16,6 kWh** eléctrico | 4,8 l |
| Batería kWh (útil) | — | — | 64,8 | 60 | unos 57-60 | — | 19,7 | 0,85 (HEV) |
| Autonomía eléctrica WLTP | — | — | 430 km | 534 km | unos 491-513 km | — | 115-125 km | — |
| Etiqueta DGT | ECO | ECO | CERO | CERO | CERO | C (eTSI: ECO) | CERO | ECO |
| Garantía (años / km) | 6 / 150.000 (hasta 10 / 200.000) | lo que quede de los 6 / 150.000 | 6 / 150.000; batería 8 / 250.000 | 4 / 80.000; batería 8 / 160.000 | lo que quede; batería 8 / 160.000 | 3 / sin límite | 3 / sin límite; batería 8 / 160.000 | 3 / sin límite; Relax hasta 15 / 250.000 |
| Neumático | 215/55 R18 | 215/55 R18 (est.) | 215/60 R17 | 235/45 R18 | 235/45 R18 | 245/45 R18 | 245/45 R18 | 225/55 R18 |
| Juego de 4, sin montaje (est.) | 570 | 570 | 460 | 600 | 600 | 680 | 680 | 580 |

En la columna de garantía, "lo que quede" significa la parte de garantía del fabricante que aún no ha vencido.

### 7.2 Renting, cuota final y suscripción

| Campo | Mazda CX-30 nuevo | BYD Atto 2 Comfort | Tesla Model 3 RWD | Formentor 150 (eTSI DSG) | Formentor e-Hybrid 204 | Toyota C-HR 140H |
|---|---|---|---|---|---|---|
| **Renting**: cuota / plazo / km por año / entrada | 405 / 36 m / 10.000 / 0 (Ayvens, AT) | no encontrado (DM-i: 468 / 72 m / 10.000 / 0) | 672 / 60 m / 10.000 / 0 | 425 / 48 m / 10.000 / 0 (VW Renting) | 509 / 60 m / 10.000 (unos 450 / 48 m en Arval, sin verificar) | 350 / 48 m / 10.000 / 4.583 |
| Renting: €/km de exceso | no publicado | no publicado | no publicado | no publicado | no publicado | no publicado |
| **Cuota final**: entrada | 6.821 (Prime-Line) | 9.033 | 7.250 | 7.694 | 7.815 | 10.931 |
| Cuota final: cuota × número | 1 × 137 + 34 × 149 | 149 × 36 | 1 × 297 + 58 × 299 | 220 × 48 | 235 × 47 (más 3.375 en el mes 12) | 160 × 48 |
| Cuota final: importe (% sobre financiado) | 16.958 (65,8 %) | 16.652 (60,7 %) | 14.312 (37,7 % a 60 m) | 23.290 (67,4 %) | 26.283 (65,7 %) | 17.436 (60,5 %) |
| Cuota final: plazo / km por año | 36 m / 10.000 | 36 m / 10.000 | 60 m / 10.000 | 48 m / 10.000 | 48 m / 10.000 | 49 m / n/d |
| Cuota final: TIN / TAE | 5,99 / 7,43 | 6,99 / 7,17 (dato de la versión Active) | 2,24 / 2,27 (promo de mayo de 2026) | 6,95 / 8,34 | 7,45 / 9,12 | 7,75 / 8,99 |
| Cuota final: comisión de apertura | 3 % | 3,75 % | n/d | 3,50 % | 3,95 % | 2,99 % (financiada) |
| Cuota final: €/km de exceso | n/d | n/d | n/d | n/d (tolerancia de 1.250 km) | n/d | 0,10 (dato de foro) |
| **Préstamo clásico**: TIN / TAE | n/d | n/d (lineal con mínimo de 72 m) | **7,00 / 7,25** (desde el 28/09/2026) | n/d | n/d | n/d |
| **Suscripción** (Bipi): cuota con IVA | — | — | — | 655 (gasolina auto) | — | 625 |

Para Toyota C-HR también existe KINTO Flex a 513 €/mes sin IVA, orientado a negocio. Condiciones generales de Bipi: 800 km/mes, 0,12 €/km de exceso y permanencia de 0, 3, 6 o 12 meses.

### 7.3 Valor residual por defecto (% del precio de compra; ver 0.1)

| Coche | 3 años | 4 años | 5 años | Base |
|---|---|---|---|---|
| Mazda CX-30 (gasolina MHEV) | 70 % | 64 % | 58 % | Est.: media de gasolina de GANVAM (60 %) corregida al alza con los anuncios de CX-30 (unos 79 %) y con la cuota final de FlexiOpción (65,8 % a 3 años) |
| BYD Atto 2 (BEV) | 45 % | 38 % | 32 % | Est.: media de BEV de GANVAM (48 %) menos 3 puntos por marca nueva y guerra de precios. Cuota final de BYD: 60,7 % a 3 años |
| Tesla Model 3 RWD (BEV) | 60 % | 52 % | 45 % | Est.: anuncios con unos 79 % sobre el PVP de 2023 y cuota final de Tesla del 37,7 % a 5 años. Se queda en un punto intermedio por prudencia |
| Cupra Formentor 1.5 TSI (gasolina) | 62 % | 56 % | 50 % | Est.: media de gasolina de GANVAM (60,2 %) y anuncios de 2022 (unos 71-75 % a 4 años). Cuota final: 67,4 % a 4 años |
| Cupra Formentor e-Hybrid (PHEV) | 59 % | 52 % | 45 % | GANVAM PHEV (59,4 %) y anuncios de la generación anterior (61-68 % a 4-5 años) |
| Toyota C-HR 140H (HEV) | 68 % | 62 % | 57 % | GANVAM HEV (68 %) y anuncios del 125H de 2021 (72-79 % a 5 años). Cuota final: 60,5 % a 4 años |

Para usados (Mazda 2023 y Tesla 2023), aplicar la curva desde el **precio de compra del usado**, descontando los 3 años ya consumidos. Estimación: perder unos 6-8 puntos por año sobre el valor del usado.
