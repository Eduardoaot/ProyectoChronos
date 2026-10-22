# Prompt · página de venta de Chronos One

Pega este archivo completo. No hace falta otro documento. Construye la página tal como está escrita. No preguntes, no propongas alternativas y no amplíes el encargo.

---

Eres desarrollador frontend. Entrega una sola página estática, en español, lista para abrir el `index.html` en el navegador y subirla a un hosting estático. Sin npm, sin bundler, sin framework.

Es la página de venta de un reloj de bolsillo que abre una rama personal del tiempo. La marca habla como una big tech distópica en una keynote: poca frase, mucho aire, pretenciosa, segura. El lector es el cliente final. La página cree en su producto. No digas que es ficción, un ejercicio, un bootcamp ni un comercial.

## Decisiones ya cerradas

- Marca pública: **CHRONOS**. Producto: **Chronos One**. No hay Chronos Two. No inventes otro nombre, otro modelo ni una empresa matriz.
- Idioma de la interfaz: español, tuteo. `lang="es"`.
- Tema por defecto: oscuro. Existe un tema claro. Los dos tienen que funcionar.
- Un solo acento de color, el Tempus, y solo dentro de la cápsula sellada del reloj. El resto es blanco y negro.
- El precio se lee sin hacer clic: 30 dólares al mes. Lo que se despliega son las condiciones.
- No hay pago, cuenta real ni servidor. El trámite termina en una fila simulada en el navegador.
- Los textos de la sección «Textos» se usan tal cual. No los mejores, no los acortes, no añadas eslóganes.

## Qué no es esta página

No es un kit de agencia. No lleva estadísticas inventadas, logos de gobiernos, testimonios, fotos de stock, badges, tiendas de apps, newsletter, chat, banner de cookies, redes sociales ni video.

No es una wiki del mundo. El apéndice final es contexto para ti. No lo cites, no lo resumas en la página y no lo conviertas en secciones.

No copies otra marca. No uses un isotipo de paréntesis angulares, un punto como parte del nombre, ni una botonera dibujada en ASCII. El objeto de esta página es el reloj.

## Voz

Frases cortas. Verbos en presente. Una idea por oración. Calma de quien ya ganó.

La página puede decir, y solo así de frío:

- La línea principal no se mueve.
- Diez usos al día. El undécimo no entra.
- Si dejas de pagar, la rama se cierra.

La página no dice: soluciones, potenciar, innovación, partner, experiencia única, el futuro es ahora, únete a la revolución, tecnología de otro nivel. Tampoco explica el chiste ni pide disculpas por el producto.

## Archivos

```
index.html
styles.css
site.js
```

El texto vive en el HTML. Si el JavaScript no carga, se leen el titular, los tres gestos, el precio y el trámite. La animación es una capa de más, no el lugar donde está el contenido.

## Sistema visual

Oficina en blanco y negro. El campo del primer viewport es una terminal apagada: glifos quietos, no una lluvia de código. El reloj es la única pieza con volumen. El Tempus es una masa plana dentro del cristal, no un brillo.

### Color

Dos temas. El token de una superficie oscura no es el token del texto. Las bandas que deben seguir negras usan `--ink-solid` en los dos temas.

Tema oscuro (`html` sin atributo, y `html[data-theme="dark"]`):

| Token | Hex | Uso |
|---|---|---|
| `--text` | `#f2f2f0` | Texto |
| `--text-soft` | `#a3a3a0` | Texto secundario |
| `--paper` | `#111111` | Fondo de página |
| `--hero` | `#0a0a0a` | Campo del primer viewport |
| `--mist` | `#1a1a18` | Celda suave |
| `--line` | `#2e2e2c` | Filetes |
| `--ink-solid` | `#0a0a0a` | Superficie que sigue negra |
| `--on-ink` | `#f2f2f0` | Texto sobre esa superficie |
| `--tempus` | `#5C2D86` | Solo la cápsula del reloj |

Tema claro (`html[data-theme="light"]`):

| Token | Hex | Uso |
|---|---|---|
| `--text` | `#111111` | Texto |
| `--text-soft` | `#5a5a5a` | Texto secundario |
| `--paper` | `#f4f4f2` | Fondo |
| `--hero` | `#e8e8e4` | Campo del primer viewport |
| `--mist` | `#e8e8e4` | Celda suave |
| `--line` | `#d6d6d2` | Filetes |
| `--ink-solid` | `#111111` | La celda de tres clics y la banda de la rama siguen negras |
| `--on-ink` | `#f4f4f2` | Texto sobre esa superficie |
| `--tempus` | `#4E2674` | Solo la cápsula del reloj |

