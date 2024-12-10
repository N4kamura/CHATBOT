const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

//

const flowYes = addKeyword(['si','s','i'])
    .addAnswer([
        "Link de formulario ciclista",
        "#GuardiánDeLaVía.",
        "¡Juntos recuperaremos las ciclovías de Lima!",
        "Si tienes otra problemática, ¡Vuelve a decirnos *hola*!",
    ]
    )

const flowNo = addKeyword(['no','n','o'])
    .addAnswer([
        "Link de formulario independiente",
        "#GuardiánDeLaVía.",
        "¡Juntos recuperaremos las ciclovías de Lima!",
        "Si tienes otra problemática, ¡Vuelve a decirnos *hola*!",
    ]
    )

const flowImage = addKeyword(EVENTS.MEDIA)
    .addAnswer([
        "¡Gracias por avisarnos!",
        "Estamos anotando todo lo que nos indicas, pero también queremos saber de ti para trabajar en conjunto.",
        "Te invitamos a llenar el siguiente formulario.",
        "*¿Perteneces a alguna organización ciclista?*",
        "*Sí*  / *No*",
    ],
    null,
    null,
    [flowYes, flowNo],
    )

const flowAskImage = addKeyword(["a","e","i","o","u"])
    .addAnswer([
        'Ayúdanos a mejorar las ciclovías, adjunta UNA evidencia fotográfica'
    ],
    null,
    null,
    flowImage
    )


const flowGracias = addKeyword(["a","e","i","o","u"])
    .addAnswer([
        "¡Gracias por avisarnos!",
        "Estamos anotando todo lo que nos indicas, pero también queremos saber de ti para trabajar en conjunto.",
        "Te invitamos a llenar el siguiente formulario.",
        "*¿Perteneces a alguna organización ciclista?*",
        "*Sí*  / *No*",
    ],
    null,
    null,
    [flowNo,flowYes]
    )

const flowabc = addKeyword(['a1','a2','a3','b1','b2','c1','c2','c3','d','e','f','g','h','i','j','k','l','m'])
    .addAnswer([
        '¿En qué tramo / cuadra de la ciclovía se localiza?\n',
    ],
    null,
    null,
    flowAskImage
    )

const flowopq = addKeyword(['o','p','q','o.','p.','q.'])
    .addAnswer([
        'Coméntanos en qué parte del distrito propones que realicemos la actividad'
    ],
    null,
    null,
    flowGracias
    )

const flow5 = addKeyword(['5','5.'])
    .addAnswer([
        '*Ausencia de actividades*',
        'o. Educación vial',
        'p. Asistencia mecánica',
        'q. Escuela de ciclismo urbano',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["o","p","q","O","P","Q"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (o-q)."
            );
        }
    },
    flowopq
    )

const flow4 = addKeyword(['4','4.'])
    .addAnswer([
        '*Implementación de nuevas ciclovías*',
        'Coméntanos tu idea',
    ],
    null,
    null,
    flowGracias
    )

const flow3 = addKeyword(['3','3.'])
    .addAnswer([
        '*Limpieza de ciclovías*',
        'j. Desmonte',
        'k. Basura',
        'l. Agua en ciclovía',
        'm. Maleza',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["j","k","l","m","J","K","L","M"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (j-m)."
            );
        }
    },
    flowabc
    )

const flow2 = addKeyword(['2','2.'])
    .addAnswer([
        '*Ausencia de fiscalización*',
        'e. Ambulantes',
        'f. Peatones imprudentes',
        'g. Mototaxis invadiendo vía',
        'h. Autos invadiendo vía',
        'i. Vehículos estacionados',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["e","f","g","h","i","E","F","G","H","I"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (e-i)."
            );
        }
    },
    flowabc
    )

const flowIntermidiate = addKeyword(["a","e","i","o","u","c1","c2","c3","b1","b2"])
    .addAnswer([
        '¿En qué tramo / cuadra de la ciclovía se localiza?\n',
    ],
    null,
    null,
    flowAskImage
    )

const flowa4 = addKeyword('a4')
    .addAnswer(
        "Indique que elemento de segregación se encuentra ausente",
        null,
        null,
        flowIntermidiate
    )

const flowc = addKeyword(['c','c.'])
    .addAnswer([
        '*Falta de señalización*',
        "c1. Horizontal",
        "c2. Vertical",
        "c3. Crucero ciclista",
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["c1","c2","c3","C1","C2","C3"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (c1-c3)."
            );
        }
    },
    flowIntermidiate)

const flowb = addKeyword(['b.','b'])
    .addAnswer([
        '*Tipo de daños*',
        'b1. Baches',
        'b2. Huecos',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["b1","b2","B1","B2"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (b1-b2)."
            );
        }
    },
    flowIntermidiate)

const flowa = addKeyword(['a','a.'])
    .addAnswer([
        '*Ausencia de elementos de segregación*',
        'a1. Bolardos',
        'a2. Topellantas',
        'a3. Tachones',
        'a4. Otros',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["a1","a2","a3","a4","A1","A2","A3","A4"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (a1-a4)."
            );
        }
    },
    [flowabc,flowa4])

const flow1 = addKeyword(['1','1.'])
    .addAnswer([
        '*Mantenimiento de ciclovías*',
        'a. Ausencia de elementos de segregación',
        'b. Tipo de daños',
        'c. Falta de señalización',
        'd. Falta de iluminacíon',
    ],
    { capture: true},
    async (ctx, {fallBack}) => {
        if (!["a","b","c","d","A","B","C","D"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (a-d)."
            );
        }
    },
    [flowa,flowb,flowc,flowabc])

const flowProblematica = addKeyword(["a","e","i","o","u"])
    .addAnswer([
        '*Escribe el número relacionado a la problemática:*',
        '1. Mantenimiento de ciclovía',
        '2. Ausencia de fiscalización',
        '3. Limpieza de ciclovía',
        '4. Implementación de nuevas ciclovías',
        '5. Ausencia de actividades',
    ],
    { capture: true },
    async (ctx, {fallBack}) => {
        if (!["1","2","3","4","5"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones (1-5)."
            );
        }
    },
    [flow1,flow2,flow3,flow4,flow5])

const flowSecundario = addKeyword(["a","e","i","o","u"])
    .addAnswer(
        'Escribe la ubicación o nombre de la ciclovía',
        null,null,flowProblematica)

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer(
        ["Hola, gracias por escribir a *Alerta Ciclovía*","¿En qué distrito se encuentra la problemática?"],
        null,null,flowSecundario
    )

//

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, flowImage])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
