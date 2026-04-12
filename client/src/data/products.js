import imageFrontFull from '../assets/imagefrontfull.jpeg';
import imageBackFull from '../assets/imagebackfull.jpeg';
import imageFront from '../assets/imagefront.jpeg';
import imageBack from '../assets/imageback.jpeg';

export const products = [
    {
        id: "the-signature-cape",
        name: "Veste-Cape L'Éclat de Lhema",
        archive_year: "2024",
        price: 850,
        currency: "MAD",
        stock: 3,
        total_edition: 10,
        images: [
            imageFrontFull,
            imageBackFull,
            imageFront,
            imageBack,
        ],
        is_limited_edition: true,
        description_title: "L'Élégance Exclusive : Votre Pièce d'Exception",
        description_subtitle: "Découvrez le raffinement absolu avec une création conçue pour vous faire sentir unique.",
        features: [
            {
                title: "Le Cachemire Royal",
                desc: "Un tissu noble, léger et respirant. C'est l'allié parfait pour vous envelopper de douceur et d'élégance tout au long des mois de mars, avril et mai."
            },
            {
                title: "Une Doublure en Satin Prestigieux",
                desc: "À l'intérieur, un satin d'une fluidité exceptionnelle caresse votre peau pour un confort absolu."
            },
            {
                title: "Des Finitions Artisanales",
                desc: "Les bordures et les côtés sont minutieusement travaillés à la main. Un détail raffiné qui fait de cette création une véritable pièce rare."
            },
            {
                title: "L'Art de la Couture",
                desc: "Une pièce qui célèbre le savoir-faire artisanal. L'assemblage est d'une précision mécanique, tandis que les finitions et les détails minutieux sont cousus à la main, dans la plus stricte tradition des ateliers de Haute Couture."
            }
        ]
    }
];