Selección de texto: fondo `--text`, color `--paper`. Sin sombras, sin degradados, sin bordes redondeados de píldora, sin glass, sin blur de fondo. Los filetes son de 1px, color `--line`.

### Tipo

- Títulos, wordmark y número de precio: **Space Grotesk**, peso 400.
- Cuerpo, navegación, botones y formulario: **Manrope**, peso 300 en cuerpo y 400 en botones.
- Terminal y glifos: `ui-monospace, "Cascadia Code", Consolas, monospace`.

Cárgalas desde Google Fonts con `display=swap`. Si la red falla: Arial para las dos primeras y la pila mono de arriba.

Escala:

- Titular del hero: `clamp(1.85rem, 4.8vw, 3rem)`, medida máxima 16 caracteres por línea si el texto cupiera; este titular es corto y se queda en una línea en escritorio.
- Títulos de sección: `clamp(1.65rem, 3.6vw, 2.35rem)`.
- Cuerpo: `1.05rem`, interlineado `1.55`.
- Precio grande: `clamp(4.5rem, 12vw, 8rem)`, peso 400, sin ceros de adorno.

Nada en mayúsculas sostenidas salvo el wordmark CHRONOS y las cuatro líneas de la terminal. No pongas una etiqueta pequeña encima de cada título. No destaques una sola palabra del titular en otro color o en itálica.

### Medida

`--max: 72rem`. Padding horizontal de la página: `clamp(1.25rem, 4vw, 2.5rem)`. Cada celda tiene al menos `1.25rem` de padding interior. Entre secciones, `clamp(4.5rem, 9vw, 7rem)` de aire. El cuerpo no pasa de 62 caracteres cuando es un párrafo suelto.

### Botones y links

- Acción principal: rectángulo sin radio. Fondo del color de `--text`, texto del color de `--paper`. En una superficie `--ink-solid`, se invierte para seguir viéndose: fondo `--on-ink`, texto `--ink-solid`.
- Acción secundaria: texto con subrayado, sin caja.
- Área mínima de clic: 44×44 px. En móvil, los botones de verdad ocupan el ancho de la columna.
- Foco visible: `outline: 2px solid currentColor; outline-offset: 3px`. No lo quites.

### El reloj

Dibújalo en SVG, en la página. No uses una foto ni un mockup generado.

Es un reloj de bolsillo, visto de frente: caja circular, anillo, una corona arriba que es el botón, y un aro para la cadena. Sin numerales, sin manecillas decorativas, sin marca de lujo inventada, sin tornillos. La tapa no sugiere que se pueda abrir. En el centro, una cápsula irregular y chica, color `--tempus`, plana, como una masa quieta detrás del cristal. Esa es la única aparición del color en toda la página.

Al lado del reloj, o debajo en móvil, un estado en texto que cambia con los clics. El estado no depende de adivinar la animación.

### Glifos

Detrás del hero hay un campo de caracteres ya puestos, no generados como partículas. Juego permitido: `0 1 | - . :`. Densidad baja. No es Matrix, no sigue al cursor y no se regenera en bucle.

### Movimiento

Curva: `cubic-bezier(0.22, 1, 0.36, 1)`. Scroll nativo. `scroll-behavior: smooth` solo al pulsar un ancla, no para secuestrar la rueda.

Hay tres momentos, y nada más:

1. **Entrada, una vez.** Al cargar, el wordmark, el titular y el reloj aparecen en ese orden, en menos de 1,2 s. Durante ese instante una franja de glifos se sustituye de izquierda a derecha por el titular ya final. Luego el campo queda quieto. Un solo glifo puede parpadear a 1,4 s. No hay estrobo.
2. **Títulos al entrar en vista.** Los caracteres del título se asientan de izquierda a derecha. El estado de reposo es la palabra en Space Grotesk, nítida. Si alguien llega por ancla, el título ya está en ese estado. El título no se disuelve al quedar arriba.
3. **Respuesta al clic.** El botón del reloj, el despliegue del precio y el resultado del formulario cambian lo que se ve. Eso sí se anima, corto.

El reloj puede tener una inclinación muy lenta. No gira como ruleta. Con el dedo o el mouse se puede empujar un poco y vuelve. No uses `preventDefault` en el toque, ni `touch-action: none`. El dedo tiene que bajar la página. `touch-action: manipulation` en el reloj.

