# pick-my-drive

Comparador financiero para decidir **cómo** hacerte con un coche en España: contado, préstamo clásico, financiación con cuota final, renting o suscripción (el leasing aparece explicado, pero no aplica a particulares).

Cada **Escenario** (un coche combinado con una modalidad y una oferta) se simula mes a mes con todos sus costes: precio, impuestos, intereses y comisiones, energía, seguro, mantenimiento, averías al acabar la garantía, neumáticos, ITV, impuesto de circulación, penalizaciones, ayudas, valor residual y coste de oportunidad. El resultado es el **Coste neto** de cada opción en cada mes, para ver cuál gana y a partir de cuándo.

- Vocabulario del dominio: [`CONTEXT.md`](./CONTEXT.md)
- Decisiones: [`docs/adr`](./docs/adr)
- Datos por defecto, con fuentes y fechas: [`docs/research`](./docs/research)

## Desarrollo

```sh
npm install
npm run dev        # servidor local
npm test           # tests del motor de cálculo
npm run build      # web estática en dist/
```

El motor de cálculo (`src/engine`) no depende de la interfaz y está cubierto por tests. La comparativa se guarda en el navegador y se comparte como enlace (el estado va comprimido en la URL; no hay servidor).
