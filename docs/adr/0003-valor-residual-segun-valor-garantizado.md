# El Valor residual de un coche nuevo parte del valor que garantiza su financiera

Para comparar coches nuevos de marcas distintas, el Valor residual a los 4 años sale del mismo sitio en todos: la última cuota que garantiza su Financiación con cuota final a 48 meses y 15.000 km al año, más un 12 %. Las financieras fijan ese valor algo por debajo del que esperan, para no perder si el coche se devuelve, y el 12 % es el margen que ya tenían las estimaciones de los BYD. La curva se ajusta para pasar por ese punto (`segunValorGarantizado` en `src/data/coches.ts`): se fija la pérdida de los años siguientes y se deduce la del primero.

Antes, cada coche tenía su propia curva, sacada de anuncios de usados o de índices por motorización. La del Tesla Model 3 venía de usados de 2023 que se vendían caros, y se aplicaba sin datos al Model Y: los dejaba un 16 % y un 33 % por encima de lo que garantiza Tesla, frente al 11-12 % de los BYD. El valor garantizado es el único dato hacia delante, del propio fabricante y para ese coche exacto, y se puede comparar entre marcas.

Los coches sin Financiación con cuota final (los usados y el que ya tengo) siguen con su curva propia. Si cambia la oferta, hay que actualizar el valor garantizado con ella. El margen del 12 % es un supuesto: si aparecen datos de transacciones reales a 4 años, debe revisarse.