`prefers-reduced-motion: reduce` apaga entrada, parpadeo, inclinación y asentado de títulos. Los clics siguen cambiando el texto al instante.

Sin audio. Sin música. Sin video.

Nav fija, encima, sin fondo mientras el hero está en vista. Al salir del hero, el nav gana fondo `--paper` y un filete inferior, para que no se pierda. Sin blur.

## Composición

Una columna de bandas. Alineación a la izquierda. El hero puede centrar el reloj; el texto del hero queda alineado a la izquierda del bloque, no centrado en un póster.

Orden de la historia: qué es, qué hace el botón, cómo existe la rama, cuánto cuesta, entrar a la fila.

```
nav:  CHRONOS          Gestos   Rama   Precio   Trámite     tema

HERO
campo de glifos
reloj SVG
CHRONOS
El tiempo, en pausa.
párrafo
[ Ver los tres gestos ]

QUÉ ES          título y lead | tres frases

GESTOS          bento de cuatro celdas, sin huecos

RAMA            banda --ink-solid a todo el ancho
                terminal | tres pasos

PRECIO          30 visible | condiciones al pedirlas

CIERRE          dos salidas

PIE
```

### Navegación

Escritorio: wordmark CHRONOS a la izquierda, que apunta a `#top`. Enlaces: Gestos (`#gestos`), Rama (`#rama`), Precio (`#precio`), Trámite (`#tramite`). A la derecha, el control de tema.

Por debajo de 760 px no caben cuatro enlaces. Quedan el wordmark, un botón «Trámite» y un botón «Menú» que abre la lista. «Menú» pasa a «Cerrar» cuando está abierta. Cerrar con Escape y al seguir un enlace. El fondo del panel es `--paper`.

El control de tema dice «Claro» cuando el tema actual es oscuro, y «Oscuro» cuando el actual es claro. Guarda la elección en `localStorage` bajo la clave `chronos-theme`. Respeta `prefers-color-scheme` solo si no hay elección guardada.

Enlace de salto, visible al foco: «Saltar al contenido».

### Hero `#top`

Un objeto, un titular, un solo control.

El reloj ocupa como máximo el 42% del alto de la ventana en el teléfono, para que el titular y el botón se vean sin cazarlos. No es un lienzo a pantalla completa.

### Qué es

Sin ítem propio en el nav. Va justo después del hero. Dos columnas desde 800 px; en estrecho, primero el título y luego las frases.

### Gestos `#gestos`

Rejilla asimétrica, no cuatro tarjetas iguales.

- Escritorio, 12 columnas: «Un clic» ocupa 7. «Dos clics» ocupa 5, a la derecha. «Tres clics» ocupa 8, debajo, y es la celda `--ink-solid`. «Diez usos» ocupa las 4 restantes.
- Las cuatro celdas se tocan por filetes, no flotan con sombra. El conjunto llena el ancho. No dejes losas vacías.
- En una columna: orden Un clic, Dos clics, Tres clics, Diez usos. La celda de tres clics sigue en `--ink-solid`.

### Rama `#rama`

Banda `--ink-solid` de borde a borde de la ventana. El contenido interior respeta `--max`. Desde 800 px: terminal a la izquierda, tres pasos a la derecha. En estrecho, primero el título, luego la terminal, luego los pasos.

La terminal es un bloque mono con las cuatro líneas del texto. No es un input. No parpadea un cursor en bucle.

### Precio `#precio`

El número 30 y la frase «dólares al mes» se ven al llegar. El botón «Ver qué incluye» abre las tres condiciones en el mismo bloque. Al abrir, el botón pasa a «Ocultar condiciones» y las cierra. Estado inicial: cerrado. El precio no se esconde en ningún momento.

### Cierre

Dos celdas, no un hero repetido.

- Primera: la frase de la fila y el botón «Empezar el trámite», que lleva a `#tramite`.
- Segunda: la frase de quien todavía mira y el enlace «Leer el límite», que lleva a `#limite`.

### Trámite `#tramite`

Un formulario corto. Sin número de tarjeta, sin teléfono, sin dirección.

### Pie

Una línea de marca y la frase. Debajo, una sola vez, el texto `chronos.one` sin convertirlo en un enlace muerto. Debajo, en `--text-soft`: «Tempus sellado. No abrir.»

## Textos

Úsalos así.

**Title:** Chronos One. El tiempo, en pausa.

**Meta description:** Un reloj de bolsillo pausa, rebobina o adelanta diez segundos en tu rama personal. Treinta dólares al mes.

**Nav:** Gestos, Rama, Precio, Trámite, Menú, Cerrar, Claro, Oscuro, Saltar al contenido.

**Hero**

- Wordmark: CHRONOS
- Titular: El tiempo, en pausa.
- Párrafo: Un reloj de bolsillo abre una rama de la realidad que solo es tuya. La línea principal no se mueve.
- Botón: Ver los tres gestos

**Qué es**

- Título: Una rama con tu nombre.
- Lead: Cada persona deja una huella. El reloj se enlaza a la tuya.
- Frase 1: Ves el mundo, y el mundo de tu rama te responde.
- Frase 2: Lo que deshaces, lo recuerdas.
- Frase 3: Funciona sin señal. Bajo tierra, en el mar y en órbita.

**Gestos**

- Título: Tres gestos.
- Lead: El mismo botón. Cambia cuántas veces lo presionas.
- Celda 1, título: Un clic. Cuerpo: Tu rama se queda quieta. Tú te mueves.
- Celda 2, título: Dos clics. Cuerpo: Diez segundos atrás. Vuelves al punto donde estabas. Esos segundos se deshacen. Tú los recuerdas.
- Celda 3, título: Tres clics. Cuerpo: Diez segundos adelante. Tu conciencia espera. Tu cuerpo se queda donde está. Sigues siendo materia. El mundo no se aparta.
- Celda 4, `id="limite"`, título: Diez al día. Cuerpo: Diez usos. El undécimo no entra. Es el límite del aparato.

**Rama**

- Título: La línea sigue.
- Terminal, cuatro líneas exactas:

```
LÍNEA PRINCIPAL    intacta
RAMA               abierta
HUELLA             enlazada
USOS HOY           10 / 10
```

La última línea de la terminal sí cambia: muestra los usos que le quedan al reloj de la página, en formato `USOS HOY           07 / 10`.

- Paso 1, título: El trámite. Cuerpo: Ciento cuarenta gobiernos firmaron el registro. Pide tiempo, y diez copias. La fila es parte del producto.
- Paso 2, título: La rama. Cuerpo: Al terminar, el reloj abre tu copia. Nadie más la mueve.
- Paso 3, título: El reporte. Cuerpo: Tu lugar en la línea principal sigue la rutina. Cuando vuelves, lees qué hizo.

**Precio**

- Título: Treinta dólares.
- Número: 30
- Bajo el número: dólares al mes
- Párrafo: La membresía mantiene la rama abierta.
- Botón cerrado: Ver qué incluye
- Botón abierto: Ocultar condiciones
- Condición 1: Diez usos al día, cada día.
- Condición 2: El Tempus dura cinco años. Después hace falta otro Chronos One. No hay otro modelo.
- Condición 3: Si dejas de pagar, la rama se cierra y regresas a la línea principal. Los días de la rama no vuelven contigo.

**Cierre**

- Título de sección, solo para el lector de pantalla; visualmente mandan las dos celdas: Siguiente paso.
- Celda 1, frase: Si ya lo quieres, entra a la fila.
- Celda 1, botón: Empezar el trámite
- Celda 2, frase: Si aún lo miras, lee el límite.
- Celda 2, enlace: Leer el límite

**Trámite**

- Título: Pedir el trámite.
- Lead: El registro empieza por tu nombre. Las diez copias vienen después.
- Etiqueta: Nombre
- Etiqueta: Correo electrónico
- Botón: Entrar a la fila
- Error de nombre vacío: Escribe tu nombre.
- Error de correo vacío o inválido: Revisa el correo. Necesita una arroba y un dominio.
- Éxito, sustituye al formulario: Quedaste en la fila. Van a pedirte diez copias. Esta página no envió tus datos a ningún servidor.

**Pie**

- CHRONOS
- El tiempo, en pausa.
- chronos.one
- Tempus sellado. No abrir.

**Reloj, estados visibles** según el último gesto disparado:

- Inicial: Listo. Te quedan 10 usos hoy.
- Tras un clic: Pausa. Tu rama está quieta.
- Tras dos clics: Diez segundos atrás. Tú los recuerdas.
- Tras tres clics: Diez segundos adelante. Tu cuerpo no se movió.
- En cero: Hoy ya no hay usos. Mañana reinician.

El contador del estado inicial y el de cero usan el número real de usos restantes.

## Interacción del reloj

La corona es un `<button>` con nombre accesible «Usar Chronos One».

Los clics se acumulan en una ventana de 700 ms:

- 1 clic al cerrar la ventana: pausa.
- 2 clics: atrás.
- 3 clics o más dentro de la ventana: adelante. Los clics extra de esa misma ventana no cuentan como otro uso.

Cada gesto disparado gasta un uso. Empieza en 10. Al llegar a 0, el botón se desactiva y se muestra el estado de cero. Recargar la página reinicia los 10. No lo guardes en `localStorage`. La terminal de la rama muestra el mismo saldo, con los espacios necesarios para que el número quede alineado a la derecha de la columna de valores.

Junto al estado, una línea de tiempo simple en SVG o HTML: una raya horizontal y una marca. En pausa, la marca se queda. En atrás, la marca salta a la izquierda. En adelante, salta a la derecha. Con movimiento reducido, la marca cambia de lugar sin transición. No dibujes personas, calles ni accidentes.

## Formulario

`novalidate`. Comprueba al enviar. El error sale en un texto asociado al campo con `aria-describedby`, y el foco va al primer campo inválido. No valides con un alert. Un correo válido tiene texto, una arroba, y un punto después de la arroba.

Al acertar, el formulario se reemplaza por el párrafo de éxito. No hay `fetch`. No hay `mailto`.

## Accesible y sólido

- Contraste de texto sobre papel, sobre mist y sobre `--ink-solid` por encima de 4.5:1. El Tempus no se usa para texto ni para iconos pequeños.
- El reloj SVG tiene `role="img"` y `aria-label="Chronos One, reloj de bolsillo"`. La corona es el botón, no parte de esa imagen: no anides el botón dentro de un rol de imagen.
- Estados del reloj en un elemento con `aria-live="polite"`.
- Títulos de sección en `h2`. Un solo `h1`.
- El nav del móvil esconde los enlaces con un mecanismo que también los quite del tabulado cuando está cerrado.
- Se puede completar todo con teclado.

## Criterio de terminado

Antes de dar la página por hecha, comprueba en el navegador estas rutas. Si una falla, corrígela.

1. Escritorio ancho y 390 px de ancho. En el teléfono se ven el titular, el botón del hero y se puede hacer scroll de inmediato, con el dedo encima del reloj.
2. Los tres gestos disparan su frase. A los 10 usos el botón muere. La terminal coincide con el saldo.
3. El precio se lee cerrado. Al abrir, se leen las tres condiciones y el 30 sigue ahí.
4. El formulario rechaza nombre vacío y correo sin arroba. Con datos válidos muestra el éxito y no llama a la red.
5. Tema claro y tema oscuro: la celda de tres clics y la banda de la rama siguen negras. El nav se lee encima del hero y se lee al bajar.
6. Con `prefers-reduced-motion: reduce` no hay parpadeo ni recorrido de letras, y los textos están completos.
7. Llegar a `#gestos` o `#precio` desde la URL muestra el título ya legible.
8. Sin imágenes remotas, sin consola en rojo, sin secciones que este prompt no nombra.

## Apéndice · no publicar

Sirve para no contradecir el mundo. No lo conviertas en copy, en preguntas frecuentes ni en «la letra chica» extra.

El aparato lleva dentro una sustancia llamada Tempus: el tejido del tiempo, sellado. Si alguien fuerza la caja, el sello se pierde. Por eso el pie dice que no se abre, y no dice más.

La línea principal es el tronco compartido. La rama es una copia ligada a la huella de una persona. El reloj solo escribe en la rama. Dos ramas solo se cruzan si las dos personas se tienen en cuenta en ese instante. Eso no se explica en la página; las frases de «qué es» ya bastan.

El límite de diez usos es físico. No describas qué le pasa al cuerpo si se fuerza. La página solo dice que el undécimo no entra.

A los cinco años el Tempus de ese reloj ya no sirve y hay que comprar otro Chronos One. Ya está en las condiciones.

Quien no paga vuelve a la línea principal y lo vivido en la rama no le acompaña. Ya está en las condiciones. No añadas el modo en que duele, ni psiquiatría, ni sueños.

Mientras alguien está en su rama, su lugar en la línea principal continúa la rutina, y al volver hay un reporte. Ya está en el paso 3. No digas que esa versión no pide aumento, no hace huelga ni le conviene a las empresas. No vendas el producto a jefes.

No menciones laboratorios clandestinos, castigos a científicos, olor, sabor, armas, embarazos, apodos para niños nacidos en una rama, religiones, casinos, robos, ni qué pasa si una persona muere dentro de la rama.
